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

test('builds the complete Perle d Orient WhatsApp message in French', () => {
  const message = buildWhatsAppMessage(order, 'fr')
  assert.equal(message, [
    "Bonjour Perle d'Orient, je souhaite confirmer cette commande :",
    'Référence : PDO-20260722-ABC123',
    '',
    'Layali Necklace — Antique gold × 1 — 520 MAD',
    'Nour Earrings — Pearl × 1 — 390 MAD',
    '',
    'Total : 910 MAD',
    'Nom : Sara Amrani',
    'Téléphone : +212612345678',
    'Livraison : Casablanca, 18 Rue Al Massira',
    'Note : Gift wrapping',
    '',
    'Merci de confirmer la disponibilité et les modalités de livraison.',
  ].join('\n'))
  assert.doesNotMatch(message, /Hello|Order:|Customer:|Phone:|Delivery:|Please confirm/)
})

test('builds the complete Perle d Orient WhatsApp message in English', () => {
  const message = buildWhatsAppMessage(order, 'en')
  assert.equal(message, [
    "Hello Perle d'Orient, I would like to confirm this order:",
    'Reference: PDO-20260722-ABC123',
    '',
    'Layali Necklace — Antique gold × 1 — 520 MAD',
    'Nour Earrings — Pearl × 1 — 390 MAD',
    '',
    'Total: 910 MAD',
    'Name: Sara Amrani',
    'Phone: +212612345678',
    'Delivery: Casablanca, 18 Rue Al Massira',
    'Note: Gift wrapping',
    '',
    'Please confirm availability and delivery details.',
  ].join('\n'))
  assert.doesNotMatch(message, /Bonjour|Référence|Téléphone|Livraison|Merci de confirmer/)
})

test('encodes the WhatsApp message and normalizes the phone', () => {
  const url = buildWhatsAppUrl('+212 600-000-000', 'Pearl & gold')
  assert.equal(url, 'https://wa.me/212600000000?text=Pearl%20%26%20gold')
})
