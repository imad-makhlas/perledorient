import {
  adminProductFromRow,
  normalizeAdminProductPatch,
  type AdminProductRow,
} from '../../../../apps/web/src/features/admin/admin-product-record'
import type { EditableAdminProduct } from '../../../../apps/web/src/features/admin/admin-products'

export type D1Result<T> = {
  results?: T[]
  success: boolean
}

export type D1PreparedStatement = {
  bind(...values: unknown[]): D1PreparedStatement
  all<T>(): Promise<D1Result<T>>
  first<T>(): Promise<T | null>
  run(): Promise<D1Result<unknown>>
}

export type D1Database = {
  prepare(query: string): D1PreparedStatement
}

export type PagesEnv = {
  DB: D1Database
  ADMIN_EMAIL?: string
  ADMIN_PASSWORD?: string
}

export type PagesContext = {
  request: Request
  env: PagesEnv
  params: Record<string, string | string[]>
}

export function json(data: unknown, init: ResponseInit = {}) {
  return Response.json(data, {
    ...init,
    headers: {
      'Cache-Control': 'no-store',
      ...init.headers,
    },
  })
}

export function requireAdmin(request: Request, env: PagesEnv): Response | null {
  const expectedEmail = env.ADMIN_EMAIL || 'atelier@perledorient.com'
  const expectedPassword = env.ADMIN_PASSWORD
  if (!expectedPassword) return json({ error: 'Admin password is not configured' }, { status: 500 })

  const authorization = request.headers.get('Authorization') || ''
  const [scheme, value] = authorization.split(' ')
  if (scheme !== 'Basic' || !value) return unauthorized()

  const decoded = atob(value)
  const separator = decoded.indexOf(':')
  const email = decoded.slice(0, separator)
  const password = decoded.slice(separator + 1)
  if (email !== expectedEmail || password !== expectedPassword) return unauthorized()

  return null
}

export function unauthorized() {
  return json({ error: 'Invalid admin credentials' }, {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Perle dOrient Atelier"' },
  })
}

export async function listAdminProducts(db: D1Database) {
  const result = await db.prepare(`
    SELECT id, product_id, slug, product_name, variant_name, sku, price, stock, active, image_url
    FROM admin_products
    ORDER BY product_name ASC, sku ASC
  `).all<AdminProductRow>()
  return (result.results || []).map(adminProductFromRow)
}

export async function updateAdminProduct(db: D1Database, id: string, input: EditableAdminProduct) {
  const patch = normalizeAdminProductPatch(input)
  await db.prepare(`
    UPDATE admin_products
    SET product_name = ?, variant_name = ?, price = ?, stock = ?, active = ?, image_url = ?, updated_at = datetime('now')
    WHERE id = ?
  `).bind(patch.productName, patch.variantName, patch.price, patch.stock, patch.active ? 1 : 0, patch.imageUrl, id).run()

  const row = await db.prepare(`
    SELECT id, product_id, slug, product_name, variant_name, sku, price, stock, active, image_url
    FROM admin_products
    WHERE id = ?
  `).bind(id).first<AdminProductRow>()

  return row ? adminProductFromRow(row) : null
}
