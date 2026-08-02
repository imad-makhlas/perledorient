import assert from 'node:assert/strict'
import test from 'node:test'
import { getHeaderAnnouncement } from './header-announcement.ts'

test('returns the complimentary delivery message in English', () => {
  assert.equal(getHeaderAnnouncement('en'), 'Complimentary delivery from 500 MAD in Morocco - International delivery available')
})

test('returns the complimentary delivery message in French', () => {
  assert.equal(getHeaderAnnouncement('fr'), 'Livraison offerte dès 500 MAD au Maroc - Livraison internationale disponible')
})
