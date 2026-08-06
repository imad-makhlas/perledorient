import { describe, expect, it } from 'vitest'
import { adminProductFromRow, catalogProductFromRow, generateProductSku, normalizeAdminProductInput } from './admin-product-record'

describe('admin product D1 records', () => {
  it('generates the next centralized yearly SKU', () => {
    expect(generateProductSku([], 2026)).toBe('PDO-BIJ-2026-0001')
    expect(generateProductSku([
      'PDO-BIJ-2025-0099',
      'PDO-BIJ-2026-0002',
      'PDO-BIJ-2026-0012',
      'LEGACY-001',
    ], 2026)).toBe('PDO-BIJ-2026-0013')
  })

  it('maps D1 rows to the admin UI contract', () => {
    expect(adminProductFromRow({
      id: 'jewel-variant-1-a',
      product_id: 'jewel-1',
      slug: 'layali-necklace',
      product_name: 'Layali Necklace',
      name_en: 'Layali Necklace',
      name_fr: 'Collier Layali',
      description_en: 'An oriental necklace.',
      description_fr: 'Un collier oriental.',
      category: 'Necklaces',
      material: 'Gold-plated brass',
      dimensions: '42-48 cm',
      variant_name: 'Antique gold',
      sku: 'PDO-001-A',
      price: 520,
      comparison_price: 650,
      stock: 9,
      active: 1,
      featured: 1,
      image_url: '/assets/products/layali.jpg',
    })).toEqual({
      id: 'jewel-variant-1-a',
      productId: 'jewel-1',
      slug: 'layali-necklace',
      nameEn: 'Layali Necklace',
      nameFr: 'Collier Layali',
      descriptionEn: 'An oriental necklace.',
      descriptionFr: 'Un collier oriental.',
      category: 'Necklaces',
      material: 'Gold-plated brass',
      dimensions: '42-48 cm',
      variantName: 'Antique gold',
      sku: 'PDO-001-A',
      price: 520,
      comparisonPrice: 650,
      stock: 9,
      active: true,
      featured: true,
      imageUrl: '/assets/products/layali.jpg',
    })
  })

  it('normalizes and validates bilingual product inputs', () => {
    expect(normalizeAdminProductInput({
      slug: ' nour-pearl-earrings ',
      nameEn: '  Nour Pearl Earrings ',
      nameFr: ' Boucles Nour ',
      descriptionEn: ' Handmade pearl earrings. ',
      descriptionFr: ' Boucles artisanales en perles. ',
      category: ' Earrings ',
      material: ' Freshwater pearl ',
      dimensions: ' 3.2 cm ',
      variantName: ' Warm gold ',
      sku: ' PDO-002-A ',
      price: 390,
      comparisonPrice: 450,
      stock: 4,
      active: false,
      featured: true,
      imageUrl: ' /assets/products/nour.jpg ',
    })).toEqual({
      slug: 'nour-pearl-earrings',
      nameEn: 'Nour Pearl Earrings',
      nameFr: 'Boucles Nour',
      descriptionEn: 'Handmade pearl earrings.',
      descriptionFr: 'Boucles artisanales en perles.',
      category: 'Earrings',
      material: 'Freshwater pearl',
      dimensions: '3.2 cm',
      variantName: 'Warm gold',
      sku: 'PDO-002-A',
      price: 390,
      comparisonPrice: 450,
      stock: 4,
      active: false,
      featured: true,
      imageUrl: '/assets/products/nour.jpg',
    })

    expect(() => normalizeAdminProductInput({ slug: '', nameEn: '', nameFr: '', descriptionEn: '', descriptionFr: '', category: '', material: '', dimensions: '', variantName: 'Gold', sku: '', price: 1, comparisonPrice: null, stock: 1, active: true, featured: false, imageUrl: '' })).toThrow()
  })

  it('maps a D1 row to the selected storefront locale', () => {
    const row = {
      id: 'variant-1', product_id: 'product-1', slug: 'layali', product_name: 'Layali', name_en: 'Layali Necklace', name_fr: 'Collier Layali',
      description_en: 'English description', description_fr: 'Description francaise', category: 'Necklaces', material: 'Brass', dimensions: '45 cm',
      variant_name: 'Gold', sku: 'PDO-001-A', price: 520, comparison_price: 650, stock: 3, active: 1, featured: 1, image_url: '/layali.jpg',
    }
    expect(catalogProductFromRow(row, 'fr')).toMatchObject({ name: 'Collier Layali', description: 'Description francaise', price: 520, stock: 3 })
  })
})
