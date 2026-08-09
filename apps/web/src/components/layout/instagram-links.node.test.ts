import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../../config/social-links.ts'

const header = readFileSync(new URL('./Header.tsx', import.meta.url), 'utf8')
const footer = readFileSync(new URL('./Footer.tsx', import.meta.url), 'utf8')

test('uses the approved Instagram profile in the header and footer', () => {
  assert.equal(INSTAGRAM_URL, 'https://instagram.com/casadeperla.jewelry')
  assert.equal(INSTAGRAM_HANDLE, '@casadeperla.jewelry')
  for (const source of [header, footer]) {
    assert.match(source, /href=\{INSTAGRAM_URL\}/)
    assert.match(source, /target="_blank"/)
    assert.match(source, /rel="noreferrer"/)
    assert.match(source, /<Instagram/)
  }
  assert.match(header, /aria-label="Instagram Casa de Perla"/)
  assert.match(footer, /\{INSTAGRAM_HANDLE\}/)
  assert.ok(header.indexOf('<Instagram') > header.indexOf('<ShoppingBag'))
})
