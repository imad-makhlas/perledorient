import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const footer = readFileSync(new URL('./Footer.tsx', import.meta.url), 'utf8')
const perleCopy = readFileSync(new URL('../../i18n/perle-copy.ts', import.meta.url), 'utf8')
const legacyCopy = readFileSync(new URL('../../i18n/i18n.tsx', import.meta.url), 'utf8')
const brandContent = readFileSync(new URL('../../pages/BrandContentPage.tsx', import.meta.url), 'utf8')
const contentPage = readFileSync(new URL('../../pages/ContentPage.tsx', import.meta.url), 'utf8')
const home = readFileSync(new URL('../../pages/HomePage.tsx', import.meta.url), 'utf8')

test('keeps telephone and Instagram but removes footer e-mail and location', () => {
  assert.match(footer, /<Phone/)
  assert.match(footer, /<Instagram/)
  assert.doesNotMatch(footer, /<Mail/)
  assert.doesNotMatch(footer, /<MapPin/)
  assert.doesNotMatch(footer, /bonjour@perledorient\.ma/)
  assert.doesNotMatch(footer, /Casablanca, Morocco/)
  assert.match(footer, /delivered in Morocco and internationally/)
})

test('communicates international delivery across storefront copy', () => {
  assert.match(perleCopy, /Delivery in Morocco & worldwide/)
  assert.match(perleCopy, /Livraison au Maroc et à l’international/)
  assert.match(legacyCopy, /Delivery in Morocco & worldwide/)
  assert.match(legacyCopy, /Livraison au Maroc et à l’international/)
  assert.match(brandContent, /International delivery fees and timing are confirmed through WhatsApp according to destination/)
  assert.match(contentPage, /International delivery fees and timing are confirmed through WhatsApp according to destination/)
  assert.match(home, /Morocco & worldwide/)
})
