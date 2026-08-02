import assert from 'node:assert/strict'
import test from 'node:test'
import { filterProducts, type ProductSummary } from './catalog.ts'

const products: ProductSummary[] = [
  {
    id: '1', slug: 'layali-necklace', name: 'Layali Necklace', brand: "Perle d'Orient", category: 'Necklaces', material: 'Gold-plated brass',
    image: '/necklace.jpg', price: 520, comparisonPrice: 650, stock: 5, featured: true, isNew: false,
  },
  {
    id: '2', slug: 'nour-earrings', name: 'Nour Earrings', brand: "Perle d'Orient", category: 'Earrings', material: 'Freshwater pearl',
    image: '/earrings.jpg', price: 390, stock: 0, featured: false, isNew: true,
  },
]

test('catalog search matches jewelry names and materials without case sensitivity', () => {
  assert.deepEqual(filterProducts(products, { search: 'layali' }).map((product) => product.id), ['1'])
  assert.deepEqual(filterProducts(products, { search: 'PEARL' }).map((product) => product.id), ['2'])
})

test('catalog filters the approved jewelry families', () => {
  assert.deepEqual(filterProducts(products, { category: 'Necklaces' }).map((product) => product.id), ['1'])
})

test('catalog availability excludes unavailable products', () => {
  assert.deepEqual(filterProducts(products, { inStockOnly: true }).map((product) => product.id), ['1'])
})
