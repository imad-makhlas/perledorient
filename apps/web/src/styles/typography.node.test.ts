import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8')
const tailwind = readFileSync(new URL('../../tailwind.config.js', import.meta.url), 'utf8')

test('uses Inter for display and body typography', () => {
  assert.match(css, /family=Inter/)
  assert.doesNotMatch(css, /Cormorant/)
  assert.match(css, /\.display\s*\{\s*font-family:\s*Inter/)
  assert.match(tailwind, /display:\s*\['Inter'/)
  assert.doesNotMatch(tailwind, /Cormorant/)
})
