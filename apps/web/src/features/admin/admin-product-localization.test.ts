import { describe, expect, it } from 'vitest'
import { catalogProductFromRow, normalizeAdminProductInput } from './admin-product-record'

const row = {
  id: 'variant-1', product_id: 'product-1', slug: 'layali', product_name: 'Collier Layali',
  name_en: 'Layali Necklace', name_fr: 'Collier Layali', name_ar: 'عقد ليالي',
  description_en: 'Legacy description', description_fr: 'Description française', description_ar: 'وصف عربي',
  category: 'Necklaces', material: 'Laiton', dimensions: '45 cm', variant_name: 'Doré', sku: 'PDO-BIJ-2026-0001',
  price: 520, comparison_price: null, stock: 3, active: 1, featured: 1, image_url: '/one.jpg',
  image_urls: ['/one.jpg', '/two.jpg', '/three.jpg'],
}

describe('French and Arabic product catalogue', () => {
  it('maps Arabic copy and all ordered images to the storefront', () => {
    expect(catalogProductFromRow(row, 'ar')).toMatchObject({
      name: 'عقد ليالي', description: 'وصف عربي', image: '/one.jpg', images: ['/one.jpg', '/two.jpg', '/three.jpg'],
    })
  })

  it('rejects more than six product photos', () => {
    expect(() => normalizeAdminProductInput({
      slug: 'layali', nameFr: 'Collier Layali', nameAr: 'عقد ليالي', descriptionFr: 'Description française', descriptionAr: 'وصف عربي',
      category: 'Necklaces', material: 'Laiton', dimensions: '45 cm', variantName: 'Doré', sku: 'PDO-BIJ-2026-0001',
      price: 520, comparisonPrice: null, stock: 3, active: true, featured: true, imageUrl: '/one.jpg',
      imageUrls: Array.from({ length: 7 }, (_, index) => `/${index}.jpg`),
    })).toThrow('Maximum 6 photos')
  })
})
