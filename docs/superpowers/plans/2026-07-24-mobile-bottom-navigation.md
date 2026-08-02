# Mobile Bottom Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fixed, accessible four-item bottom navigation on mobile and tablet while keeping a compact icon-based header and the existing desktop navigation.

**Architecture:** A focused `MobileBottomNavigation` component will own mobile route presentation, while a small pure route helper will make active-state behavior directly testable. `Header` will remain responsible for the announcement, branding, utility controls, and desktop navigation; `App` will integrate the fixed bar and collision-safe spacing.

**Tech Stack:** React 19, React Router, TypeScript, Tailwind CSS, Lucide React, Node test runner, ESLint, Vite.

## Global Constraints

- Mobile and tablet means viewport widths below `1024px`.
- Desktop means viewport widths at or above `1024px`.
- Keep the top announcement, logo, language switcher, search, and cart.
- Remove the hamburger button and expandable mobile menu.
- Display Accueil/Home, Catalogue, Notre histoire/Our story, and Contact in the bottom navigation.
- Keep visible labels, at least 44-pixel touch targets, and `aria-current="page"` on the active destination.
- Preserve the current desktop horizontal navigation.
- Keep the floating WhatsApp control clear of the fixed navigation.

---

### Task 1: Route-aware mobile bottom navigation

**Files:**
- Create: `apps/web/src/components/layout/mobile-bottom-navigation.ts`
- Create: `apps/web/src/components/layout/mobile-bottom-navigation.node.test.ts`
- Create: `apps/web/src/components/layout/MobileBottomNavigation.tsx`

**Interfaces:**
- Produces: `isMobileNavigationLinkActive(pathname: string, target: string): boolean`
- Produces: `MobileBottomNavigation(): JSX.Element`
- Consumes: `useLocation()` from React Router and `useI18n()` from the existing localization context.

- [ ] **Step 1: Write the failing route and component contract tests**

```ts
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { isMobileNavigationLinkActive } from './mobile-bottom-navigation.ts'

const component = readFileSync(new URL('./MobileBottomNavigation.tsx', import.meta.url), 'utf8')

test('maps storefront routes to the correct bottom destination', () => {
  assert.equal(isMobileNavigationLinkActive('/', '/'), true)
  assert.equal(isMobileNavigationLinkActive('/catalogue', '/catalogue'), true)
  assert.equal(isMobileNavigationLinkActive('/products/perle-doree', '/catalogue'), true)
  assert.equal(isMobileNavigationLinkActive('/about', '/about'), true)
  assert.equal(isMobileNavigationLinkActive('/contact', '/contact'), true)
  assert.equal(isMobileNavigationLinkActive('/cart', '/catalogue'), false)
})

test('renders four labelled links and hides the bar on desktop', () => {
  assert.match(component, /lg:hidden/)
  assert.match(component, /aria-current/)
  assert.match(component, /min-h-\[44px\]/)
  assert.match(component, /to="\/"/)
  assert.match(component, /to="\/catalogue"/)
  assert.match(component, /to="\/about"/)
  assert.match(component, /to="\/contact"/)
})
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
node --test src/components/layout/mobile-bottom-navigation.node.test.ts
```

Expected: FAIL because `mobile-bottom-navigation.ts` and `MobileBottomNavigation.tsx` do not exist.

- [ ] **Step 3: Implement the pure active-route helper**

```ts
export function isMobileNavigationLinkActive(pathname: string, target: string) {
  if (target === '/') return pathname === '/'
  if (target === '/catalogue') return pathname === '/catalogue' || pathname.startsWith('/products/')
  return pathname === target
}
```

- [ ] **Step 4: Implement the mobile navigation component**

Create a semantic fixed `nav` using `Home`, `Gem`, `BookOpen`, and `MessageCircle` from Lucide. Build four link descriptors from the current locale, map them to React Router `Link` elements, apply `aria-current={active ? 'page' : undefined}`, and use these exact responsive/layout properties:

```tsx
className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(46,22,29,0.08)] backdrop-blur lg:hidden"
```

Each link must contain `min-h-[64px]`, and its inner icon/label group must contain `min-h-[44px]`. Active links use burgundy `text-primary` plus a centered antique-gold top indicator; inactive links use `text-ink/55`.

- [ ] **Step 5: Run the focused test and verify GREEN**

Run:

```powershell
node --test src/components/layout/mobile-bottom-navigation.node.test.ts
```

Expected: 2 tests pass with 0 failures.

### Task 2: Compact header and application integration

**Files:**
- Modify: `apps/web/src/components/layout/Header.tsx`
- Modify: `apps/web/src/components/layout/header-nav.node.test.ts`
- Modify: `apps/web/src/App.tsx`
- Create: `apps/web/src/styles/mobile-navigation-layout.node.test.ts`

**Interfaces:**
- Consumes: `MobileBottomNavigation` from Task 1.
- Preserves: desktop `links` and `isHeaderLinkActive()` behavior.
- Preserves: header language, search, cart, announcement, and logo controls.

- [ ] **Step 1: Add failing source-contract tests**

Extend `header-nav.node.test.ts`:

```ts
test('keeps utility controls but removes the mobile hamburger menu', () => {
  assert.doesNotMatch(header, /Toggle navigation/)
  assert.doesNotMatch(header, /<Menu/)
  assert.match(header, /Change language/)
  assert.match(header, /<Search/)
  assert.match(header, /<ShoppingBag/)
  assert.match(header, /<Logo/)
})
```

Create `mobile-navigation-layout.node.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the two source-contract test files and verify RED**

Run:

```powershell
node --test src/components/layout/header-nav.node.test.ts src/styles/mobile-navigation-layout.node.test.ts
```

Expected: FAIL because the hamburger still exists and `App` does not yet render or space for the bottom navigation.

- [ ] **Step 3: Simplify the header**

Remove the `Menu`, `X`, `NavLink`, and `useState` imports; remove `open` state, the hamburger button, and the expandable mobile nav. Keep the full logo visible when space permits and the mark-only logo on the narrowest screens. Keep the existing desktop `nav` at `lg:flex` and preserve all utility icons.

- [ ] **Step 4: Integrate layout and floating actions**

Import and render `MobileBottomNavigation` in `App.tsx`. Add:

```tsx
className="min-h-screen bg-canvas pb-[calc(76px+env(safe-area-inset-bottom))] text-ink lg:pb-0"
```

Change the WhatsApp link positioning to:

```tsx
className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-5 z-30 ... lg:bottom-5"
```

Render `<MobileBottomNavigation />` after the WhatsApp link so it is available throughout storefront routes.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run:

```powershell
node --test src/components/layout/mobile-bottom-navigation.node.test.ts src/components/layout/header-nav.node.test.ts src/styles/mobile-navigation-layout.node.test.ts
```

Expected: all focused tests pass with 0 failures.

### Task 3: Full verification

**Files:**
- Verify all files changed in Tasks 1 and 2.

**Interfaces:**
- Consumes the completed implementation.
- Produces fresh evidence that tests, lint, and production compilation pass.

- [ ] **Step 1: Run all Node source tests**

Run:

```powershell
node --test "src/**/*.node.test.ts"
```

Expected: all Node tests pass with 0 failures.

- [ ] **Step 2: Run the Vitest suite**

Run:

```powershell
npm.cmd test
```

Expected: all Vitest tests pass with 0 failures.

- [ ] **Step 3: Run lint**

Run:

```powershell
npm.cmd run lint
```

Expected: exit code 0 with no warnings or errors.

- [ ] **Step 4: Run the production build**

Run:

```powershell
npm.cmd run build
```

Expected: TypeScript and Vite finish with exit code 0.

- [ ] **Step 5: Review the requirement checklist**

Confirm from the final source and test output that:

- Header utilities and logo remain available below 1024 pixels.
- The hamburger and expandable menu are absent.
- The four labelled destinations appear only below 1024 pixels.
- Desktop navigation remains unchanged.
- Active route, safe-area spacing, content spacing, and WhatsApp positioning meet the approved specification.

No Git commit step is included because `C:\Imad Makhlas\projects\codavenue` is not currently a valid Git repository.
