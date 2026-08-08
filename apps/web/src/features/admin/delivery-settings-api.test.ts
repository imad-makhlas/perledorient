// @vitest-environment node
import { readFileSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import { describe, expect, it } from 'vitest'
import { getDeliverySettings, saveDeliverySettings, type D1Database } from '../../../../../functions/api/v1/admin/_shared'
import { DEFAULT_DELIVERY_SETTINGS } from '../checkout/delivery-pricing'

class Statement {
  private values: unknown[] = []
  constructor(private readonly statement: ReturnType<DatabaseSync['prepare']>) {}
  bind(...values: unknown[]) { this.values = values; return this }
  async all<T>() { return { success: true, results: this.statement.all(...this.values) as T[] } }
  async first<T>() { return (this.statement.get(...this.values) as T | undefined) ?? null }
  async run() { const result = this.statement.run(...this.values); return { success: true, meta: { changes: Number(result.changes) } } }
}

class Database {
  readonly sqlite = new DatabaseSync(':memory:')
  prepare(query: string) { return new Statement(this.sqlite.prepare(query)) }
  async batch(statements: Statement[]) { return Promise.all(statements.map((statement) => statement.run())) }
}

describe('D1 delivery settings', () => {
  it('seeds Cathedis Silver rates with Fès as the pickup city', async () => {
    const database = new Database()
    database.sqlite.exec(readFileSync(new URL('../../../../../migrations/0006_create_delivery_settings.sql', import.meta.url), 'utf8'))

    await expect(getDeliverySettings(database as unknown as D1Database)).resolves.toMatchObject({
      pickupCity: 'Fès', freeThreshold: 2_000, pickupFee: 20, majorCityFee: 35, northRegionFee: 40, southRegionFee: 45,
    })
  })

  it('saves rates and city lists from the administration', async () => {
    const database = new Database()
    database.sqlite.exec(readFileSync(new URL('../../../../../migrations/0006_create_delivery_settings.sql', import.meta.url), 'utf8'))
    const next = { ...DEFAULT_DELIVERY_SETTINGS, freeThreshold: 2_500, pickupFee: 25, majorCities: ['Casablanca', 'Rabat'] }

    await expect(saveDeliverySettings(database as unknown as D1Database, next)).resolves.toMatchObject(next)
    await expect(getDeliverySettings(database as unknown as D1Database)).resolves.toMatchObject(next)
  })
})
