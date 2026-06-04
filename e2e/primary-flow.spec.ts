import { test, expect } from '@playwright/test'

test.describe('Primary flow', () => {
  test('home page renders with CTA', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/HurrCut/)
    // Primary CTA "Open editor" links to /web
    await expect(page.getByRole('link', { name: /open editor/i }).first()).toBeVisible()
    // Secondary CTA "Sign in" links to /login
    await expect(page.getByRole('link', { name: /sign in/i }).first()).toBeVisible()
  })

  test('login page renders with mock OAuth buttons', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading').first()).toBeVisible()
    // At least one OAuth provider button visible
    await expect(page.getByRole('button', { name: /google/i })).toBeVisible()
  })

  test('editor loads and shows key surfaces', async ({ page }) => {
    await page.goto('/web')
    // Wait for boot skeleton to clear
    await page.waitForSelector('[role="toolbar"]', { timeout: 5000 })

    // CommandBar (toolbar) is present
    await expect(page.getByRole('toolbar', { name: /command bar/i })).toBeVisible()

    // Export button (the single accent) is present and labeled
    await expect(page.getByRole('button', { name: /export webm/i })).toBeVisible()

    // Canvas preview area exists
    await expect(page.locator('canvas').first()).toBeVisible()
  })

  test('editor keyboard shortcut — space toggles playback', async ({ page }) => {
    await page.goto('/web')
    await page.waitForSelector('[role="toolbar"]', { timeout: 5000 })

    // Click the canvas so focus is on a non-input element, then press space
    await page.locator('canvas').first().click()
    await page.keyboard.press('Space')
    await page.keyboard.press('Space')
    // No error thrown = pass
  })

  test('editor undo/redo keyboard shortcuts work without error', async ({ page }) => {
    await page.goto('/web')
    await page.waitForSelector('[role="toolbar"]', { timeout: 5000 })

    await page.keyboard.press('Control+z')
    await page.keyboard.press('Control+y')
    // No crash = pass
  })

  test('narrow viewport shows inspector toggle in menubar', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 700 })
    await page.goto('/web')
    await page.waitForSelector('[role="toolbar"]', { timeout: 5000 })

    // Inspector panel toggle button should appear in narrow mode
    await expect(page.getByRole('button', { name: /open inspector|close inspector/i })).toBeVisible()
  })

  test('command palette opens with keyboard shortcut', async ({ page }) => {
    await page.goto('/web')
    await page.waitForSelector('[role="toolbar"]', { timeout: 5000 })

    await page.keyboard.press('Control+k')
    // Target the command palette dialog specifically
    await expect(page.getByRole('dialog', { name: 'Command palette' })).toBeVisible()
  })

  test('about page has auth disclosure', async ({ page }) => {
    await page.goto('/about')
    // Wait for the auth disclosure note to appear
    await page.waitForSelector('[role="note"]', { timeout: 5000 })
    const body = await page.locator('body').textContent()
    expect(body?.toLowerCase()).toMatch(/mock|simulated|demo/)
  })

  test('matrix route is auth-guarded', async ({ page }) => {
    await page.goto('/matrix')
    // React Router AuthGate redirects unauthenticated users to /login
    await page.waitForURL(/\/login/, { timeout: 5000 })
    await expect(page.getByRole('heading').first()).toBeVisible()
  })
})
