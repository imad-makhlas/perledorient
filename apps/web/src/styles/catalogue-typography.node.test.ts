import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8')
const header = readFileSync(new URL('../components/layout/Header.tsx', import.meta.url), 'utf8')

test('uses readable premium typography in the catalogue toolbar', () => {
  assert.match(css, /\.catalog-toolbar-head > div > span\s*\{[^}]*font-size:\s*1\.125rem/)
  assert.match(css, /\.catalog-search input\s*\{[^}]*font-size:\s*1rem/)
  assert.match(css, /\.catalog-chip\s*\{[^}]*font-size:\s*\.66rem/)
  assert.match(css, /\.catalog-availability\s*\{[^}]*font-size:\s*\.64rem/)
  assert.match(css, /\.catalog-sort-copy strong\s*\{[^}]*font-size:\s*\.65rem/)
  assert.match(css, /\.catalog-sort-menu-option\s*\{[^}]*font-size:\s*\.64rem/)
})

test('uses readable navigation labels in the desktop header', () => {
  assert.match(header, /text-\[10px\][^`"]*lg:text-\[11px\]/)
  assert.doesNotMatch(header, /text-\[9px\][^`"]*lg:text-\[10px\]/)
})
