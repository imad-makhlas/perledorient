import assert from 'node:assert/strict'
import test from 'node:test'
import { productUpdatePayload } from './admin-product-payload.ts'
import { adminProductFromRow, normalizeAdminProductPatch } from './admin-product-record.ts'

test('normalizes editable artisan product values for the owner API', () => {
  assert.deepEqual(productUpdatePayload({ productName: '  Layali Necklace ', variantName: ' Antique gold ', price: 420, stock: 8, active: true, imageUrl: ' https://example.com/layali.jpg ' }), {
    productName: 'Layali Necklace', variantName: 'Antique gold', price: 420, stock: 8, active: true, imageUrl: 'https://example.com/layali.jpg',
  })
})

test('maps D1 admin product rows to the admin UI contract', () => {
  assert.deepEqual(adminProductFromRow({
    id: 'jewel-variant-1-a',
    product_id: 'jewel-1',
    slug: 'layali-necklace',
    product_name: 'Layali Necklace',
    variant_name: 'Antique gold',
    sku: 'PDO-001-A',
    price: 520,
    stock: 9,
    active: 1,
    image_url: '/assets/products/layali.jpg',
  }), {
    id: 'jewel-variant-1-a',
    productId: 'jewel-1',
    slug: 'layali-necklace',
    productName: 'Layali Necklace',
    variantName: 'Antique gold',
    sku: 'PDO-001-A',
    price: 520,
    stock: 9,
    active: true,
    imageUrl: '/assets/products/layali.jpg',
  })
})

test('normalizes and validates D1 admin product patches', () => {
  assert.deepEqual(normalizeAdminProductPatch({
    productName: '  Nour Pearl Earrings ',
    variantName: ' Warm gold ',
    price: 390,
    stock: 4,
    active: false,
    imageUrl: ' /assets/products/nour.jpg ',
  }), {
    productName: 'Nour Pearl Earrings',
    variantName: 'Warm gold',
    price: 390,
    stock: 4,
    active: false,
    imageUrl: '/assets/products/nour.jpg',
  })

  assert.throws(() => normalizeAdminProductPatch({ productName: '', variantName: 'Gold', price: 1, stock: 1, active: true, imageUrl: '' }))
  assert.throws(() => normalizeAdminProductPatch({ productName: 'Layali', variantName: 'Gold', price: -1, stock: 1, active: true, imageUrl: '' }))
})
