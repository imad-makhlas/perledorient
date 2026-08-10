import { expect, test } from '@playwright/test'

test('compact wordmark remains readable on a 320px mobile header', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto('/')

  const headerShell = page.locator('header > div')
  const logo = headerShell.getByRole('link', { name: 'Casa de Perla' })
  const wordmark = logo.locator('.display')
  const controls = headerShell.getByRole('group', { name: 'Choisir la langue' }).locator('..')
  await expect(wordmark).toBeVisible()

  const wordmarkMetrics = await wordmark.evaluate((element) => {
    const styles = getComputedStyle(element)
    return {
      height: element.getBoundingClientRect().height,
      lineHeight: Number.parseFloat(styles.lineHeight),
    }
  })
  const logoBox = await logo.boundingBox()
  const controlsBox = await controls.boundingBox()
  if (!logoBox || !controlsBox) throw new Error('Mobile header is missing its logo or controls')

  expect(wordmarkMetrics.height / wordmarkMetrics.lineHeight).toBeLessThanOrEqual(1.1)
  expect(logoBox.x + logoBox.width).toBeLessThanOrEqual(controlsBox.x - 8)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
})
