import { describe, expect, it } from 'vitest'
import { isMobileWhatsAppDevice, toWhatsAppAppUrl } from './whatsapp-handoff'

describe('WhatsApp handoff', () => {
  it('converts the web URL to the WhatsApp application protocol', () => {
    expect(toWhatsAppAppUrl('https://wa.me/212631210654?text=Bonjour%20Perle')).toBe('whatsapp://send?phone=212631210654&text=Bonjour%20Perle')
  })

  it('detects mobile devices without classifying desktop browsers as mobile', () => {
    expect(isMobileWhatsAppDevice('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)')).toBe(true)
    expect(isMobileWhatsAppDevice('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/140')).toBe(false)
  })
})
