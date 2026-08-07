// @vitest-environment node
import { readFileSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import { describe, expect, it } from 'vitest'
import { deleteAdminOrder, listAdminOrders, updateAdminOrderStatus, type D1Database } from '../../../../../functions/api/v1/admin/_shared'
import { onRequestPost } from '../../../../../functions/api/v1/orders/index'

class TestStatement {
  private values: unknown[] = []
  constructor(private readonly statement: ReturnType<DatabaseSync['prepare']>) {}
  bind(...values: unknown[]) { this.values = values; return this }
  async all<T>() { return { success: true, results: this.statement.all(...this.values) as T[] } }
  async first<T>() { return (this.statement.get(...this.values) as T | undefined) ?? null }
  async run() {
    const result = this.statement.run(...this.values)
    return { success: true, meta: { changes: Number(result.changes) } }
  }
}

class TestDatabase {
  readonly sqlite = new DatabaseSync(':memory:')
  prepare(query: string) { return new TestStatement(this.sqlite.prepare(query)) }
  async batch(statements: TestStatement[]) {
    this.sqlite.exec('BEGIN')
    try {
      const results = []
      for (const statement of statements) results.push(await statement.run())
      this.sqlite.exec('COMMIT')
      return results
    } catch (error) {
      this.sqlite.exec('ROLLBACK')
      throw error
    }
  }
}

function orderDatabase() {
  const database = new TestDatabase()
  database.sqlite.exec(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE admin_products (
      id TEXT PRIMARY KEY, product_id TEXT NOT NULL, slug TEXT NOT NULL, product_name TEXT NOT NULL,
      name_en TEXT NOT NULL DEFAULT '', name_fr TEXT NOT NULL DEFAULT '',
      variant_name TEXT NOT NULL, sku TEXT NOT NULL, price INTEGER NOT NULL, stock INTEGER NOT NULL,
      active INTEGER NOT NULL, image_url TEXT NOT NULL DEFAULT '', updated_at TEXT
    );
    CREATE TABLE orders (
      id TEXT PRIMARY KEY, order_number TEXT NOT NULL UNIQUE, idempotency_key TEXT NOT NULL UNIQUE,
      customer_name TEXT NOT NULL, customer_telephone TEXT NOT NULL, city TEXT NOT NULL, address TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '', subtotal INTEGER NOT NULL, delivery_fee INTEGER NOT NULL, total INTEGER NOT NULL,
      payment_method TEXT NOT NULL, status TEXT NOT NULL, whatsapp_url TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE order_items (
      id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id TEXT NOT NULL, variant_id TEXT NOT NULL, product_name TEXT NOT NULL, variant_name TEXT NOT NULL,
      sku TEXT NOT NULL, quantity INTEGER NOT NULL, unit_price INTEGER NOT NULL, line_total INTEGER NOT NULL,
      image_url TEXT NOT NULL DEFAULT ''
    );
  `)
  database.sqlite.exec(readFileSync(new URL('../../../../../migrations/0003_reserve_order_stock.sql', import.meta.url), 'utf8'))
  database.sqlite.prepare(`
    INSERT INTO admin_products (id, product_id, slug, product_name, name_en, name_fr, variant_name, sku, price, stock, active, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run('variant-1', 'product-1', 'layali', 'Layali Necklace', 'Layali Necklace', 'Collier Layali', 'Gold', 'PDO-001-A', 520, 1, 1, '/layali.jpg')
  return database
}

function orderRequest(idempotencyKey: string, locale: 'en' | 'fr' = 'en') {
  return new Request('https://shop.test/api/v1/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idempotencyKey,
      locale,
      customer: { firstName: 'Sara', lastName: 'Amrani', telephone: '+212612345678', city: 'Casablanca', address: '12 rue des Fleurs', deliveryNotes: '', paymentMethod: 'WHATSAPP', acceptedTerms: true },
      items: [{ variantId: 'variant-1', quantity: 1 }],
    }),
  })
}

describe('order stock reservation API', () => {
  it('uses the official WhatsApp number when no environment override is configured', async () => {
    const database = orderDatabase()
    const response = await onRequestPost({ request: orderRequest('official-number'), env: { DB: database as unknown as D1Database }, params: {} })

    expect(response.status).toBe(201)
    const body = await response.json() as { whatsappUrl: string }
    expect(body.whatsappUrl).toContain('wa.me/212631210654')
  })

  it('builds the WhatsApp message in the language selected by the customer', async () => {
    const database = orderDatabase()
    const env = { DB: database as unknown as D1Database, WHATSAPP_NUMBER: '212600000000' }

    const frenchResponse = await onRequestPost({ request: orderRequest('french-message', 'fr'), env, params: {} })
    const frenchBody = await frenchResponse.json() as { whatsappUrl: string }
    expect(decodeURIComponent(frenchBody.whatsappUrl)).toContain("Bonjour Perle d'Orient")
    expect(decodeURIComponent(frenchBody.whatsappUrl)).toContain('Téléphone :')
    expect(decodeURIComponent(frenchBody.whatsappUrl)).toContain('Collier Layali')

    database.sqlite.prepare('UPDATE admin_products SET stock = 1 WHERE id = ?').run('variant-1')
    const englishResponse = await onRequestPost({ request: orderRequest('english-message', 'en'), env, params: {} })
    const englishBody = await englishResponse.json() as { whatsappUrl: string }
    expect(decodeURIComponent(englishBody.whatsappUrl)).toContain("Hello Perle d'Orient")
    expect(decodeURIComponent(englishBody.whatsappUrl)).toContain('Phone:')
    expect(decodeURIComponent(englishBody.whatsappUrl)).toContain('Layali Necklace')
  })

  it('continues the yearly order sequence across legacy and CMD references', async () => {
    const database = orderDatabase()
    const env = { DB: database as unknown as D1Database, WHATSAPP_NUMBER: '212600000000' }
    const year = new Date().getUTCFullYear()
    database.sqlite.prepare(`
      INSERT INTO orders (
        id, order_number, idempotency_key, customer_name, customer_telephone, city, address,
        subtotal, delivery_fee, total, payment_method, status, stock_reserved
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run('legacy-order', `PDO-${year}-0007`, 'legacy-sequence', 'Ancien client', '+212600000001', 'Rabat', 'Adresse', 500, 0, 500, 'WHATSAPP', 'DELIVERED', 0)

    const first = await onRequestPost({ request: orderRequest('cmd-sequence-1'), env, params: {} })
    await expect(first.json()).resolves.toMatchObject({ orderNumber: `PDO-CMD-${year}-0008` })

    database.sqlite.prepare('UPDATE admin_products SET stock = 1 WHERE id = ?').run('variant-1')
    const second = await onRequestPost({ request: orderRequest('cmd-sequence-2'), env, params: {} })
    await expect(second.json()).resolves.toMatchObject({ orderNumber: `PDO-CMD-${year}-0009` })
  })

  it('does not disguise a missing stock reservation migration as a customer stock conflict', async () => {
    const database = orderDatabase()
    database.batch = async () => { throw new Error('table orders has no column named stock_reserved') }
    const env = { DB: database as unknown as D1Database, WHATSAPP_NUMBER: '212600000000' }

    const response = await onRequestPost({ request: orderRequest('missing-migration'), env, params: {} })

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toMatchObject({ code: 'DATABASE_MIGRATION_REQUIRED' })
  })

  it('reserves the last unit, rejects a competing order, and restores it on cancellation while keeping history', async () => {
    const database = orderDatabase()
    const env = { DB: database as unknown as D1Database, WHATSAPP_NUMBER: '212600000000' }

    const first = await onRequestPost({ request: orderRequest('request-1'), env, params: {} })
    expect(first.status).toBe(201)
    const firstOrder = await first.json() as { orderNumber: string }
    expect(database.sqlite.prepare('SELECT stock FROM admin_products WHERE id = ?').get('variant-1')).toEqual({ stock: 0 })

    const competing = await onRequestPost({ request: orderRequest('request-2'), env, params: {} })
    expect(competing.status).toBe(409)
    await expect(competing.json()).resolves.toMatchObject({ code: 'STOCK_CONFLICT' })

    const cancelled = await updateAdminOrderStatus(env.DB, firstOrder.orderNumber, 'CANCELLED')
    expect(cancelled).toMatchObject({ orderNumber: firstOrder.orderNumber, status: 'CANCELLED' })
    expect(database.sqlite.prepare('SELECT stock FROM admin_products WHERE id = ?').get('variant-1')).toEqual({ stock: 1 })
    expect(database.sqlite.prepare('SELECT status FROM orders WHERE order_number = ?').get(firstOrder.orderNumber)).toEqual({ status: 'CANCELLED' })
  })

  it('deletes an order permanently after it is cancelled', async () => {
    const database = orderDatabase()
    database.sqlite.prepare(`
      INSERT INTO orders (
        id, order_number, idempotency_key, customer_name, customer_telephone, city, address,
        subtotal, delivery_fee, total, payment_method, status, stock_reserved
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run('old-order', 'PDO-20260806-233663', 'old-request', 'Imad Ma', '+212652603417', 'Casablanca', 'Atlas de fes', 520, 0, 520, 'WHATSAPP', 'CANCELLED', 0)

    await expect(listAdminOrders(database as unknown as D1Database)).resolves.toHaveLength(1)
    await expect(deleteAdminOrder(database as unknown as D1Database, 'PDO-20260806-233663')).resolves.toBe(true)
    await expect(listAdminOrders(database as unknown as D1Database)).resolves.toEqual([])
    expect(database.sqlite.prepare('SELECT COUNT(*) AS count FROM orders WHERE order_number = ?').get('PDO-20260806-233663')).toEqual({ count: 0 })
  })

  it('deletes an active order and restores its reserved stock', async () => {
    const database = orderDatabase()
    const env = { DB: database as unknown as D1Database, WHATSAPP_NUMBER: '212600000000' }
    const response = await onRequestPost({ request: orderRequest('delete-active'), env, params: {} })
    const order = await response.json() as { orderNumber: string }

    expect(database.sqlite.prepare('SELECT stock FROM admin_products WHERE id = ?').get('variant-1')).toEqual({ stock: 0 })
    await expect(deleteAdminOrder(env.DB, order.orderNumber)).resolves.toBe(true)
    expect(database.sqlite.prepare('SELECT stock FROM admin_products WHERE id = ?').get('variant-1')).toEqual({ stock: 1 })
    await expect(listAdminOrders(env.DB)).resolves.toEqual([])
  })

  it('deletes a delivered order without returning the sold piece to stock', async () => {
    const database = orderDatabase()
    const env = { DB: database as unknown as D1Database, WHATSAPP_NUMBER: '212600000000' }
    const response = await onRequestPost({ request: orderRequest('delete-delivered'), env, params: {} })
    const order = await response.json() as { orderNumber: string }
    await updateAdminOrderStatus(env.DB, order.orderNumber, 'DELIVERED')

    await expect(deleteAdminOrder(env.DB, order.orderNumber)).resolves.toBe(true)
    expect(database.sqlite.prepare('SELECT stock FROM admin_products WHERE id = ?').get('variant-1')).toEqual({ stock: 0 })
    await expect(listAdminOrders(env.DB)).resolves.toEqual([])
  })
})
