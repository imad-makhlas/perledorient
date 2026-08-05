// @vitest-environment node
import { readFileSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import { describe, expect, it } from 'vitest'

const migrationPath = new URL('../../../../../migrations/0003_reserve_order_stock.sql', import.meta.url)

function databaseBeforeReservationMigration() {
  const db = new DatabaseSync(':memory:')
  db.exec(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE admin_products (id TEXT PRIMARY KEY, stock INTEGER NOT NULL, active INTEGER NOT NULL, updated_at TEXT);
    CREATE TABLE orders (id TEXT PRIMARY KEY, order_number TEXT NOT NULL UNIQUE, status TEXT NOT NULL);
    CREATE TABLE order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      variant_id TEXT NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity > 0)
    );
  `)
  db.exec(readFileSync(migrationPath, 'utf8'))
  return db
}

describe('D1 stock reservation migration', () => {
  it('reserves stock when an order item is created and blocks a competing order', () => {
    const db = databaseBeforeReservationMigration()
    db.prepare('INSERT INTO admin_products (id, stock, active) VALUES (?, ?, ?)').run('variant-1', 1, 1)
    db.prepare('INSERT INTO orders (id, order_number, status, stock_reserved) VALUES (?, ?, ?, ?)').run('order-1', 'PDO-1', 'PENDING_CONFIRMATION', 1)
    db.prepare('INSERT INTO order_items (id, order_id, variant_id, quantity) VALUES (?, ?, ?, ?)').run('item-1', 'order-1', 'variant-1', 1)
    expect(db.prepare('SELECT stock FROM admin_products WHERE id = ?').get('variant-1')).toEqual({ stock: 0 })

    db.prepare('INSERT INTO orders (id, order_number, status, stock_reserved) VALUES (?, ?, ?, ?)').run('order-2', 'PDO-2', 'PENDING_CONFIRMATION', 1)
    expect(() => db.prepare('INSERT INTO order_items (id, order_id, variant_id, quantity) VALUES (?, ?, ?, ?)').run('item-2', 'order-2', 'variant-1', 1)).toThrow('INSUFFICIENT_STOCK')
    expect(db.prepare('SELECT stock FROM admin_products WHERE id = ?').get('variant-1')).toEqual({ stock: 0 })
  })

  it('restores reserved stock exactly once when the order releases it', () => {
    const db = databaseBeforeReservationMigration()
    db.prepare('INSERT INTO admin_products (id, stock, active) VALUES (?, ?, ?)').run('variant-1', 2, 1)
    db.prepare('INSERT INTO orders (id, order_number, status, stock_reserved) VALUES (?, ?, ?, ?)').run('order-1', 'PDO-1', 'PENDING_CONFIRMATION', 1)
    db.prepare('INSERT INTO order_items (id, order_id, variant_id, quantity) VALUES (?, ?, ?, ?)').run('item-1', 'order-1', 'variant-1', 2)

    db.prepare("UPDATE orders SET status = 'CANCELLED', stock_reserved = 0 WHERE id = ?").run('order-1')
    expect(db.prepare('SELECT stock FROM admin_products WHERE id = ?').get('variant-1')).toEqual({ stock: 2 })
    db.prepare("UPDATE orders SET stock_reserved = 0 WHERE id = ?").run('order-1')
    expect(db.prepare('SELECT stock FROM admin_products WHERE id = ?').get('variant-1')).toEqual({ stock: 2 })
  })
})
