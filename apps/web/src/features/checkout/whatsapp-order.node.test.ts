import assert from 'node:assert/strict'
import test from 'node:test'
import { buildWhatsAppMessage, buildWhatsAppUrl } from './whatsapp-order.ts'

const order = {
  orderNumber: 'PDO-20260722-ABC123',
  customerName: 'Sara Amrani',
  telephone: '+212612345678',
  city: 'Casablanca',
  address: '18 Rue Al Massira',
  notes: 'Gift wrapping',
  total: 910,
  items: [
    { name: 'Layali Necklace', variantName: 'Antique gold', quantity: 1, lineTotal: 520 },
    { name: 'Nour Earrings', variantName: 'Pearl', quantity: 1, lineTotal: 390 },
  ],
}

test('builds a complete Perle d Orient WhatsApp message', () => {
  const message = buildWhatsAppMessage(order)
  assert.match(message, /Perle d'Orient/)
  assert.match(message, /PDO-20260722-ABC123/)
  assert.match(message, /Layali Necklace - Antique gold x 1 - 520 MAD/)
  assert.match(message, /Total: 910 MAD/)
  assert.match(message, /Casablanca, 18 Rue Al Massira/)
})

test('encodes the WhatsApp message and normalizes the phone', () => {
  const url = buildWhatsAppUrl('+212 600-000-000', 'Pearl & gold')
  assert.equal(url, 'https://wa.me/212600000000?text=Pearl%20%26%20gold')
})
