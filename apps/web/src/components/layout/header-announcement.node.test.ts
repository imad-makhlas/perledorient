import assert from 'node:assert/strict'
import test from 'node:test'
import { getHeaderAnnouncement } from './header-announcement.ts'

test('returns the complimentary delivery message in Arabic', () => {
  assert.equal(getHeaderAnnouncement('ar'), 'توصيل مجاني ابتداءً من 2000 MAD داخل المغرب - التوصيل الدولي متاح')
})

test('returns the complimentary delivery message in French', () => {
  assert.equal(getHeaderAnnouncement('fr'), 'Livraison offerte dès 2000 MAD au Maroc - Livraison internationale disponible')
})
