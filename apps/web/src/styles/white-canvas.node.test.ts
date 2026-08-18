import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8')
const tailwind = readFileSync(new URL('../../tailwind.config.js', import.meta.url), 'utf8')
const header = readFileSync(new URL('../components/layout/Header.tsx', import.meta.url), 'utf8')
const footer = readFileSync(new URL('../components/layout/Footer.tsx', import.meta.url), 'utf8')
const home = readFileSync(new URL('../pages/HomePage.tsx', import.meta.url), 'utf8')

test('uses a solid white storefront canvas with a floating dark header', () => {
  assert.match(css, /--color-canvas:\s*#FFFFFF/)
  assert.match(css, /:root\s*\{[^}]*background:\s*var\(--color-canvas\)/)
  assert.match(css, /body\s*\{[^}]*background:\s*var\(--color-canvas\)/)
  assert.match(tailwind, /canvas:\s*'#FFFFFF'/)
  assert.match(header, /className="sticky[^"]*bg-transparent\b/)
  assert.match(header, /bg-\[#302A2E\]/)
  assert.doesNotMatch(header, /bg-white\/95/)
})

test('preserves the announcement and uses a pure white footer while removing the homepage assistance banner', () => {
  assert.match(header, /announcement-ticker[^"]*bg-black/)
  assert.match(footer, /return <footer className="[^"]*bg-white/)
  assert.doesNotMatch(footer, /bg-midnight|bg-\[#2F2A2C\]/)
  assert.doesNotMatch(home, /className="ink-panel/)
  assert.doesNotMatch(home, /Personal assistance/)
})
