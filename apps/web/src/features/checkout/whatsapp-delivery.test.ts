import { describe, expect, it } from 'vitest'
import { buildWhatsAppMessage } from './whatsapp-order'

const order = {
  orderNumber: 'PDO-CMD-2026-0001', customerName: 'Sara Amrani', telephone: '+212612345678',
  city: 'Casablanca', address: '12 rue des Fleurs', subtotal: 520, deliveryFee: 35, total: 555,
  items: [{ name: 'Collier Layali', variantName: 'Or antique', quantity: 1, lineTotal: 520 }],
}

describe('WhatsApp delivery summary', () => {
  it('clearly separates subtotal, delivery and total in French', () => {
    const message = buildWhatsAppMessage(order, 'fr')
    expect(message).toContain('Sous-total : 520 MAD')
    expect(message).toContain('Frais de livraison : 35 MAD')
    expect(message).toContain('Total : 555 MAD')
  })

  it('explains when international delivery requires a quote', () => {
    const message = buildWhatsAppMessage({ ...order, deliveryFee: 0, deliveryRequiresQuote: true }, 'fr')
    expect(message).toContain('Frais de livraison : à confirmer sur WhatsApp')
  })
})
