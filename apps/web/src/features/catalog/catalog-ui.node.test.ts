import assert from 'node:assert/strict'
import test from 'node:test'
import { catalogUi, categoryLabel } from './catalog-ui.ts'

test('provides complete English and French catalogue labels', () => {
  assert.equal(catalogUi('en').sort.featured, 'Featured')
  assert.equal(catalogUi('fr').sort.featured, 'Nos favoris')
  assert.equal(categoryLabel('Earrings', 'fr'), "Boucles d'oreilles")
  assert.equal(categoryLabel('Gift Sets', 'fr'), 'Coffrets cadeaux')
})
