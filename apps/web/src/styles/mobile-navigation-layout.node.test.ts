import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const app = readFileSync(new URL('../App.tsx', import.meta.url), 'utf8')

test('mounts the bottom navigation and reserves collision-safe mobile space', () => {
  assert.match(app, /<MobileBottomNavigation \/>/)
  assert.match(app, /pb-\[calc\(76px\+env\(safe-area-inset-bottom\)\)\]/)
  assert.match(app, /lg:pb-0/)
})

test('raises WhatsApp above the bottom bar only below desktop', () => {
  assert.match(app, /bottom-\[calc\(5\.5rem\+env\(safe-area-inset-bottom\)\)\]/)
  assert.match(app, /lg:bottom-5/)
})
