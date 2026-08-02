# International Delivery and Footer Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove footer e-mail/location details and update storefront delivery copy to cover Morocco and international destinations accurately.

**Architecture:** Keep the existing delivery calculation unchanged and update only presentation copy. Tests will assert exact announcement text, footer cleanup, international trust wording, and WhatsApp-based international delivery guidance across both active and legacy content sources.

**Tech Stack:** React 19, TypeScript, Node test runner, Vitest, ESLint, Vite.

## Global Constraints

- Keep the telephone and Instagram rows in the footer.
- Remove footer e-mail and location rows.
- Complimentary delivery from 500 MAD applies to Morocco only.
- International delivery fees and timing are confirmed through WhatsApp according to destination.
- Do not change checkout calculations, Casablanca fixtures, or example order addresses.

---

### Task 1: Bilingual announcement and footer cleanup

**Files:**
- Modify: `apps/web/src/components/layout/header-announcement.node.test.ts`
- Modify: `apps/web/src/components/layout/header-announcement.ts`
- Create: `apps/web/src/components/layout/international-delivery.node.test.ts`
- Modify: `apps/web/src/components/layout/Footer.tsx`

**Interfaces:**
- Preserves: `getHeaderAnnouncement(locale)` signature.
- Footer continues to consume `INSTAGRAM_HANDLE` and `INSTAGRAM_URL`.

- [ ] **Step 1: Write failing announcement and footer tests**

Update announcement expectations to:

```ts
assert.equal(getHeaderAnnouncement('en'), 'Complimentary delivery from 500 MAD in Morocco - International delivery available')
assert.equal(getHeaderAnnouncement('fr'), 'Livraison offerte dès 500 MAD au Maroc - Livraison internationale disponible')
```

Create:

```ts
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const footer = readFileSync(new URL('./Footer.tsx', import.meta.url), 'utf8')

test('keeps telephone and Instagram but removes footer e-mail and location', () => {
  assert.match(footer, /<Phone/)
  assert.match(footer, /<Instagram/)
  assert.doesNotMatch(footer, /<Mail/)
  assert.doesNotMatch(footer, /<MapPin/)
  assert.doesNotMatch(footer, /bonjour@perledorient\.ma/)
  assert.doesNotMatch(footer, /Casablanca, Morocco/)
  assert.match(footer, /delivered in Morocco and internationally/)
})
```

- [ ] **Step 2: Run focused tests and verify RED**

```powershell
node --experimental-strip-types --test src/components/layout/header-announcement.node.test.ts src/components/layout/international-delivery.node.test.ts
```

Expected: FAIL because announcement and footer still contain Morocco-only/contact copy.

- [ ] **Step 3: Update announcement text**

Use the two exact bilingual strings from Step 1 in `header-announcement.ts`.

- [ ] **Step 4: Simplify the footer and update its description**

Remove `Mail` and `MapPin` imports and their two rows. Preserve telephone and Instagram. Change the description ending to:

```text
Made in small series and delivered in Morocco and internationally.
```

- [ ] **Step 5: Run focused tests and verify GREEN**

Run the command from Step 2. Expected: all focused tests pass.

### Task 2: International storefront and policy copy

**Files:**
- Modify: `apps/web/src/components/layout/international-delivery.node.test.ts`
- Modify: `apps/web/src/i18n/perle-copy.ts`
- Modify: `apps/web/src/i18n/i18n.tsx`
- Modify: `apps/web/src/pages/BrandContentPage.tsx`
- Modify: `apps/web/src/pages/ContentPage.tsx`
- Modify: `apps/web/src/pages/HomePage.tsx`

**Interfaces:**
- Preserves all existing translation keys and content map routes.
- Changes copy only; no calculation or schema changes.

- [ ] **Step 1: Extend the source test and verify RED**

Read all five source files and assert:

```ts
assert.match(perleCopy, /Delivery in Morocco & worldwide/)
assert.match(perleCopy, /Livraison au Maroc et à l’international/)
assert.match(legacyCopy, /Delivery in Morocco & worldwide/)
assert.match(legacyCopy, /Livraison au Maroc et à l’international/)
assert.match(brandContent, /International delivery fees and timing are confirmed through WhatsApp according to destination/)
assert.match(contentPage, /International delivery fees and timing are confirmed through WhatsApp according to destination/)
assert.match(home, /Morocco & worldwide/)
```

Run:

```powershell
node --experimental-strip-types --test src/components/layout/international-delivery.node.test.ts
```

Expected: FAIL because these international strings are not yet present.

- [ ] **Step 2: Update trust and homepage wording**

- Active and legacy English trust copy: `Delivery in Morocco & worldwide`
- Active and legacy French trust copy: `Livraison au Maroc et à l’international`
- Homepage badge: `Morocco & worldwide`

- [ ] **Step 3: Update both delivery information maps**

Use this active delivery content:

```ts
'/delivery': ['Delivery in Morocco & worldwide', 'Orders are confirmed personally on WhatsApp. Casablanca delivery is 30 MAD, other Moroccan cities are 45 MAD, and delivery is complimentary from 500 MAD in Morocco. International delivery fees and timing are confirmed through WhatsApp according to destination.'],
```

Use the equivalent sentence in `ContentPage.tsx`, retaining its `Delivery policy` title and telephone-confirmation introduction.

- [ ] **Step 4: Run the focused source test and verify GREEN**

Run the command from Step 1. Expected: all focused tests pass.

### Task 3: Full verification

**Files:**
- Verify all files changed in Tasks 1 and 2.

- [ ] **Step 1: Run all Node source tests**

```powershell
$tests = Get-ChildItem -Path src -Recurse -Filter *.node.test.ts | ForEach-Object { $_.FullName }
& node --experimental-strip-types --test $tests
```

Expected: all source tests pass with 0 failures.

- [ ] **Step 2: Run Vitest**

```powershell
& 'C:\Program Files\nodejs\node.exe' '..\..\node_modules\vitest\vitest.mjs' run --config vitest.config.ts
```

Expected: all Vitest tests pass with 0 failures.

- [ ] **Step 3: Run lint and production build**

```powershell
npm.cmd run lint
npm.cmd run build
```

Expected: both commands exit with code 0.

No Git steps are included because the workspace is not a valid Git repository.
