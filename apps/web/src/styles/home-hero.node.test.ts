import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const home = readFileSync(new URL('../pages/HomePage.tsx', import.meta.url), 'utf8')

test('uses a compact home hero that reveals categories sooner', () => {
  assert.doesNotMatch(home, /min-h-\[690px\]/)
  assert.doesNotMatch(home, /lg:text-\[5\.8rem\]/)
  assert.doesNotMatch(home, /min-h-\[480px\]/)
  assert.match(home, /lg:py-16/)
  assert.match(home, /h-\[260px\][^"]*md:h-\[360px\][^"]*lg:h-\[440px\]/)
  assert.match(home, /lg:text-\[3\.75rem\]/)
})
