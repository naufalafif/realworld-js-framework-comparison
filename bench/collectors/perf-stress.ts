import type { Page } from 'playwright'
import type { BenchmarkRun } from '../utils/types'

const BENCHMARKS = [
  'create-10k-rows',
  'update-every-10th',
  'swap-rows',
  'select-row',
  'append-1k-rows',
  'clear-all-rows',
]

// Map benchmark names to button text
const BUTTON_MAP: Record<string, string> = {
  'create-10k-rows': 'Create 10,000 rows',
  'update-every-10th': 'Update every 10th row',
  'swap-rows': 'Swap rows',
  'select-row': 'Select row',
  'append-1k-rows': 'Append 1,000 rows',
  'clear-all-rows': 'Clear all',
}

export async function collectPerfStress(
  page: Page,
  framework: 'react' | 'vue' | 'svelte',
  runs: number,
): Promise<BenchmarkRun[]> {
  const results: BenchmarkRun[] = []

  for (let run = 0; run < runs; run++) {
    // Ensure we're on list view
    await page.click('button:has-text("List Operations")')
    await page.waitForTimeout(200)

    for (const benchName of BENCHMARKS) {
      // For benchmarks that need existing rows, create them first
      if (benchName !== 'create-10k-rows' && benchName !== 'append-1k-rows') {
        const rowCount = await page.locator('tbody tr').count()
        if (rowCount === 0) {
          await page.click(`button:has-text("${BUTTON_MAP['create-10k-rows']}")`)
          await page.waitForTimeout(500)
          // Clear bench results
          await page.evaluate(() => { window.__BENCH_RESULTS__ = [] })
        }
      }

      const beforeCount = await page.evaluate(() => window.__BENCH_RESULTS__?.length || 0)

      // Click the benchmark button
      const buttonText = BUTTON_MAP[benchName]
      await page.click(`button:has-text("${buttonText}")`)

      // Wait for result to appear
      await page.waitForFunction(
        (expected) => (window.__BENCH_RESULTS__?.length || 0) > expected,
        beforeCount,
        { timeout: 30000 },
      )

      // Get the latest result
      const latestResult = await page.evaluate(() => {
        const results = window.__BENCH_RESULTS__
        return results[results.length - 1]
      })

      if (latestResult) {
        results.push({
          name: benchName,
          framework,
          app: 'perf-stress',
          metrics: latestResult.metrics,
          timestamp: latestResult.timestamp,
        })
      }

      // Small delay between benchmarks
      await page.waitForTimeout(100)
    }

    // Reset for next run
    await page.evaluate(() => { window.__BENCH_RESULTS__ = [] })
    // Clear the list
    const clearBtn = page.locator('button:has-text("Clear all")')
    if (await clearBtn.isEnabled()) {
      await clearBtn.click()
      await page.waitForTimeout(200)
    }
  }

  return results
}
