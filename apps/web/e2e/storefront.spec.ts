import { expect, test } from '@playwright/test'

test('customer browses, selects a variant, and adds it to the cart', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /explore the collection/i }).click()
  await page.getByRole('link', { name: /Atlas Chronograph/i }).first().click()
  await page.getByRole('button', { name: /add to cart/i }).click()
  await page.getByRole('link', { name: /cart: 1/i }).click()
  await expect(page.getByRole('heading', { name: /cart/i })).toBeVisible()
})
