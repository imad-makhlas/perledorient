# Premium Product Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the small, unclear product-card footer with an aligned premium information panel containing dimensions, readable prices, and a status pill.

**Architecture:** Extend the catalogue summary model with an optional dimensions string already available in the jewelry seed. Keep rendering inside the existing `ProductCard`, using conditional dimensions markup and responsive Tailwind classes.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Lucide React, Node test runner, Vitest, ESLint, Vite.

## Global Constraints

- Preserve the existing catalogue grid and product routes.
- Keep the card editorial and avoid a permanent CTA button.
- Display dimensions only when present.
- Keep all availability labels localized.
- Make price, comparison price, and availability readable on two-column mobile cards.

---

### Task 1: Dimensions data contract

**Files:**
- Create: `apps/web/src/components/product/product-card-premium.node.test.ts`
- Modify: `apps/web/src/features/catalog/catalog.ts`
- Modify: `apps/web/src/data/jewelry-products.ts`

**Interfaces:**
- Extends `ProductSummary` with `dimensions?: string`.
- Jewelry seed mapping publishes its existing `dimensions` value.

- [ ] **Step 1: Write the failing data contract test**

```ts
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const catalog = readFileSync(new URL('../../features/catalog/catalog.ts', import.meta.url), 'utf8')
const jewelry = readFileSync(new URL('../../data/jewelry-products.ts', import.meta.url), 'utf8')
const card = readFileSync(new URL('./ProductCard.tsx', import.meta.url), 'utf8')

test('publishes and conditionally renders product dimensions', () => {
  assert.match(catalog, /dimensions\?: string/)
  assert.match(jewelry, /material, dimensions, image/)
  assert.match(card, /\{product\.dimensions &&/)
  assert.match(card, /locale === 'fr' \? 'Taille' : 'Size'/)
  assert.match(card, /<Ruler/)
})
```

- [ ] **Step 2: Run the test and verify RED**

```powershell
node --experimental-strip-types --test src/components/product/product-card-premium.node.test.ts
```

Expected: FAIL because dimensions are not in `ProductSummary` or the card.

- [ ] **Step 3: Add and populate `dimensions`**

Add `dimensions?: string` after `material?: string` in `ProductSummary`. In the jewelry seed result, include `dimensions` alongside `material`.

### Task 2: Premium card information panel

**Files:**
- Modify: `apps/web/src/components/product/product-card-premium.node.test.ts`
- Modify: `apps/web/src/components/product/ProductCard.tsx`

**Interfaces:**
- Consumes `product.dimensions`.
- Preserves `ProductCard({ product }: { product: ProductSummary })`.

- [ ] **Step 1: Add failing premium presentation assertions**

```ts
test('uses a premium readable information hierarchy', () => {
  assert.match(card, /border border-line/)
  assert.match(card, /hover:-translate-y-1/)
  assert.match(card, /min-h-\[205px\]/)
  assert.match(card, /text-\[15px\]/)
  assert.match(card, /text-\[12px\]/)
  assert.match(card, /rounded-full/)
  assert.match(card, /text-\[10px\]/)
  assert.match(card, /h-1\.5 w-1\.5 rounded-full bg-current/)
})
```

- [ ] **Step 2: Run the focused test and verify RED**

Run the Task 1 test command. Expected: presentation assertions fail.

- [ ] **Step 3: Implement the premium card**

- Import `Ruler`.
- Wrap the article in a white border with `transition duration-500 hover:-translate-y-1` and a subtle custom hover shadow.
- Use an information panel with `min-h-[205px]`, `px-4`, and `py-5`.
- Use material text at `text-[10px] sm:text-[11px]`.
- Use name text at `text-[1.2rem] sm:text-[1.4rem]`.
- Conditionally render a dimensions row with `Ruler`, localized `Size/Taille`, and 11–12 pixel text.
- Separate the pricing/status section with a top border.
- Use a 15–16 pixel current price and 12-pixel comparison price.
- Render availability as a soft rounded pill with a current-color status dot and at least 10-pixel text.
- Stack price and status on narrow cards; align them horizontally from `sm`.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run the Task 1 test command. Expected: both tests pass.

### Task 3: Full verification

**Files:**
- Verify all files changed in Tasks 1 and 2.

- [ ] **Step 1: Run all Node source tests**

```powershell
$tests = Get-ChildItem -Path src -Recurse -Filter *.node.test.ts | ForEach-Object { $_.FullName }
& node --experimental-strip-types --test $tests
```

- [ ] **Step 2: Run Vitest**

```powershell
& 'C:\Program Files\nodejs\node.exe' '..\..\node_modules\vitest\vitest.mjs' run --config vitest.config.ts
```

- [ ] **Step 3: Run lint and production build**

```powershell
npm.cmd run lint
npm.cmd run build
```

Expected: every command exits with code 0.

No Git steps are included because the workspace is not a valid Git repository.
