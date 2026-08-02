import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8')
const tailwind = readFileSync(new URL('../../tailwind.config.js', import.meta.url), 'utf8')
const header = readFileSync(new URL('../components/layout/Header.tsx', import.meta.url), 'utf8')
const footer = readFileSync(new URL('../components/layout/Footer.tsx', import.meta.url), 'utf8')
const home = readFileSync(new URL('../pages/HomePage.tsx', import.meta.url), 'utf8')

test('uses a solid white storefront canvas and header', () => {
  assert.match(css, /:root\s*\{[^}]*background:\s*#FFFFFF/)
  assert.match(css, /body\s*\{[^}]*background:\s*#FFFFFF/)
  assert.match(tailwind, /canvas:\s*'#FFFFFF'/)
  assert.match(header, /className="sticky[^"]*bg-white\b/)
  assert.doesNotMatch(header, /bg-white\/95/)
})

test('preserves the announcement and footer but removes the homepage assistance banner', () => {
  assert.match(header, /className="bg-black/)
  assert.match(footer, /bg-midnight/)
  assert.doesNotMatch(home, /className="ink-panel/)
  assert.doesNotMatch(home, /Personal assistance/)
})
