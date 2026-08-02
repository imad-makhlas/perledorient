import { addCartItem, cartReducer, initialCartState, updateCartQuantity } from './cart'

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

describe('cartReducer', () => {
  it('combines an existing variant and caps quantity at available stock', () => {
    const once = cartReducer(initialCartState, addCartItem(variant, 3))
    const twice = cartReducer(once, addCartItem(variant, 3))

    expect(twice.items).toHaveLength(1)
    expect(twice.items[0].quantity).toBe(4)
  })

  it('removes a line when its quantity becomes zero', () => {
    const withItem = cartReducer(initialCartState, addCartItem(variant, 1))
    const emptied = cartReducer(withItem, updateCartQuantity('v-1', 0))

    expect(emptied.items).toEqual([])
  })
})
