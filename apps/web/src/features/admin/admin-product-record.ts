import type { AdminProduct, EditableAdminProduct } from './admin-products'
import type { Product } from '../catalog/catalog'

export type AdminProductRow = {
  id: string
  product_id: string
  slug: string
  product_name: string
  name_en: string
  name_fr: string
  description_en: string
  description_fr: string
  category: string
  material: string
  dimensions: string
  variant_name: string
  sku: string
  price: number
  comparison_price: number | null
  stock: number
  active: number
  featured: number
  image_url: string
}

export function generateProductSku(existingSkus: string[], year = new Date().getUTCFullYear()) {
  const prefix = `PDO-BIJ-${year}-`
  const highest = existingSkus.reduce((maximum, sku) => {
    if (!sku.startsWith(prefix)) return maximum
    const sequence = Number(sku.slice(prefix.length))
    return Number.isInteger(sequence) ? Math.max(maximum, sequence) : maximum
  }, 0)
  return `${prefix}${String(highest + 1).padStart(4, '0')}`
}

export function adminProductFromRow(row: AdminProductRow): AdminProduct {
  return {
    id: row.id,
    productId: row.product_id,
    slug: row.slug,
    nameEn: row.name_en || row.product_name,
    nameFr: row.name_fr || row.name_en || row.product_name,
    descriptionEn: row.description_en || '',
    descriptionFr: row.description_fr || row.description_en || '',
    category: row.category || 'Necklaces',
    material: row.material || '',
    dimensions: row.dimensions || '',
    variantName: row.variant_name,
    sku: row.sku,
    price: row.price,
    comparisonPrice: row.comparison_price,
    stock: row.stock,
    active: row.active === 1,
    featured: row.featured === 1,
    imageUrl: row.image_url,
  }
}

export function normalizeAdminProductInput(input: EditableAdminProduct): EditableAdminProduct {
  const slug = input.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const nameEn = input.nameEn.trim()
  const nameFr = input.nameFr.trim()
  const descriptionEn = input.descriptionEn.trim()
  const descriptionFr = input.descriptionFr.trim()
  const category = input.category.trim()
  const material = input.material.trim()
  const dimensions = input.dimensions.trim()
  const variantName = input.variantName.trim()
  const sku = input.sku.trim().toUpperCase()
  const imageUrl = input.imageUrl.trim()
  const price = Number(input.price)
  const comparisonPrice = input.comparisonPrice === null || input.comparisonPrice === undefined || input.comparisonPrice === 0 ? null : Number(input.comparisonPrice)
  const stock = Number(input.stock)

  if (!slug || slug.length > 120) throw new Error('Invalid slug')
  if (nameEn.length < 2 || nameEn.length > 120 || nameFr.length < 2 || nameFr.length > 120) throw new Error('Invalid product name')
  if (!descriptionEn || !descriptionFr) throw new Error('Descriptions are required')
  if (!category || !sku) throw new Error('Category and SKU are required')
  if (variantName.length < 2 || variantName.length > 120) throw new Error('Invalid finish')
  if (!Number.isFinite(price) || price < 0) throw new Error('Invalid price')
  if (comparisonPrice !== null && (!Number.isFinite(comparisonPrice) || comparisonPrice <= price)) throw new Error('Invalid comparison price')
  if (!Number.isInteger(stock) || stock < 0) throw new Error('Invalid stock')

  return { slug, nameEn, nameFr, descriptionEn, descriptionFr, category, material, dimensions, variantName, sku, price, comparisonPrice, stock, active: Boolean(input.active), featured: Boolean(input.featured), imageUrl }
}

export function catalogProductFromRow(row: AdminProductRow, locale: 'en' | 'fr'): Product {
  const name = locale === 'fr' ? (row.name_fr || row.name_en || row.product_name) : (row.name_en || row.product_name)
  const description = locale === 'fr' ? (row.description_fr || row.description_en) : row.description_en
  return {
    id: row.product_id,
    slug: row.slug,
    name,
    brand: "Perle d'Orient",
    category: row.category,
    material: row.material,
    dimensions: row.dimensions,
    image: row.image_url,
    images: [row.image_url],
    price: row.price,
    comparisonPrice: row.comparison_price ?? undefined,
    stock: row.stock,
    featured: row.featured === 1,
    isNew: false,
    shortDescription: description,
    description,
    specifications: { Material: row.material, Finish: row.variant_name, Dimensions: row.dimensions },
    variants: [{ id: row.id, name: row.variant_name, sku: row.sku, options: { Finish: row.variant_name }, price: row.price, stock: row.stock, image: row.image_url }],
  }
}
