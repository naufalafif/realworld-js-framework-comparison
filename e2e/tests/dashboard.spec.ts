import { test, expect } from '@playwright/test'

test.describe('Dashboard (:1355)', () => {
  test('loads and shows all app cards', async ({ page }) => {
    await page.goto('http://localhost:1355')
    await expect(page.locator('h1')).toContainText('JS Framework Comparison')

    // Check all 3 sections exist
    await expect(page.getByRole('heading', { name: /Performance Stress Test/ })).toBeVisible()
    await expect(page.getByRole('heading', { name: /CRUD Task Manager/ })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Terminal Streamer/ })).toBeVisible()

    // Check all 9 app cards
    const links = page.locator('a[href*="localhost"]')
    await expect(links).toHaveCount(9)
  })

  test('has quick compare buttons', async ({ page }) => {
    await page.goto('http://localhost:1355')
    await expect(page.locator('button:has-text("Open all 9 apps")')).toBeVisible()
  })
})
