import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { isMobileNavigationLinkActive } from './mobile-bottom-navigation.ts'

const component = readFileSync(new URL('./MobileBottomNavigation.tsx', import.meta.url), 'utf8')

test('maps storefront routes to the correct bottom destination', () => {
  assert.equal(isMobileNavigationLinkActive('/', '/'), true)
  assert.equal(isMobileNavigationLinkActive('/catalogue', '/catalogue'), true)
  assert.equal(isMobileNavigationLinkActive('/products/perle-doree', '/catalogue'), true)
  assert.equal(isMobileNavigationLinkActive('/about', '/about'), true)
  assert.equal(isMobileNavigationLinkActive('/contact', '/contact'), true)
  assert.equal(isMobileNavigationLinkActive('/cart', '/catalogue'), false)
})

test('renders four labelled links and hides the bar on desktop', () => {
  assert.match(component, /lg:hidden/)
  assert.match(component, /aria-current/)
  assert.match(component, /min-h-\[44px\]/)
  assert.match(component, /to="\/"/)
  assert.match(component, /to="\/catalogue"/)
  assert.match(component, /to="\/about"/)
  assert.match(component, /to="\/contact"/)
})
