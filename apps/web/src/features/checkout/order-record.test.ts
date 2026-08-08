import { describe, expect, it } from 'vitest'
import { generateOrderNumber, prepareOrder } from './order-record'

const customer = {
  firstName: 'Sara', lastName: 'Amrani', telephone: '+212612345678', city: 'Casablanca', address: '12 rue des Fleurs',
  country: 'MA' as const, deliveryNotes: 'Call on arrival', paymentMethod: 'WHATSAPP' as const, acceptedTerms: true as const,
}

describe('D1 WhatsApp orders', () => {
  it('generates the next readable yearly order reference', () => {
    expect(generateOrderNumber([], new Date('2026-08-06T12:00:00Z'))).toBe('PDO-CMD-2026-0001')
    expect(generateOrderNumber([
      'PDO-2025-0099',
      'PDO-2026-0002',
      'PDO-CMD-2026-0012',
      'PDO-20260806-233663',
    ], new Date('2026-08-06T12:00:00Z'))).toBe('PDO-CMD-2026-0013')
  })

  it('uses catalogue prices, calculates delivery and prepares persisted items', () => {
    const order = prepareOrder(customer, [{ variantId: 'variant-1', quantity: 2 }], [{
      id: 'variant-1', product_id: 'product-1', slug: 'layali', product_name: 'Layali Necklace', variant_name: 'Gold', sku: 'PDO-001-A', price: 220, stock: 4, active: 1, image_url: '/layali.jpg',
    }], 'PDO-20260805-123456')

    expect(order).toMatchObject({ orderNumber: 'PDO-20260805-123456', subtotal: 440, deliveryFee: 35, total: 475, deliveryZone: 'MAJOR_CITIES', status: 'PENDING_CONFIRMATION' })
    expect(order.items).toEqual([{ productId: 'product-1', variantId: 'variant-1', productName: 'Layali Necklace', variantName: 'Gold', sku: 'PDO-001-A', quantity: 2, unitPrice: 220, lineTotal: 440, imageUrl: '/layali.jpg' }])
  })

  it('offers delivery from 2,000 MAD and keeps international delivery for a quote', () => {
    const row = { id: 'variant-1', product_id: 'product-1', slug: 'layali', product_name: 'Layali', variant_name: 'Gold', sku: 'PDO-001-A', price: 2_000, stock: 2, active: 1, image_url: '' }
    expect(prepareOrder({ ...customer, city: 'Fès' }, [{ variantId: 'variant-1', quantity: 1 }], [row], 'PDO-1')).toMatchObject({ deliveryFee: 0, deliveryZone: 'PICKUP_CITY', deliveryRequiresQuote: false })
    expect(prepareOrder({ ...customer, country: 'INTERNATIONAL', city: 'Paris' }, [{ variantId: 'variant-1', quantity: 1 }], [row], 'PDO-2')).toMatchObject({ deliveryFee: 0, deliveryZone: 'INTERNATIONAL', deliveryRequiresQuote: true })
  })

  it('rejects unavailable products and excessive quantities', () => {
    const rows = [{ id: 'variant-1', product_id: 'product-1', slug: 'layali', product_name: 'Layali', variant_name: 'Gold', sku: 'PDO-001-A', price: 220, stock: 1, active: 1, image_url: '' }]
    expect(() => prepareOrder(customer, [{ variantId: 'variant-1', quantity: 2 }], rows, 'PDO-1')).toThrow('stock')
    expect(() => prepareOrder(customer, [{ variantId: 'missing', quantity: 1 }], rows, 'PDO-1')).toThrow('unavailable')
  })
})
