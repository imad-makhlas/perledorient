import { describe, expect, it } from 'vitest'
import { getHeaderAnnouncement } from './header-announcement'

describe('header announcement', () => {
  it('announces free delivery from 2000 MAD in French and Arabic', () => {
    expect(getHeaderAnnouncement('fr')).toBe('Livraison offerte dès 2000 MAD au Maroc - Livraison internationale disponible')
    expect(getHeaderAnnouncement('ar')).toBe('توصيل مجاني ابتداءً من 2000 MAD داخل المغرب - التوصيل الدولي متاح')
  })
})
