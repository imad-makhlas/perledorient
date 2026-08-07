import assert from 'node:assert/strict'
import { test } from 'node:test'
import { buildBasicAuthHeader, getNextAdminActions, orderStatusLabel, type AdminOrder } from './admin-orders.ts'

test('shows the next operational actions for each order status', () => {
  assert.deepEqual(getNextAdminActions('PENDING_CONFIRMATION'), ['CONFIRMED', 'CANCELLED'])
  assert.deepEqual(getNextAdminActions('CONFIRMED'), ['PREPARING', 'CANCELLED'])
  assert.deepEqual(getNextAdminActions('READY_FOR_SHIPMENT'), ['SHIPPED', 'CANCELLED'])
  assert.deepEqual(getNextAdminActions('DELIVERED'), ['RETURNED'])
  assert.deepEqual(getNextAdminActions('CANCELLED'), [])
})

test('formats admin status labels in English and French', () => {
  assert.equal(orderStatusLabel('PENDING_CONFIRMATION', 'en'), 'Pending confirmation')
  assert.equal(orderStatusLabel('READY_FOR_SHIPMENT', 'fr'), 'Prête à expédier')
})

test('builds a basic auth header from admin credentials', () => {
  assert.equal(buildBasicAuthHeader('admin@codavenue.local', 'secret'), 'Basic YWRtaW5AY29kYXZlbnVlLmxvY2FsOnNlY3JldA==')
})

test('keeps admin order totals and customer fields explicit', () => {
  const order: AdminOrder = {
    orderNumber: 'COD-20260722-ABC123',
    customerName: 'Sara Amrani',
    customerTelephone: '+212612345678',
    city: 'Casablanca',
    subtotal: '450.00',
    deliveryFee: '30.00',
    total: '480.00',
    paymentMethod: 'CASH_ON_DELIVERY',
    status: 'PENDING_CONFIRMATION',
    createdAt: '2026-07-22T10:00:00Z',
    whatsappUrl: null,
    items: [{ productName: 'Atlas Chronograph', variantName: 'Signature', sku: 'COD-WAT-001', quantity: 1, lineTotal: '450.00' }],
  }
  assert.equal(order.items[0].sku, 'COD-WAT-001')
  assert.equal(order.total, '480.00')
})
