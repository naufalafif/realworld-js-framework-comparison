import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { round } from '../utils/stats'

interface ResultFile {
  framework: string
  app: string
  benchmarks: Array<{
    name: string
    stats: { mean: number; median: number; p95: number; stddev: number }
    runs: number
  }>
  buildMetrics?: {
    jsSizeGzip: number
    cssSizeGzip: number
    totalSizeGzip: number
    buildTimeMs: number
  }
}

export function generateMarkdownReport(resultsDir: string) {
  const apps = ['perf-stress', 'crud', 'xterm']
  const frameworks = ['react', 'vue', 'svelte'] as const
  let md = '# JavaScript Framework Comparison — Results\n\n'
  md += `Generated: ${new Date().toISOString()}\n\n`

  for (const app of apps) {
    const appDir = join(resultsDir, app)
    const files: Record<string, ResultFile> = {}

    try {
      for (const file of readdirSync(appDir)) {
        if (file.endsWith('.json')) {
          const content = JSON.parse(readFileSync(join(appDir, file), 'utf-8'))
          files[content.framework] = content
        }
      }
    } catch {
      continue
    }

    if (Object.keys(files).length === 0) continue

    md += `## ${app}\n\n`

    // Benchmark comparison table
    const allBenchmarks = new Set<string>()
    for (const f of Object.values(files)) {
      for (const b of f.benchmarks) allBenchmarks.add(b.name)
    }

    if (allBenchmarks.size > 0) {
      md += '### Performance\n\n'
      md += '| Benchmark | React (ms) | Vue (ms) | Svelte (ms) |\n'
      md += '|-----------|-----------|---------|------------|\n'

      for (const bench of allBenchmarks) {
        const row = [bench]
        for (const fw of frameworks) {
          const result = files[fw]?.benchmarks.find((b) => b.name === bench)
          if (result) {
            row.push(`${round(result.stats.median)} ±${round(result.stats.stddev)}`)
          } else {
            row.push('—')
          }
        }
        md += `| ${row.join(' | ')} |\n`
      }
      md += '\n'
    }

    // Build metrics
    const hasBuildMetrics = Object.values(files).some((f) => f.buildMetrics)
    if (hasBuildMetrics) {
      md += '### Bundle Size\n\n'
      md += '| Metric | React | Vue | Svelte |\n'
      md += '|--------|-------|-----|--------|\n'

      const metrics = ['JS (gzip)', 'CSS (gzip)', 'Total (gzip)', 'Build Time']
      for (const metric of metrics) {
        const row = [metric]
        for (const fw of frameworks) {
          const bm = files[fw]?.buildMetrics
          if (!bm) { row.push('—'); continue }
          switch (metric) {
            case 'JS (gzip)': row.push(`${round(bm.jsSizeGzip / 1024)} KB`); break
            case 'CSS (gzip)': row.push(`${round(bm.cssSizeGzip / 1024)} KB`); break
            case 'Total (gzip)': row.push(`${round(bm.totalSizeGzip / 1024)} KB`); break
            case 'Build Time': row.push(`${bm.buildTimeMs} ms`); break
          }
        }
        md += `| ${row.join(' | ')} |\n`
      }
      md += '\n'
    }
  }

  writeFileSync(join(resultsDir, 'comparison.md'), md)
  console.log(`Report written to ${join(resultsDir, 'comparison.md')}`)
}
