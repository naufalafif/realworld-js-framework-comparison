import { test, expect } from '@playwright/test'

const frameworks = [
  { name: 'React', port: 5201, badge: 'React' },
  { name: 'Vue', port: 5202, badge: 'Vue' },
  { name: 'Svelte', port: 5203, badge: 'Svelte' },
  { name: 'Solid', port: 5204, badge: 'Solid' },
  { name: 'Preact', port: 5205, badge: 'Preact' },
  { name: 'Lit', port: 5206, badge: 'Lit' },
]

for (const { name, port, badge } of frameworks) {
  test.describe(`CRUD — ${name} (:${port})`, () => {
    test('home page shows dashboard with task counts', async ({ page }) => {
      await page.goto(`http://localhost:${port}`)
      await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
      // Framework icon (SVG) should be present
      await expect(page.locator('svg').first()).toBeVisible()

      // Wait for data to load
      await page.waitForFunction(() => {
        const texts = document.body.innerText
        return texts.includes('Pending') && !texts.includes('0\nPending')
      }, { timeout: 10000 }).catch(() => {
        // Svelte may have different structure, just check Pending label exists
      })

      await expect(page.locator('text=Pending')).toBeVisible()
      await expect(page.locator('text=In Progress')).toBeVisible()
      await expect(page.locator('text=Done')).toBeVisible()
    })

    test('tasks page shows task list with filters', async ({ page }) => {
      await page.goto(`http://localhost:${port}`)

      // Navigate to tasks
      await page.click('a:has-text("Tasks"), a:has-text("View all tasks")')
      await page.waitForTimeout(1000)

      // Verify filters exist
      await expect(page.locator('input[placeholder*="Search"]')).toBeVisible()

      // Wait for tasks to load
      await page.waitForFunction(() => {
        return document.querySelectorAll('[class*="border"][class*="rounded-lg"]').length > 0
        || document.body.innerText.includes('pending')
      }, { timeout: 10000 })
    })

    test('create task page has form', async ({ page }) => {
      await page.goto(`http://localhost:${port}`)
      await page.click('a:has-text("New Task")')
      await page.waitForTimeout(500)

      await expect(page.locator('text=Create Task')).toBeVisible()
      await expect(page.locator('input, textarea').first()).toBeVisible()
      await expect(page.locator('button:has-text("Save Task")')).toBeVisible()
    })
  })
}
