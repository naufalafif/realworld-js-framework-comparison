import { test, expect } from '@playwright/test'

const frameworks = [
  { name: 'React', port: 5301 },
  { name: 'Vue', port: 5302 },
  { name: 'Svelte', port: 5303 },
  { name: 'Solid', port: 5304 },
  { name: 'Preact', port: 5305 },
  { name: 'Lit', port: 5306 },
]

for (const { name, port } of frameworks) {
  test.describe(`XTerm — ${name} (:${port})`, () => {
    test('loads terminal UI', async ({ page }) => {
      await page.goto(`http://localhost:${port}`)
      await expect(page.locator('h1')).toContainText('Terminal')

      // The framework badge should exist
      await expect(page.locator('h1 + span, h1 ~ span').first()).toBeVisible()
    })

    test('shows connection status indicator', async ({ page }) => {
      await page.goto(`http://localhost:${port}`)
      await page.waitForTimeout(1000)

      // Should show either Connected or Disconnected text
      const hasStatus = await page.evaluate(() => {
        const text = document.body.innerText
        return text.includes('Connected') || text.includes('Disconnected')
      })
      expect(hasStatus).toBe(true)
    })
  })
}
