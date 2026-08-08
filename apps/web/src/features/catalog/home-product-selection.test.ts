import { describe, expect, it } from 'vitest'
import type { Product } from './catalog'
import { selectHomeProducts } from './home-product-selection'

const product = (id: string, featured: boolean): Product => ({
  id, slug: id, name: id, brand: "Perle d'Orient", category: 'Necklaces', image: `/${id}.jpg`,
  price: 500, stock: 2, featured, isNew: false, shortDescription: '', description: '', images: [`/${id}.jpg`],
  variants: [{ id: `${id}-variant`, name: 'Doré', sku: id, options: {}, price: 500, stock: 2 }], specifications: {},
})

describe('home product selection', () => {
  it('shows featured catalogue products first and limits the premium row to five pieces', () => {
    const products = [product('regular-1', false), product('featured-1', true), product('regular-2', false), product('featured-2', true), product('regular-3', false), product('regular-4', false)]
    expect(selectHomeProducts(products).map((item) => item.id)).toEqual(['featured-1', 'featured-2', 'regular-1', 'regular-2', 'regular-3'])
  })
})
