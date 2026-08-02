import { buildBasicAuthHeader, type AdminCredentials } from './admin-orders'
import { productUpdatePayload } from './admin-product-payload'

export type AdminProduct = {
  id: string
  productId: string
  slug: string
  productName: string
  variantName: string
  sku: string
  price: number
  stock: number
  active: boolean
  imageUrl: string
}

export type EditableAdminProduct = Pick<AdminProduct, 'productName' | 'variantName' | 'price' | 'stock' | 'active' | 'imageUrl'>

export async function fetchAdminProducts(credentials: AdminCredentials): Promise<AdminProduct[]> {
  const response = await fetch('/api/v1/admin/products', { headers: { Authorization: buildBasicAuthHeader(credentials.email, credentials.password) } })
  if (!response.ok) throw new Error('Unable to load the jewelry catalogue')
  return response.json() as Promise<AdminProduct[]>
}

export async function updateAdminProduct(credentials: AdminCredentials, product: AdminProduct): Promise<AdminProduct> {
  const response = await fetch(`/api/v1/admin/products/${encodeURIComponent(product.id)}`, {
    method: 'PATCH',
    headers: { Authorization: buildBasicAuthHeader(credentials.email, credentials.password), 'Content-Type': 'application/json' },
    body: JSON.stringify(productUpdatePayload(product)),
  })
  if (!response.ok) throw new Error('Unable to save this piece')
  return response.json() as Promise<AdminProduct>
}
