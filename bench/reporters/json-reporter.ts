import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import type { AggregatedResult, BuildMetrics } from '../utils/types'

export function writeJsonResults(
  outputDir: string,
  app: string,
  framework: string,
  results: AggregatedResult[],
  buildMetrics?: BuildMetrics,
) {
  const dir = join(outputDir, app)
  mkdirSync(dir, { recursive: true })

  const output = {
    framework,
    app,
    timestamp: new Date().toISOString(),
    benchmarks: results,
    buildMetrics,
  }

  writeFileSync(
    join(dir, `${framework}.json`),
    JSON.stringify(output, null, 2),
  )
}
