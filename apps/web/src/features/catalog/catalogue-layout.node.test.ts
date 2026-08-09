import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const cataloguePage = readFileSync(new URL('../../pages/CataloguePage.tsx', import.meta.url), 'utf8')

test('opens the boutique directly on filters and product cards', () => {
  assert.doesNotMatch(cataloguePage, /<header className="border-b border-line/)
  assert.doesNotMatch(cataloguePage, /Casa de Perla<\/p><h1/)
  assert.match(cataloguePage, /<main className="min-h-screen bg-white">\s*<div className="container-shell/)
})
