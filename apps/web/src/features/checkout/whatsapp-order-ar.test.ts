import { describe, expect, it } from 'vitest'
import { buildWhatsAppMessage } from './whatsapp-order'

describe('Arabic WhatsApp order', () => {
  it('uses Arabic labels when the store is Arabic', () => {
    const message = buildWhatsAppMessage({
      orderNumber: 'PDO-CMD-2026-0007', customerName: 'Sara', telephone: '+212612345678',
      city: 'الرباط', address: 'حي الرياض', total: 520,
      items: [{ name: 'عقد ليالي', variantName: 'ذهبي', quantity: 1, lineTotal: 520 }],
    }, 'ar')
    expect(message).toMatch(/^مرحباً لؤلؤة الشرق/)
    expect(message).toContain('المرجع: PDO-CMD-2026-0007')
    expect(message).toContain('التوصيل: الرباط، حي الرياض')
    expect(message).not.toMatch(/Hello|Bonjour|Delivery|Livraison/)
  })
})
