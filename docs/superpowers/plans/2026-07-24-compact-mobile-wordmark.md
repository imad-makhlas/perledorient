# Compact Mobile Wordmark Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show the complete Perle d’Orient wordmark and artisan signature in the narrow mobile header using an elegant compact logo variant.

**Architecture:** Extend the existing `Logo` component with a presentation-only `compact` prop so branding remains centralized. The header will render this compact complete logo below `sm` and retain the current full-size version from `sm` upward.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Node test runner, ESLint, Vite.

## Global Constraints

- Keep “Perle d’Orient” and “Bijoux artisanaux” visible at every width.
- Preserve the antique-gold “Orient” treatment.
- Keep language, search, and cart controls visible.
- Do not change desktop navigation or the fixed mobile/tablet bottom navigation.

---

### Task 1: Compact complete logo variant

**Files:**
- Modify: `apps/web/src/components/brand/Logo.tsx`
- Modify: `apps/web/src/components/layout/Header.tsx`
- Create: `apps/web/src/components/brand/logo-responsive.node.test.ts`

**Interfaces:**
- Extends `LogoProps` with `compact?: boolean`.
- Header consumes `<Logo compact />` below `sm`.

- [ ] **Step 1: Write the failing source test**

```ts
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
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
node --experimental-strip-types --test src/components/brand/logo-responsive.node.test.ts
```

Expected: FAIL because `Logo` has no `compact` prop and the header still uses `markOnly`.

- [ ] **Step 3: Implement the compact presentation**

Add `compact?: boolean` to `LogoProps`. Use conditional classes to render:

- Compact outer gap: `gap-2`
- Compact mark and SVG: `h-9 w-9`
- Compact wordmark: `text-[1.125rem]`
- Compact signature: `mt-0.5 text-[6px] tracking-[.22em]`
- Existing classes when `compact` is false

Do not connect `compact` to `markOnly`; the wordmark and signature remain present.

- [ ] **Step 4: Activate the compact logo in the header**

Keep:

```tsx
<span className="hidden sm:block"><Logo /></span>
```

Replace the narrow variant with:

```tsx
<span className="sm:hidden"><Logo compact /></span>
```

- [ ] **Step 5: Run the focused test and verify GREEN**

Run:

```powershell
node --experimental-strip-types --test src/components/brand/logo-responsive.node.test.ts
```

Expected: 1 test passes with 0 failures.

### Task 2: Full verification

**Files:**
- Verify the files changed in Task 1.

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

- [ ] **Step 3: Run lint and build**

```powershell
npm.cmd run lint
npm.cmd run build
```

Expected: both commands exit with code 0.

No Git steps are included because the workspace is not a valid Git repository.
