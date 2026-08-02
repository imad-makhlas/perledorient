import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const logo = readFileSync(new URL('./Logo.tsx', import.meta.url), 'utf8')
const header = readFileSync(new URL('../layout/Header.tsx', import.meta.url), 'utf8')

test('shows a complete compact wordmark in the narrow mobile header', () => {
  assert.match(logo, /compact\?: boolean/)
  assert.match(logo, /text-\[1\.125rem\]/)
  assert.match(logo, /text-\[6px\]/)
  assert.match(header, /sm:hidden"><Logo compact \/>/)
  assert.doesNotMatch(header, /<Logo markOnly \/>/)
})
