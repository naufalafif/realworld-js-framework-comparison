import { chromium } from 'playwright'
import { execSync, spawn, ChildProcess } from 'node:child_process'
import { join } from 'node:path'
import { collectPerfStress } from './collectors/perf-stress'
import { collectBuildMetrics } from './collectors/build-metrics'
import { writeJsonResults } from './reporters/json-reporter'
import { generateMarkdownReport } from './reporters/markdown-reporter'
import { mean, median, percentile, stddev, round } from './utils/stats'
import type { AggregatedResult, BenchmarkRun } from './utils/types'

const ROOT = join(import.meta.dirname, '..')
const RESULTS_DIR = join(ROOT, 'results')

interface AppConfig {
  name: string
  framework: 'react' | 'vue' | 'svelte'
  app: string
  dir: string
  port: number
}

const PERF_APPS: AppConfig[] = [
  { name: 'perf-react', framework: 'react', app: 'perf-stress', dir: 'apps/perf-stress/react', port: 5101 },
  { name: 'perf-vue', framework: 'vue', app: 'perf-stress', dir: 'apps/perf-stress/vue', port: 5102 },
  { name: 'perf-svelte', framework: 'svelte', app: 'perf-stress', dir: 'apps/perf-stress/svelte', port: 5103 },
]

const ALL_APPS: AppConfig[] = [
  ...PERF_APPS,
  { name: 'crud-react', framework: 'react', app: 'crud', dir: 'apps/crud/react', port: 5201 },
  { name: 'crud-vue', framework: 'vue', app: 'crud', dir: 'apps/crud/vue', port: 5202 },
  { name: 'crud-svelte', framework: 'svelte', app: 'crud', dir: 'apps/crud/svelte', port: 5203 },
  { name: 'xterm-react', framework: 'react', app: 'xterm', dir: 'apps/xterm/react', port: 5301 },
  { name: 'xterm-vue', framework: 'vue', app: 'xterm', dir: 'apps/xterm/vue', port: 5302 },
  { name: 'xterm-svelte', framework: 'svelte', app: 'xterm', dir: 'apps/xterm/svelte', port: 5303 },
]

function parseArgs() {
  const args = process.argv.slice(2)
  let app = 'all'
  let framework = 'all'
  let runs = 5

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--app' && args[i + 1]) app = args[++i]
    if (args[i] === '--framework' && args[i + 1]) framework = args[++i]
    if (args[i] === '--runs' && args[i + 1]) runs = parseInt(args[++i])
  }

  return { app, framework, runs }
}

function aggregateRuns(runs: BenchmarkRun[]): AggregatedResult[] {
  const grouped = new Map<string, BenchmarkRun[]>()

  for (const run of runs) {
    const key = `${run.name}:${run.framework}:${run.app}`
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(run)
  }

  const results: AggregatedResult[] = []

  for (const [, group] of grouped) {
    const durations = group.map((r) => r.metrics.duration_ms)
    const first = group[0]

    const result: AggregatedResult = {
      name: first.name,
      framework: first.framework,
      app: first.app,
      stats: {
        mean: round(mean(durations)),
        median: round(median(durations)),
        p95: round(percentile(durations, 95)),
        stddev: round(stddev(durations)),
        min: round(Math.min(...durations)),
        max: round(Math.max(...durations)),
      },
      runs: group.length,
    }

    // Memory delta
    const memDeltas = group
      .filter((r) => r.metrics.memory_before_kb && r.metrics.memory_after_kb)
      .map((r) => r.metrics.memory_after_kb! - r.metrics.memory_before_kb!)

    if (memDeltas.length > 0) {
      result.memoryDelta = {
        mean: round(mean(memDeltas)),
        median: round(median(memDeltas)),
      }
    }

    // FPS
    const fpsValues = group.filter((r) => r.metrics.fps).map((r) => r.metrics.fps!)
    if (fpsValues.length > 0) {
      result.fps = {
        mean: round(mean(fpsValues)),
        median: round(median(fpsValues)),
      }
    }

    results.push(result)
  }

  return results
}

async function startPreviewServer(appDir: string, port: number): Promise<ChildProcess> {
  // Build first
  console.log(`  Building ${appDir}...`)
  execSync('pnpm build', { cwd: join(ROOT, appDir), stdio: 'pipe' })

  console.log(`  Starting preview on port ${port}...`)
  const proc = spawn('pnpm', ['preview'], {
    cwd: join(ROOT, appDir),
    stdio: 'pipe',
    env: { ...process.env },
  })

  // Wait for server to be ready
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Preview server timeout')), 30000)
    proc.stdout?.on('data', (data: Buffer) => {
      if (data.toString().includes('Local:')) {
        clearTimeout(timeout)
        resolve()
      }
    })
    proc.stderr?.on('data', (data: Buffer) => {
      if (data.toString().includes('Local:')) {
        clearTimeout(timeout)
        resolve()
      }
    })
  })

  return proc
}

async function main() {
  const { app, framework, runs } = parseArgs()
  console.log(`\nBenchmark Runner`)
  console.log(`  App: ${app}`)
  console.log(`  Framework: ${framework}`)
  console.log(`  Runs: ${runs}\n`)

  // Filter apps
  let apps = app === 'all' ? PERF_APPS : PERF_APPS.filter((a) => a.app === app)
  if (framework !== 'all') apps = apps.filter((a) => a.framework === framework)

  if (apps.length === 0) {
    console.log('No matching apps found.')
    return
  }

  // Collect build metrics for all matching apps from ALL_APPS
  let buildApps = app === 'all' ? ALL_APPS : ALL_APPS.filter((a) => a.app === app)
  if (framework !== 'all') buildApps = buildApps.filter((a) => a.framework === framework)

  console.log('Collecting build metrics...')
  for (const appConfig of buildApps) {
    console.log(`  Building ${appConfig.name}...`)
    try {
      const buildMetrics = collectBuildMetrics(
        join(ROOT, appConfig.dir),
        appConfig.framework,
        appConfig.app,
      )
      console.log(`    JS: ${round(buildMetrics.jsSizeGzip / 1024)} KB (gzip)`)
      console.log(`    CSS: ${round(buildMetrics.cssSizeGzip / 1024)} KB (gzip)`)
      console.log(`    Build: ${buildMetrics.buildTimeMs} ms`)

      writeJsonResults(RESULTS_DIR, appConfig.app, appConfig.framework, [], buildMetrics)
    } catch (e) {
      console.log(`    Build failed: ${e}`)
    }
  }

  // Run perf-stress benchmarks
  const perfApps = apps.filter((a) => a.app === 'perf-stress')
  if (perfApps.length > 0) {
    console.log('\nRunning performance benchmarks...')
    const browser = await chromium.launch({ headless: true })

    for (const appConfig of perfApps) {
      console.log(`\n  ${appConfig.framework}:`)
      let server: ChildProcess | null = null

      try {
        server = await startPreviewServer(appConfig.dir, appConfig.port)
        const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
        const page = await context.newPage()

        await page.goto(`http://localhost:${appConfig.port}`, { waitUntil: 'networkidle' })
        await page.waitForTimeout(500)

        const rawResults = await collectPerfStress(page, appConfig.framework, runs)
        const aggregated = aggregateRuns(rawResults)

        // Print results
        for (const r of aggregated) {
          const warn = r.stats.stddev > r.stats.mean * 0.2 ? ' ⚠️ high variance' : ''
          console.log(`    ${r.name}: ${r.stats.median}ms (±${r.stats.stddev})${warn}`)
        }

        // Get build metrics for this app
        const buildMetrics = collectBuildMetrics(
          join(ROOT, appConfig.dir),
          appConfig.framework,
          appConfig.app,
        )

        writeJsonResults(RESULTS_DIR, appConfig.app, appConfig.framework, aggregated, buildMetrics)

        await context.close()
      } finally {
        server?.kill()
      }
    }

    await browser.close()
  }

  // Generate report
  console.log('\nGenerating comparison report...')
  generateMarkdownReport(RESULTS_DIR)
  console.log('\nDone!')
}

main().catch(console.error)
