import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getBrandLabel, getLogoToneClass } from './brand.ts'

test('returns accessible logo labels for full and mark-only variants', () => {
  assert.equal(getBrandLabel(false), 'Casa de Perla')
  assert.equal(getBrandLabel(true), 'Casa de Perla house and pearl mark')
})

test('maps logo tones to stable class names', () => {
  assert.equal(getLogoToneClass('light'), 'text-white')
  assert.equal(getLogoToneClass('dark'), 'text-[#2f2a2c]')
})
