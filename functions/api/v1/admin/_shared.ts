import {
  adminProductFromRow,
  generateProductSku,
  normalizeAdminProductInput,
  type AdminProductRow,
} from '../../../../apps/web/src/features/admin/admin-product-record'
import type { EditableAdminProduct } from '../../../../apps/web/src/features/admin/admin-products'
import { DEFAULT_DELIVERY_SETTINGS, type DeliverySettings, type DeliveryZone } from '../../../../apps/web/src/features/checkout/delivery-pricing'

export type D1Result<T> = { results?: T[]; success: boolean; meta?: { changes?: number } }
export type D1PreparedStatement = {
  bind(...values: unknown[]): D1PreparedStatement
  all<T>(): Promise<D1Result<T>>
  first<T>(): Promise<T | null>
  run(): Promise<D1Result<unknown>>
}
export type D1Database = {
  prepare(query: string): D1PreparedStatement
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>
}
export type PagesEnv = {
  DB: D1Database
  ADMIN_EMAIL?: string
  ADMIN_PASSWORD?: string
  WHATSAPP_NUMBER?: string
  CLOUDINARY_CLOUD_NAME?: string
  CLOUDINARY_API_KEY?: string
  CLOUDINARY_API_SECRET?: string
}
export type PagesContext = { request: Request; env: PagesEnv; params: Record<string, string | string[]> }

export const productColumns = `
  id, product_id, slug, product_name, name_en, name_fr, name_ar, description_en, description_fr, description_ar,
  category, material, dimensions, variant_name, sku, price, comparison_price,
  stock, active, featured, image_url
`

export function json(data: unknown, init: ResponseInit = {}) {
  return Response.json(data, { ...init, headers: { 'Cache-Control': 'no-store', ...init.headers } })
}

export function requireAdmin(request: Request, env: PagesEnv): Response | null {
  const expectedEmail = env.ADMIN_EMAIL || 'atelier@gmail.com'
  const expectedPassword = env.ADMIN_PASSWORD
  if (!expectedPassword) return json({ error: 'Admin password is not configured' }, { status: 500 })
  const [scheme, value] = (request.headers.get('Authorization') || '').split(' ')
  if (scheme !== 'Basic' || !value) return unauthorized()
  try {
    const decoded = atob(value)
    const separator = decoded.indexOf(':')
    if (separator < 0) return unauthorized()
    const email = decoded.slice(0, separator)
    const password = decoded.slice(separator + 1)
    return email === expectedEmail && password === expectedPassword ? null : unauthorized()
  } catch {
    return unauthorized()
  }
}

export function unauthorized() {
  return json({ error: 'Invalid admin credentials' }, { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Casa de Perla Atelier"' } })
}

export async function listAdminProducts(db: D1Database) {
  const result = await db.prepare(`SELECT ${productColumns} FROM admin_products ORDER BY created_at DESC, name_en ASC`).all<AdminProductRow>()
  return (await attachProductImages(db, result.results || [])).map(adminProductFromRow)
}

type ProductImageRow = { product_row_id: string; image_url: string }

export async function attachProductImages(db: D1Database, rows: AdminProductRow[]) {
  if (!rows.length) return rows
  const images = (await db.prepare('SELECT product_row_id, image_url FROM admin_product_images ORDER BY product_row_id, position, created_at').all<ProductImageRow>()).results || []
  return rows.map((row) => ({ ...row, image_urls: images.filter((image) => image.product_row_id === row.id).map((image) => image.image_url) }))
}

function imageStatements(db: D1Database, productRowId: string, imageUrls: string[]) {
  return [
    db.prepare('DELETE FROM admin_product_images WHERE product_row_id = ?').bind(productRowId),
    ...imageUrls.map((imageUrl, position) => db.prepare('INSERT INTO admin_product_images (id, product_row_id, image_url, position) VALUES (?, ?, ?, ?)').bind(crypto.randomUUID(), productRowId, imageUrl, position)),
  ]
}

export async function createAdminProduct(db: D1Database, input: EditableAdminProduct) {
  const year = new Date().getUTCFullYear()
  const prefix = `CDP-BIJ-${year}-%`
  const existing = await db.prepare('SELECT sku FROM admin_products WHERE sku LIKE ?').bind(prefix).all<{ sku: string }>()
  const sku = generateProductSku((existing.results || []).map((row) => row.sku), year)
  const product = normalizeAdminProductInput({ ...input, sku })
  const productId = crypto.randomUUID()
  const id = crypto.randomUUID()
  await db.prepare(`
    INSERT INTO admin_products (
      id, product_id, slug, product_name, name_en, name_fr, name_ar, description_en, description_fr, description_ar,
      category, material, dimensions, variant_name, sku, price, comparison_price,
      stock, active, featured, image_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id, productId, product.slug, product.nameFr, product.nameFr, product.nameFr, product.nameAr,
    product.descriptionFr, product.descriptionFr, product.descriptionAr, product.category, product.material,
    product.dimensions, product.variantName, product.sku, product.price,
    product.comparisonPrice, product.stock, product.active ? 1 : 0,
    product.featured ? 1 : 0, product.imageUrl,
  ).run()
  await db.batch(imageStatements(db, id, product.imageUrls))
  const row = await db.prepare(`SELECT ${productColumns} FROM admin_products WHERE id = ?`).bind(id).first<AdminProductRow>()
  return row ? adminProductFromRow((await attachProductImages(db, [row]))[0]) : null
}

export async function updateAdminProduct(db: D1Database, id: string, input: EditableAdminProduct) {
  const product = normalizeAdminProductInput(input)
  await db.prepare(`
    UPDATE admin_products SET
      slug = ?, product_name = ?, name_en = ?, name_fr = ?, name_ar = ?, description_en = ?, description_fr = ?, description_ar = ?,
      category = ?, material = ?, dimensions = ?, variant_name = ?, sku = ?, price = ?,
      comparison_price = ?, stock = ?, active = ?, featured = ?, image_url = ?, updated_at = datetime('now')
    WHERE id = ?
  `).bind(
    product.slug, product.nameFr, product.nameFr, product.nameFr, product.nameAr, product.descriptionFr,
    product.descriptionFr, product.descriptionAr, product.category, product.material, product.dimensions,
    product.variantName, product.sku, product.price, product.comparisonPrice,
    product.stock, product.active ? 1 : 0, product.featured ? 1 : 0, product.imageUrl, id,
  ).run()
  await db.batch(imageStatements(db, id, product.imageUrls))
  const row = await db.prepare(`SELECT ${productColumns} FROM admin_products WHERE id = ?`).bind(id).first<AdminProductRow>()
  return row ? adminProductFromRow((await attachProductImages(db, [row]))[0]) : null
}

export async function deleteAdminProduct(db: D1Database, id: string) {
  const result = await db.prepare('DELETE FROM admin_products WHERE id = ?').bind(id).run()
  return (result.meta?.changes || 0) > 0
}

type OrderRow = {
  id: string; order_number: string; customer_name: string; customer_telephone: string; city: string;
  address: string; notes: string; subtotal: number; delivery_fee: number; total: number;
  payment_method: 'WHATSAPP'; status: string; whatsapp_url: string | null; created_at: string
}
type OrderItemRow = {
  order_id: string; product_name: string; variant_name: string; sku: string; quantity: number;
  unit_price: number; line_total: number
}

export async function listAdminOrders(db: D1Database) {
  const orders = (await db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all<OrderRow>()).results || []
  const items = (await db.prepare('SELECT order_id, product_name, variant_name, sku, quantity, unit_price, line_total FROM order_items ORDER BY rowid ASC').all<OrderItemRow>()).results || []
  return orders.map((order) => ({
    orderNumber: order.order_number,
    customerName: order.customer_name,
    customerTelephone: order.customer_telephone,
    city: order.city,
    address: order.address,
    notes: order.notes,
    subtotal: String(order.subtotal),
    deliveryFee: String(order.delivery_fee),
    total: String(order.total),
    paymentMethod: order.payment_method,
    status: order.status,
    createdAt: order.created_at,
    whatsappUrl: order.whatsapp_url,
    items: items.filter((item) => item.order_id === order.id).map((item) => ({
      productName: item.product_name, variantName: item.variant_name, sku: item.sku,
      quantity: item.quantity, unitPrice: String(item.unit_price), lineTotal: String(item.line_total),
    })),
  }))
}

const orderStatuses = new Set(['PENDING_CONFIRMATION', 'CONFIRMED', 'PREPARING', 'READY_FOR_SHIPMENT', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'])

export async function updateAdminOrderStatus(db: D1Database, orderNumber: string, status: string) {
  if (!orderStatuses.has(status)) throw new Error('Invalid order status')
  const releasesStock = status === 'CANCELLED' || status === 'RETURNED'
  await db.prepare(`
    UPDATE orders SET
      status = ?,
      stock_reserved = CASE WHEN ? = 1 THEN 0 ELSE stock_reserved END,
      updated_at = datetime('now')
    WHERE order_number = ?
  `).bind(status, releasesStock ? 1 : 0, orderNumber).run()
  const orders = await listAdminOrders(db)
  return orders.find((order) => order.orderNumber === orderNumber) || null
}

export async function deleteAdminOrder(db: D1Database, orderNumber: string) {
  const [, deleted] = await db.batch([
    db.prepare(`
      UPDATE orders
      SET stock_reserved = CASE WHEN status = 'DELIVERED' THEN stock_reserved ELSE 0 END
      WHERE order_number = ?
    `).bind(orderNumber),
    db.prepare('DELETE FROM orders WHERE order_number = ?').bind(orderNumber),
  ])
  return (deleted.meta?.changes || 0) > 0
}

type DeliverySettingsRow = {
  pickup_city: string
  free_threshold: number
  pickup_fee: number
  major_city_fee: number
  north_region_fee: number
  south_region_fee: number
  major_cities: string
  south_cities: string
  active_zones: string
}

function parseStringList(value: string, fallback: string[]) {
  try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0) : fallback }
  catch { return fallback }
}

function parseActiveZones(value: string): Record<DeliveryZone, boolean> {
  try { return { ...DEFAULT_DELIVERY_SETTINGS.activeZones, ...JSON.parse(value) } }
  catch { return DEFAULT_DELIVERY_SETTINGS.activeZones }
}

function deliverySettingsFromRow(row: DeliverySettingsRow): DeliverySettings {
  return {
    pickupCity: row.pickup_city,
    freeThreshold: row.free_threshold,
    pickupFee: row.pickup_fee,
    majorCityFee: row.major_city_fee,
    northRegionFee: row.north_region_fee,
    southRegionFee: row.south_region_fee,
    majorCities: parseStringList(row.major_cities, DEFAULT_DELIVERY_SETTINGS.majorCities),
    southCities: parseStringList(row.south_cities, DEFAULT_DELIVERY_SETTINGS.southCities),
    activeZones: parseActiveZones(row.active_zones),
  }
}

export async function getDeliverySettings(db: D1Database): Promise<DeliverySettings> {
  try {
    const row = await db.prepare('SELECT pickup_city, free_threshold, pickup_fee, major_city_fee, north_region_fee, south_region_fee, major_cities, south_cities, active_zones FROM delivery_settings WHERE id = ?')
      .bind('default').first<DeliverySettingsRow>()
    return row ? deliverySettingsFromRow(row) : DEFAULT_DELIVERY_SETTINGS
  } catch (error) {
    if (error instanceof Error && error.message.includes('no such table')) return DEFAULT_DELIVERY_SETTINGS
    throw error
  }
}

export async function saveDeliverySettings(db: D1Database, input: DeliverySettings): Promise<DeliverySettings> {
  const number = (value: number) => Number.isFinite(value) && value >= 0 ? Math.round(value) : 0
  const settings: DeliverySettings = {
    pickupCity: input.pickupCity.trim() || DEFAULT_DELIVERY_SETTINGS.pickupCity,
    freeThreshold: number(input.freeThreshold),
    pickupFee: number(input.pickupFee),
    majorCityFee: number(input.majorCityFee),
    northRegionFee: number(input.northRegionFee),
    southRegionFee: number(input.southRegionFee),
    majorCities: input.majorCities.map((city) => city.trim()).filter(Boolean),
    southCities: input.southCities.map((city) => city.trim()).filter(Boolean),
    activeZones: { ...DEFAULT_DELIVERY_SETTINGS.activeZones, ...input.activeZones },
  }
  await db.prepare(`
    INSERT INTO delivery_settings (id, pickup_city, free_threshold, pickup_fee, major_city_fee, north_region_fee, south_region_fee, major_cities, south_cities, active_zones, updated_at)
    VALUES ('default', ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(id) DO UPDATE SET pickup_city = excluded.pickup_city, free_threshold = excluded.free_threshold,
      pickup_fee = excluded.pickup_fee, major_city_fee = excluded.major_city_fee, north_region_fee = excluded.north_region_fee,
      south_region_fee = excluded.south_region_fee, major_cities = excluded.major_cities, south_cities = excluded.south_cities,
      active_zones = excluded.active_zones, updated_at = datetime('now')
  `).bind(
    settings.pickupCity, settings.freeThreshold, settings.pickupFee, settings.majorCityFee,
    settings.northRegionFee, settings.southRegionFee, JSON.stringify(settings.majorCities),
    JSON.stringify(settings.southCities), JSON.stringify(settings.activeZones),
  ).run()
  return settings
}
