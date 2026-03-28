import { spawn, ChildProcess } from 'node:child_process'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '..')

interface Service {
  name: string
  filter: string
  color: string
}

const services: Service[] = [
  // Backends first
  { name: 'json-server', filter: '@comparison/server-json', color: '\x1b[33m' },
  { name: 'pty-server', filter: '@comparison/server-pty', color: '\x1b[33m' },
  // Dashboard
  { name: 'dashboard', filter: '@comparison/dashboard', color: '\x1b[97m' },
  // Perf stress
  { name: 'perf-react', filter: '@comparison/perf-react', color: '\x1b[34m' },
  { name: 'perf-vue', filter: '@comparison/perf-vue', color: '\x1b[32m' },
  { name: 'perf-svelte', filter: '@comparison/perf-svelte', color: '\x1b[31m' },
  { name: 'perf-solid', filter: '@comparison/perf-solid', color: '\x1b[35m' },
  // CRUD
  { name: 'crud-react', filter: '@comparison/crud-react', color: '\x1b[34m' },
  { name: 'crud-vue', filter: '@comparison/crud-vue', color: '\x1b[32m' },
  { name: 'crud-svelte', filter: '@comparison/crud-svelte', color: '\x1b[31m' },
  { name: 'crud-solid', filter: '@comparison/crud-solid', color: '\x1b[35m' },
  // XTerm
  { name: 'xterm-react', filter: '@comparison/xterm-react', color: '\x1b[34m' },
  { name: 'xterm-vue', filter: '@comparison/xterm-vue', color: '\x1b[32m' },
  { name: 'xterm-svelte', filter: '@comparison/xterm-svelte', color: '\x1b[31m' },
  { name: 'xterm-solid', filter: '@comparison/xterm-solid', color: '\x1b[35m' },
]

const RESET = '\x1b[0m'
const DIM = '\x1b[2m'
const processes: ChildProcess[] = []

function prefixStream(name: string, color: string, stream: NodeJS.ReadableStream) {
  const pad = name.padEnd(14)
  stream.on('data', (data: Buffer) => {
    const lines = data.toString().split('\n')
    for (const line of lines) {
      if (line.trim()) {
        process.stdout.write(`${color}${pad}${RESET} ${DIM}│${RESET} ${line}\n`)
      }
    }
  })
}

console.log('\x1b[97m\x1b[1m')
console.log('  JS Framework Comparison — Dev Server')
console.log('  =====================================')
console.log(`${RESET}`)
console.log(`  Dashboard:    http://localhost:1355`)
console.log(`  JSON Server:  http://localhost:3100`)
console.log(`  PTY Server:   ws://localhost:3200`)
console.log('')
console.log(`  Perf:   React :5101  Vue :5102  Svelte :5103  Solid :5104`)
console.log(`  CRUD:   React :5201  Vue :5202  Svelte :5203  Solid :5204`)
console.log(`  XTerm:  React :5301  Vue :5302  Svelte :5303  Solid :5304`)
console.log('')
console.log(`${DIM}  Starting 15 services...${RESET}\n`)

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function startService(service: Service) {
  const proc = spawn('pnpm', ['--filter', service.filter, 'dev'], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, FORCE_COLOR: '0' },
  })

  if (proc.stdout) prefixStream(service.name, service.color, proc.stdout)
  if (proc.stderr) prefixStream(service.name, service.color, proc.stderr)

  proc.on('exit', (code) => {
    if (code !== null && code !== 0) {
      console.log(`${service.color}${service.name}${RESET} exited with code ${code}`)
    }
  })

  processes.push(proc)
  return proc
}

async function startAll() {
  // Start backends + dashboard first (no port conflicts)
  for (const service of services.slice(0, 3)) {
    startService(service)
  }
  await sleep(1000)

  // Start remaining apps in batches of 4 (one per framework) with delays
  for (let i = 3; i < services.length; i += 4) {
    const batch = services.slice(i, i + 4)
    for (const service of batch) {
      startService(service)
      await sleep(500)
    }
    await sleep(1000)
  }
}

startAll()

// Graceful shutdown
function cleanup() {
  console.log(`\n${DIM}Shutting down all services...${RESET}`)
  for (const proc of processes) {
    proc.kill('SIGTERM')
  }
  process.exit(0)
}

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)
