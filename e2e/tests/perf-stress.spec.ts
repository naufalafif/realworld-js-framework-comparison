import { test, expect } from '@playwright/test'

const frameworks = [
  { name: 'React', port: 5101 },
  { name: 'Vue', port: 5102 },
  { name: 'Svelte', port: 5103 },
]

for (const { name, port } of frameworks) {
  test.describe(`Perf Stress — ${name} (:${port})`, () => {
    test('loads with correct title', async ({ page }) => {
      await page.goto(`http://localhost:${port}`)
      await expect(page.locator('h1')).toContainText(`Performance Stress Test — ${name}`)
    })

    test('has all benchmark buttons', async ({ page }) => {
      await page.goto(`http://localhost:${port}`)
      await expect(page.locator('button:has-text("Create 10,000 rows")')).toBeVisible()
      await expect(page.locator('button:has-text("Update every 10th row")')).toBeVisible()
      await expect(page.locator('button:has-text("Swap rows")')).toBeVisible()
      await expect(page.locator('button:has-text("Select row")')).toBeVisible()
      await expect(page.locator('button:has-text("Append 1,000 rows")')).toBeVisible()
      await expect(page.locator('button:has-text("Clear all")')).toBeVisible()
    })

    test('has view tabs', async ({ page }) => {
      await page.goto(`http://localhost:${port}`)
      await expect(page.locator('button:has-text("List Operations")')).toBeVisible()
      await expect(page.locator('button:has-text("Deep Tree")')).toBeVisible()
      await expect(page.locator('button:has-text("Rapid Counter")')).toBeVisible()
    })

    test('create 10k rows benchmark works', async ({ page }) => {
      await page.goto(`http://localhost:${port}`)
      await page.click('button:has-text("Create 10,000 rows")')

      // Wait for rows to render
      await page.waitForFunction(() => {
        return document.querySelectorAll('tbody tr').length > 100
      }, { timeout: 15000 })

      // Verify row count text
      await expect(page.locator('text=Rows: 10,000')).toBeVisible()

      // Verify benchmark result was captured
      const hasResult = await page.evaluate(() => window.__BENCH_RESULTS__?.length > 0)
      expect(hasResult).toBe(true)
    })

    test('clear all rows works', async ({ page }) => {
      await page.goto(`http://localhost:${port}`)
      await page.click('button:has-text("Create 10,000 rows")')
      await page.waitForFunction(() => document.querySelectorAll('tbody tr').length > 100, { timeout: 15000 })

      await page.click('button:has-text("Clear all")')
      await page.waitForTimeout(500)

      await expect(page.locator('text=Rows: 0')).toBeVisible()
    })
  })
}
