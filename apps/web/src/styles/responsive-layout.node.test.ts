import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8')
const header = readFileSync(new URL('../components/layout/Header.tsx', import.meta.url), 'utf8')
const mobileNavigation = readFileSync(new URL('../components/layout/MobileBottomNavigation.tsx', import.meta.url), 'utf8')

test('keeps the catalogue toolbar compact through tablet widths', () => {
  assert.doesNotMatch(css, /body\s*\{[^}]*min-width:\s*320px/)
  assert.match(css, /@media \(max-width: 1023px\)[\s\S]*?\.catalog-filter-row\s*\{\s*display:\s*block/)
  assert.match(css, /\.catalog-chips\s*\{[^}]*overflow-x:\s*auto/)
  assert.match(css, /@media \(max-width: 1023px\)[\s\S]*?\.catalog-utilities\s*\{[^}]*width:\s*100%/)
})

test('keeps the bottom navigation active until the desktop breakpoint', () => {
  assert.match(mobileNavigation, /className="fixed[^"]*lg:hidden"/)
  assert.match(mobileNavigation, /className="grid grid-cols-4"/)
  assert.match(header, /className="hidden items-center gap-6 lg:flex/)
  assert.doesNotMatch(header, /Toggle navigation/)
  assert.doesNotMatch(`${header}\n${mobileNavigation}`, /\bmd:(?:flex|hidden)\b/)
})
