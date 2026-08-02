import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { isHeaderLinkActive } from './header-nav.ts'

const header = readFileSync(new URL('./Header.tsx', import.meta.url), 'utf8')

test('activates only the matching shop or category navigation item', () => {
  assert.equal(isHeaderLinkActive('/catalogue', '', '/catalogue'), true)
  assert.equal(isHeaderLinkActive('/catalogue', '', '/catalogue?category=Necklaces'), false)
  assert.equal(isHeaderLinkActive('/catalogue', '?category=Necklaces', '/catalogue'), false)
  assert.equal(isHeaderLinkActive('/catalogue', '?category=Necklaces', '/catalogue?category=Necklaces'), true)
  assert.equal(isHeaderLinkActive('/catalogue', '?category=Necklaces', '/catalogue?category=Earrings'), false)
})

test('shows only the four primary storefront destinations', () => {
  assert.match(header, /const links = \[\['\/',/)
  assert.match(header, /\['\/catalogue',/)
  assert.match(header, /\['\/about',/)
  assert.match(header, /\['\/contact',/)
  assert.doesNotMatch(header, /category=Necklaces/)
  assert.doesNotMatch(header, /category=Earrings/)
  assert.doesNotMatch(header, /category=Bracelets/)
  assert.doesNotMatch(header, /category=Rings/)
})

test('keeps utility controls but removes the mobile hamburger menu', () => {
  assert.doesNotMatch(header, /Toggle navigation/)
  assert.doesNotMatch(header, /<Menu/)
  assert.match(header, /Change language/)
  assert.match(header, /<Search/)
  assert.match(header, /<ShoppingBag/)
  assert.match(header, /<Logo/)
})
