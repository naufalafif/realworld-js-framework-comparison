// Programmatic entry point for json-server
// Primary usage: `pnpm dev` runs `json-server --port 3100 db.json` via CLI
// This file provides a programmatic alternative if needed

import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbPath = join(__dirname, 'db.json')

try {
  execFileSync('npx', ['json-server', '--port', '3100', dbPath], { stdio: 'inherit' })
} catch {
  // Server was stopped
}
