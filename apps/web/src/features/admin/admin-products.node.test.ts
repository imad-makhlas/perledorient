import assert from 'node:assert/strict'
import test from 'node:test'
import { productUpdatePayload } from './admin-product-payload.ts'

test('normalizes editable artisan product values for the owner API', () => {
  assert.deepEqual(productUpdatePayload({ productName: '  Layali Necklace ', variantName: ' Antique gold ', price: 420, stock: 8, active: true, imageUrl: ' https://example.com/layali.jpg ' }), {
    productName: 'Layali Necklace', variantName: 'Antique gold', price: 420, stock: 8, active: true, imageUrl: 'https://example.com/layali.jpg',
  })
})
