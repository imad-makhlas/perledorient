import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const catalog = readFileSync(new URL('../../features/catalog/catalog.ts', import.meta.url), 'utf8')
const jewelry = readFileSync(new URL('../../data/jewelry-products.ts', import.meta.url), 'utf8')
const card = readFileSync(new URL('./ProductCard.tsx', import.meta.url), 'utf8')

test('keeps legacy product details in the catalog without rendering them in cards', () => {
  assert.match(catalog, /dimensions\?: string/)
  assert.match(jewelry, /material, dimensions, image/)
  assert.doesNotMatch(card, /product\.material/)
  assert.doesNotMatch(card, /product\.dimensions/)
  assert.doesNotMatch(card, /<Ruler/)
})

test('uses a premium readable information hierarchy', () => {
  assert.match(card, /border border-line/)
  assert.match(card, /hover:-translate-y-1/)
  assert.match(card, /line-clamp-2/)
  assert.match(card, /text-\[15px\]/)
  assert.match(card, /text-\[12px\]/)
  assert.match(card, /rounded-full/)
  assert.match(card, /text-\[9px\]/)
  assert.match(card, /h-1\.5 w-1\.5 rounded-full bg-current/)
})
