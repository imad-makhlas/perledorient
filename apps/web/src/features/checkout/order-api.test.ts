import { afterEach, describe, expect, it, vi } from 'vitest'
import { createOrder } from './order-api'

const customer = {
  firstName: 'Sara', lastName: 'Amrani', telephone: '+212612345678', city: 'Casablanca', address: '12 rue des Fleurs',
  deliveryNotes: '', paymentMethod: 'WHATSAPP' as const, acceptedTerms: true as const,
}
const items = [{
  productId: 'product-1', variantId: 'variant-1', slug: 'layali', name: 'Layali Necklace', variantName: 'Gold',
  imageUrl: '/layali.jpg', unitPrice: 520, quantity: 1, stockQuantity: 1,
}]

afterEach(() => vi.unstubAllGlobals())

describe('order API client', () => {
  it('shows the server stock-conflict message instead of creating a development fallback order', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      code: 'STOCK_CONFLICT',
      error: 'Cette pièce vient d’être réservée. Actualisez votre panier.',
    }), { status: 409, headers: { 'Content-Type': 'application/json' } })))

    await expect(createOrder(customer, items, 'fr')).rejects.toThrow('Cette pièce vient d’être réservée')
  })
})
