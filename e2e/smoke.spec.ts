import { expect, test } from '@playwright/test'

test('health endpoint responds', async ({ request }) => {
  const response = await request.get('/api/health')
  expect(response.status()).toBe(200)
  expect((await response.json()).status).toBe('ok')
})

test('home page renders its heading', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('dashboard sends logged-out visitors to login', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/login/)
  await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible()
})

test('mobile menu opens without console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })

  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible()
  expect(errors).toEqual([])
})

test('login page has no sideways scroll at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 })
  await page.goto('/login')
  await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible()

  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(0)
})
