import assert from 'node:assert/strict'
import test from 'node:test'
import { buildWhatsAppMessage } from './whatsapp-order.ts'

test('builds an Arabic WhatsApp confirmation when the store is Arabic', () => {
  const message = buildWhatsAppMessage({
    orderNumber: 'PDO-CMD-2026-0007', customerName: 'Sara', telephone: '+212612345678',
    city: 'الرباط', address: 'حي الرياض', total: 520,
    items: [{ name: 'عقد ليالي', variantName: 'ذهبي', quantity: 1, lineTotal: 520 }],
  }, 'ar')
  assert.match(message, /^مرحباً Casa de Perla/)
  assert.match(message, /المرجع: PDO-CMD-2026-0007/)
  assert.match(message, /التوصيل: الرباط، حي الرياض/)
  assert.doesNotMatch(message, /Hello|Bonjour|Delivery|Livraison/)
})
