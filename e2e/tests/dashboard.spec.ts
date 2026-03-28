import { test, expect } from '@playwright/test'

test.describe('Dashboard (:1355)', () => {
  test('loads and shows all app cards', async ({ page }) => {
    await page.goto('http://localhost:1355')
    await expect(page.locator('h1')).toContainText('JS Framework Comparison')

    // Check all 3 sections exist
    await expect(page.getByRole('heading', { name: /Performance Stress Test/ })).toBeVisible()
    await expect(page.getByRole('heading', { name: /CRUD Task Manager/ })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Terminal Streamer/ })).toBeVisible()

    // Check all 18 app cards (6 frameworks × 3 app types)
    const links = page.locator('a[href*="localhost"]')
    await expect(links).toHaveCount(18)
  })
})
