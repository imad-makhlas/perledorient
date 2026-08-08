import { expect, test } from '@playwright/test'

test('Arabic catalogue controls use readable typography without Latin letter spacing', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('perle-d-orient-locale', 'ar'))
  await page.goto('/catalogue')

  const category = page.getByRole('button', { name: 'كل المجوهرات' })
  await expect(category).toBeVisible()

  const typography = await category.evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      fontSize: Number.parseFloat(style.fontSize),
      letterSpacing: style.letterSpacing,
    }
  })

  expect(typography.fontSize).toBeGreaterThanOrEqual(13)
  expect(['normal', '0px']).toContain(typography.letterSpacing)
})
