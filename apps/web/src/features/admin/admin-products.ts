import { buildBasicAuthHeader, type AdminCredentials } from './admin-orders'
import { productUpdatePayload } from './admin-product-payload'

export type AdminProduct = {
  id: string
  productId: string
  slug: string
  nameFr: string
  nameAr: string
  descriptionFr: string
  descriptionAr: string
  category: string
  material: string
  dimensions: string
  variantName: string
  sku: string
  price: number
  comparisonPrice: number | null
  stock: number
  active: boolean
  featured: boolean
  imageUrl: string
  imageUrls: string[]
}

export type EditableAdminProduct = Omit<AdminProduct, 'id' | 'productId'>

async function apiError(response: Response, fallback: string) {
  try {
    const body = await response.json() as { error?: string }
    return body.error || fallback
  } catch {
    return fallback
  }
}

export async function fetchAdminProducts(credentials: AdminCredentials): Promise<AdminProduct[]> {
  const response = await fetch('/api/v1/admin/products', { headers: { Authorization: buildBasicAuthHeader(credentials.email, credentials.password) } })
  if (!response.ok) throw new Error(await apiError(response, 'Unable to load the jewelry catalogue'))
  return response.json() as Promise<AdminProduct[]>
}

export async function createAdminProduct(credentials: AdminCredentials, product: EditableAdminProduct): Promise<AdminProduct> {
  const response = await fetch('/api/v1/admin/products', {
    method: 'POST',
    headers: { Authorization: buildBasicAuthHeader(credentials.email, credentials.password), 'Content-Type': 'application/json' },
    body: JSON.stringify(productUpdatePayload(product)),
  })
  if (!response.ok) throw new Error(await apiError(response, 'Unable to create this piece'))
  return response.json() as Promise<AdminProduct>
}

export async function updateAdminProduct(credentials: AdminCredentials, product: AdminProduct): Promise<AdminProduct> {
  const response = await fetch(`/api/v1/admin/products/${encodeURIComponent(product.id)}`, {
    method: 'PATCH',
    headers: { Authorization: buildBasicAuthHeader(credentials.email, credentials.password), 'Content-Type': 'application/json' },
    body: JSON.stringify(productUpdatePayload(product)),
  })
  if (!response.ok) throw new Error(await apiError(response, 'Unable to save this piece'))
  return response.json() as Promise<AdminProduct>
}

export async function deleteAdminProduct(credentials: AdminCredentials, id: string) {
  const response = await fetch(`/api/v1/admin/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Authorization: buildBasicAuthHeader(credentials.email, credentials.password) },
  })
  if (!response.ok) throw new Error(await apiError(response, 'Unable to delete this piece'))
}
