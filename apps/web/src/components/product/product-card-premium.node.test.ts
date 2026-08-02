import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const catalog = readFileSync(new URL('../../features/catalog/catalog.ts', import.meta.url), 'utf8')
const jewelry = readFileSync(new URL('../../data/jewelry-products.ts', import.meta.url), 'utf8')
const card = readFileSync(new URL('./ProductCard.tsx', import.meta.url), 'utf8')

test('publishes and conditionally renders product dimensions', () => {
  assert.match(catalog, /dimensions\?: string/)
  assert.match(jewelry, /material, dimensions, image/)
  assert.match(card, /\{product\.dimensions &&/)
  assert.match(card, /locale === 'fr' \? 'Taille' : 'Size'/)
  assert.match(card, /<Ruler/)
})

test('uses a premium readable information hierarchy', () => {
  assert.match(card, /border border-line/)
  assert.match(card, /hover:-translate-y-1/)
  assert.match(card, /min-h-\[205px\]/)
  assert.match(card, /text-\[15px\]/)
  assert.match(card, /text-\[12px\]/)
  assert.match(card, /rounded-full/)
  assert.match(card, /text-\[10px\]/)
  assert.match(card, /h-1\.5 w-1\.5 rounded-full bg-current/)
})
