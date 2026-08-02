# Instagram Header and Footer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add safe, accessible Instagram links to the header and footer for `https://instagram.com/ma.perle.dorient`.

**Architecture:** Store the Instagram URL and handle in one focused configuration module, then consume them from the existing header and footer. The header uses a compact icon-only external link; the footer uses a labelled contact-style row.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Lucide React, Node test runner, ESLint, Vite.

## Global Constraints

- Use `https://instagram.com/ma.perle.dorient`.
- Show the header icon on mobile, tablet, and desktop.
- Show `@ma.perle.dorient` in the footer.
- Use `target="_blank"` and `rel="noreferrer"` on both links.
- Preserve the complete mobile wordmark and all existing header controls.
- Do not change the fixed bottom navigation.

---

### Task 1: Shared Instagram link and responsive placements

**Files:**
- Create: `apps/web/src/config/social-links.ts`
- Create: `apps/web/src/components/layout/instagram-links.node.test.ts`
- Modify: `apps/web/src/components/layout/Header.tsx`
- Modify: `apps/web/src/components/layout/Footer.tsx`

**Interfaces:**
- Produces: `INSTAGRAM_URL: string`
- Produces: `INSTAGRAM_HANDLE: string`
- Header and footer consume both constants.

- [ ] **Step 1: Write the failing test**

```ts
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../../config/social-links.ts'

const header = readFileSync(new URL('./Header.tsx', import.meta.url), 'utf8')
const footer = readFileSync(new URL('./Footer.tsx', import.meta.url), 'utf8')

test('uses the approved Instagram profile in the header and footer', () => {
  assert.equal(INSTAGRAM_URL, 'https://instagram.com/ma.perle.dorient')
  assert.equal(INSTAGRAM_HANDLE, '@ma.perle.dorient')
  for (const source of [header, footer]) {
    assert.match(source, /href=\{INSTAGRAM_URL\}/)
    assert.match(source, /target="_blank"/)
    assert.match(source, /rel="noreferrer"/)
    assert.match(source, /<Instagram/)
  }
  assert.match(header, /aria-label="Instagram Perle d'Orient"/)
  assert.match(footer, /\{INSTAGRAM_HANDLE\}/)
  assert.ok(header.indexOf('<Instagram') > header.indexOf('<ShoppingBag'))
})
```

- [ ] **Step 2: Run the focused test and verify RED**

```powershell
node --experimental-strip-types --test src/components/layout/instagram-links.node.test.ts
```

Expected: FAIL because `social-links.ts` does not exist.

- [ ] **Step 3: Add shared social constants**

```ts
export const INSTAGRAM_URL = 'https://instagram.com/ma.perle.dorient'
export const INSTAGRAM_HANDLE = '@ma.perle.dorient'
```

- [ ] **Step 4: Add the header Instagram control**

Import `Instagram` from `lucide-react` and `INSTAGRAM_URL` from the shared module. Change the utility group to `gap-2 sm:gap-3` and language padding to `pr-2 sm:pr-3`. After the cart link, add:

```tsx
<a
  href={INSTAGRAM_URL}
  target="_blank"
  rel="noreferrer"
  aria-label="Instagram Perle d'Orient"
  className="transition-colors hover:text-accent"
>
  <Instagram size={19} strokeWidth={1.6} />
</a>
```

- [ ] **Step 5: Add the labelled footer Instagram row**

Import `Instagram`, `INSTAGRAM_HANDLE`, and `INSTAGRAM_URL`. Replace the old plain handle paragraph with:

```tsx
<a
  href={INSTAGRAM_URL}
  target="_blank"
  rel="noreferrer"
  className="flex gap-3 transition-colors hover:text-white"
  aria-label="Instagram Perle d'Orient"
>
  <Instagram size={16} className="text-accent" />
  {INSTAGRAM_HANDLE}
</a>
```

- [ ] **Step 6: Run the focused test and verify GREEN**

```powershell
node --experimental-strip-types --test src/components/layout/instagram-links.node.test.ts
```

Expected: 1 test passes with 0 failures.

### Task 2: Full verification

**Files:**
- Verify all files changed in Task 1.

- [ ] **Step 1: Run all Node source tests**

```powershell
$tests = Get-ChildItem -Path src -Recurse -Filter *.node.test.ts | ForEach-Object { $_.FullName }
& node --experimental-strip-types --test $tests
```

Expected: all tests pass with 0 failures.

- [ ] **Step 2: Run Vitest**

```powershell
& 'C:\Program Files\nodejs\node.exe' '..\..\node_modules\vitest\vitest.mjs' run --config vitest.config.ts
```

Expected: all tests pass with 0 failures.

- [ ] **Step 3: Run lint and production build**

```powershell
npm.cmd run lint
npm.cmd run build
```

Expected: both commands exit with code 0.

No Git steps are included because the workspace is not a valid Git repository.
