import { expect, test } from '@playwright/test'

test('desktop hero stays balanced at the first desktop breakpoint', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 })
  await page.goto('/')

  const heading = page.getByRole('heading', { name: "Un souffle d'Orient, façonné à la main." })
  const heroImage = page.getByRole('img', { name: 'Collection de bijoux artisanaux Casa de Perla' })
  await expect(heading).toBeVisible()
  await expect(heroImage).toBeVisible()

  const headingMetrics = await heading.evaluate((element) => {
    const styles = getComputedStyle(element)
    return {
      height: element.getBoundingClientRect().height,
      lineHeight: Number.parseFloat(styles.lineHeight),
    }
  })
  const imageBox = await heroImage.boundingBox()
  if (!imageBox) throw new Error('Desktop hero image has no bounding box')

  expect(headingMetrics.height / headingMetrics.lineHeight).toBeLessThanOrEqual(3.1)
  expect(imageBox.height).toBeLessThanOrEqual(380)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1024)
})
