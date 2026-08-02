import assert from 'node:assert/strict'
import test from 'node:test'
import { addCartItem, cartReducer, initialCartState, updateCartQuantity } from './cart.ts'

const variant = {
  productId: 'p-1',
  variantId: 'v-1',
  slug: 'atlas-weekender',
  name: 'Atlas Weekender',
  variantName: 'Navy',
  imageUrl: '/products/atlas-weekender.jpg',
  unitPrice: 1290,
  stockQuantity: 4,
}

test('cart combines a variant and caps its quantity at available stock', () => {
  const once = cartReducer(initialCartState, addCartItem(variant, 3))
  const twice = cartReducer(once, addCartItem(variant, 3))

  assert.equal(twice.items.length, 1)
  assert.equal(twice.items[0]?.quantity, 4)
})

test('cart removes a line when its quantity becomes zero', () => {
  const withItem = cartReducer(initialCartState, addCartItem(variant, 1))
  const emptied = cartReducer(withItem, updateCartQuantity('v-1', 0))

  assert.deepEqual(emptied.items, [])
})
