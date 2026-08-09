import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const styles = readFileSync(new URL('../index.css', import.meta.url), 'utf8')

test('Arabic mode preserves connected letterforms across the storefront', () => {
  assert.match(styles, /html\[lang=['"]ar['"]\]\s+body\s+\*/)
  assert.match(styles, /letter-spacing:\s*normal\s*!important/)
  assert.match(styles, /text-transform:\s*none\s*!important/)
})
