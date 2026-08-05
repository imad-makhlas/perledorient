import type { AdminProduct, EditableAdminProduct } from './admin-products'

export type AdminProductRow = {
  id: string
  product_id: string
  slug: string
  product_name: string
  variant_name: string
  sku: string
  price: number
  stock: number
  active: number
  image_url: string
}

export function adminProductFromRow(row: AdminProductRow): AdminProduct {
  return {
    id: row.id,
    productId: row.product_id,
    slug: row.slug,
    productName: row.product_name,
    variantName: row.variant_name,
    sku: row.sku,
    price: row.price,
    stock: row.stock,
    active: row.active === 1,
    imageUrl: row.image_url,
  }
}

export function normalizeAdminProductPatch(input: EditableAdminProduct): EditableAdminProduct {
  const productName = input.productName.trim()
  const variantName = input.variantName.trim()
  const imageUrl = input.imageUrl.trim()
  const price = Number(input.price)
  const stock = Number(input.stock)

  if (productName.length < 2 || productName.length > 120) throw new Error('Invalid product name')
  if (variantName.length < 2 || variantName.length > 120) throw new Error('Invalid finish')
  if (!Number.isFinite(price) || price < 0) throw new Error('Invalid price')
  if (!Number.isInteger(stock) || stock < 0) throw new Error('Invalid stock')

  return { productName, variantName, price, stock, active: Boolean(input.active), imageUrl }
}
