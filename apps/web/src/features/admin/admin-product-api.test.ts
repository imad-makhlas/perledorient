// @vitest-environment node
import { DatabaseSync } from 'node:sqlite'
import { describe, expect, it } from 'vitest'
import { createAdminProduct, type D1Database } from '../../../../../functions/api/v1/admin/_shared'

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
  async batch(statements: TestStatement[]) { return Promise.all(statements.map((statement) => statement.run())) }
}

describe('admin product creation', () => {
  it('ignores a submitted SKU and generates the next yearly reference', async () => {
    const database = new TestDatabase()
    database.sqlite.exec(`
      CREATE TABLE admin_products (
        id TEXT PRIMARY KEY, product_id TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
        product_name TEXT NOT NULL, name_en TEXT NOT NULL, name_fr TEXT NOT NULL,
        description_en TEXT NOT NULL, description_fr TEXT NOT NULL, category TEXT NOT NULL,
        material TEXT NOT NULL DEFAULT '', dimensions TEXT NOT NULL DEFAULT '', variant_name TEXT NOT NULL,
        sku TEXT NOT NULL UNIQUE, price INTEGER NOT NULL, comparison_price INTEGER,
        stock INTEGER NOT NULL, active INTEGER NOT NULL, featured INTEGER NOT NULL,
        image_url TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `)
    const year = new Date().getUTCFullYear()
    database.sqlite.prepare(`
      INSERT INTO admin_products (
        id, product_id, slug, product_name, name_en, name_fr, description_en, description_fr,
        category, variant_name, sku, price, stock, active, featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run('existing', 'product-existing', 'existing', 'Existing', 'Existing', 'Existant', 'Description', 'Description', 'Necklaces', 'Gold', `PDO-BIJ-${year}-0007`, 500, 2, 1, 0)

    const created = await createAdminProduct(database as unknown as D1Database, {
      slug: 'nour', nameEn: 'Nour Earrings', nameFr: 'Boucles Nour',
      descriptionEn: 'Handmade earrings', descriptionFr: 'Boucles artisanales', category: 'Earrings',
      material: 'Brass', dimensions: '3 cm', variantName: 'Gold', sku: 'MANUAL-SKU',
      price: 390, comparisonPrice: null, stock: 4, active: true, featured: false, imageUrl: '/nour.jpg',
    })

    expect(created?.sku).toBe(`PDO-BIJ-${year}-0008`)
  })
})
