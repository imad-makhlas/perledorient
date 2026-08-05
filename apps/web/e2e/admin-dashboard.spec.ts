import { expect, test } from '@playwright/test'

const product = {
  id: 'variant-1', productId: 'product-1', slug: 'collier-layali', nameEn: 'Layali Necklace', nameFr: 'Collier Layali',
  descriptionEn: 'Handcrafted oriental necklace.', descriptionFr: 'Collier oriental façonné à la main.', category: 'Necklaces',
  material: 'Gold-plated brass', dimensions: '42-48 cm', variantName: 'Antique gold', sku: 'PDO-001-A', price: 520,
  comparisonPrice: 650, stock: 7, active: true, featured: true, imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600',
}
const order = {
  orderNumber: 'PDO-20260805-ABC123', customerName: 'Sara Amrani', customerTelephone: '+212612345678', city: 'Casablanca',
  address: '12 rue des Fleurs', notes: '', subtotal: '520', deliveryFee: '0', total: '520', paymentMethod: 'WHATSAPP',
  status: 'PENDING_CONFIRMATION', createdAt: '2026-08-05T12:00:00Z', whatsappUrl: 'https://wa.me/212600000000',
  items: [{ productName: 'Layali Necklace', variantName: 'Antique gold', sku: 'PDO-001-A', quantity: 1, unitPrice: '520', lineTotal: '520' }],
}

test.beforeEach(async ({ page }) => {
  await page.route('**/api/v1/admin/products', (route) => route.fulfill({ json: [product] }))
  await page.route('**/api/v1/admin/orders', (route) => route.fulfill({ json: [order] }))
})

test('owner signs in and manages catalogue and WhatsApp orders from one responsive dashboard', async ({ page }, testInfo) => {
  await page.goto('/admin')
  await expect(page.getByRole('heading', { name: 'Atelier privé' })).toBeVisible()
  await page.getByLabel('Mot de passe').fill('password')
  await page.getByRole('button', { name: 'Ouvrir l’atelier' }).click()

  await expect(page.getByRole('heading', { name: 'Vue d’ensemble' })).toBeVisible()
  await expect(page.getByText('Commandes en attente')).toBeVisible()
  await page.getByRole('button', { name: /Catalogue/ }).click()
  await expect(page.getByText('Collier Layali', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: /Commandes/ }).click()
  await expect(page.getByText('PDO-20260805-ABC123')).toBeVisible()
  await expect(page.getByRole('link', { name: 'WhatsApp' })).toBeVisible()
  const confirmButton = page.getByRole('button', { name: 'Confirmee' })
  const confirmBox = await confirmButton.boundingBox()
  if (!confirmBox) throw new Error('Order confirmation action is missing')
  expect(confirmBox.height).toBeGreaterThanOrEqual(44)
  await expect.poll(() => confirmButton.evaluate((element) => getComputedStyle(element).borderColor)).toBe('rgb(221, 212, 201)')
  await expect.poll(() => confirmButton.evaluate((element) => getComputedStyle(element).backgroundColor)).toBe('rgb(255, 255, 255)')
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(() => window.innerWidth))
  await page.screenshot({ path: testInfo.outputPath('admin-dashboard.png'), fullPage: true })
})
