import { describe, expect, it } from 'vitest'
import { adminProductFromRow, normalizeAdminProductPatch } from './admin-product-record'

describe('admin product D1 records', () => {
  it('maps D1 rows to the admin UI contract', () => {
    expect(adminProductFromRow({
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
    })).toEqual({
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

  it('normalizes and validates admin patches', () => {
    expect(normalizeAdminProductPatch({
      productName: '  Nour Pearl Earrings ',
      variantName: ' Warm gold ',
      price: 390,
      stock: 4,
      active: false,
      imageUrl: ' /assets/products/nour.jpg ',
    })).toEqual({
      productName: 'Nour Pearl Earrings',
      variantName: 'Warm gold',
      price: 390,
      stock: 4,
      active: false,
      imageUrl: '/assets/products/nour.jpg',
    })

    expect(() => normalizeAdminProductPatch({ productName: '', variantName: 'Gold', price: 1, stock: 1, active: true, imageUrl: '' })).toThrow()
    expect(() => normalizeAdminProductPatch({ productName: 'Layali', variantName: 'Gold', price: -1, stock: 1, active: true, imageUrl: '' })).toThrow()
  })
})
