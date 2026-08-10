# Mobile Commerce-First Storefront Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make mobile shopping product-first, simplify product information, and expose one compact purchase bar only on product-detail pages.

**Architecture:** Extract the fixed mobile purchase controls from `ProductPage` into a focused presentational component while keeping cart and checkout behavior in the page. Render a dedicated mobile `ProductCard` list on the home page and retain the current editorial showcase for larger screens through responsive wrappers. Protect both changes with component tests and Playwright geometry checks at 320 px, 390 px, tablet, and desktop widths.

**Tech Stack:** React 19, TypeScript 5.9, React Router, Tailwind CSS 3.4, Vitest, Testing Library, Playwright.

## Global Constraints

- Keep the existing warm white, charcoal, burgundy, and antique-gold visual language.
- Do not change checkout, cart, or WhatsApp order business logic.
- Do not redesign the global header or bottom navigation.
- The sticky purchase bar renders only on product-detail pages and below 768 px.
- The commerce-first home layout applies below 640 px; tablet and desktop retain the editorial composition.
- The sticky bar contains exactly one cart button and one visible-text order button, with no repeated product name or price.
- The sticky bar and bottom navigation do not overlap at 320 px or with safe-area insets.
- Mobile product titles render at 28–30 px while the desktop title scale stays unchanged.
- The full product description appears once, in a closed accordion by default.
- Icon-only controls have accessible names and touch targets of at least 44 px.
- Add no runtime dependency.

## File structure

- Create `apps/web/src/components/product/MobileProductActions.tsx`: the two fixed mobile actions and their accessible styling.
- Create `apps/web/src/components/product/MobileProductActions.test.tsx`: isolated action-count, callback, and disabled-state contract.
- Modify `apps/web/src/pages/ProductPage.tsx`: responsive product hierarchy and action-component integration.
- Modify `apps/web/src/pages/ProductPage.test.tsx`: hierarchy and direct-order regressions.
- Modify `apps/web/src/pages/HomePage.tsx`: vertical mobile cards and responsive editorial sections.
- Modify `apps/web/src/pages/HomePage.products.test.tsx`, `HomePage.ordering.test.tsx`, and `i18n/storefront-localization.test.tsx`: responsive and provider contracts.
- Modify `apps/web/e2e/storefront.spec.ts`: visibility, stacking, typography, route isolation, and overflow checks.

---

### Task 1: Focused mobile product purchase surface

**Files:**
- Create: `apps/web/src/components/product/MobileProductActions.tsx`
- Create: `apps/web/src/components/product/MobileProductActions.test.tsx`
- Modify: `apps/web/src/pages/ProductPage.tsx:1-60`
- Modify: `apps/web/src/pages/ProductPage.test.tsx:1-33`

**Interfaces:**
- Consumes: existing `add(): void`, `orderDirectly(): void`, `added: boolean`, and selected-variant stock from `ProductPage`.
- Produces: `MobileProductActions(props: MobileProductActionsProps): React.ReactElement` with the prop type shown in Step 3.

- [ ] **Step 1: Write the failing isolated component tests**

Create `MobileProductActions.test.tsx`:

~~~tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MobileProductActions } from './MobileProductActions'

const labels = {
  regionLabel: 'Actions d’achat sur mobile',
  addLabel: 'Ajouter au panier',
  orderLabel: 'Commander via WhatsApp',
  compactOrderLabel: 'Commander',
}

describe('MobileProductActions', () => {
  it('shows exactly two actions without product metadata', async () => {
    const onAdd = vi.fn()
    const onOrder = vi.fn()
    render(<MobileProductActions {...labels} added={false} disabled={false} onAdd={onAdd} onOrder={onOrder} />)

    const region = screen.getByRole('region', { name: labels.regionLabel })
    expect(screen.getAllByRole('button')).toHaveLength(2)
    expect(region).not.toHaveTextContent('Layali Necklace')
    expect(region).not.toHaveTextContent('MAD')
    await userEvent.click(screen.getByRole('button', { name: labels.addLabel }))
    await userEvent.click(screen.getByRole('button', { name: labels.orderLabel }))
    expect(onAdd).toHaveBeenCalledOnce()
    expect(onOrder).toHaveBeenCalledOnce()
  })

  it('disables both actions when the variant is unavailable', () => {
    render(<MobileProductActions {...labels} added={false} disabled onAdd={() => undefined} onOrder={() => undefined} />)
    screen.getAllByRole('button').forEach((button) => expect(button).toBeDisabled())
  })
})
~~~

- [ ] **Step 2: Run the isolated test and confirm the missing-module failure**

Run:

~~~powershell
npm --workspace @codavenue/web run test -- MobileProductActions.test.tsx
~~~

Expected: FAIL because `./MobileProductActions` does not exist.

- [ ] **Step 3: Implement the focused action component**

Create `MobileProductActions.tsx`:

~~~tsx
import { Check, MessageCircle, ShoppingBag } from 'lucide-react'

export type MobileProductActionsProps = {
  added: boolean
  disabled: boolean
  regionLabel: string
  addLabel: string
  orderLabel: string
  compactOrderLabel: string
  onAdd: () => void
  onOrder: () => void
}

export function MobileProductActions({
  added, disabled, regionLabel, addLabel, orderLabel, compactOrderLabel, onAdd, onOrder,
}: MobileProductActionsProps) {
  return <div
    role="region"
    aria-label={regionLabel}
    className="fixed bottom-[calc(76px+env(safe-area-inset-bottom))] left-3 right-3 z-30 mx-auto flex min-h-[64px] max-w-[720px] items-center gap-2 rounded-[6px] border border-line bg-white/95 p-2 shadow-[0_-10px_30px_rgba(47,42,44,.12)] backdrop-blur-md md:hidden"
  >
    <button type="button" onClick={onAdd} disabled={disabled} className="grid h-12 w-12 shrink-0 place-items-center rounded-[6px] border border-[#2F2A2C] bg-white text-[#2F2A2C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-40" aria-label={addLabel}>
      {added ? <Check size={17} aria-hidden="true" /> : <ShoppingBag size={17} aria-hidden="true" />}
    </button>
    <button type="button" onClick={onOrder} disabled={disabled} aria-label={orderLabel} className="inline-flex min-h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-[6px] bg-[#C4953D] px-4 text-[10px] font-bold uppercase tracking-[.09em] text-[#241F21] shadow-[0_8px_22px_rgba(196,149,61,.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:bg-[#E8E1D9] disabled:text-[#8B7E80]">
      <MessageCircle size={16} aria-hidden="true" />
      <span className="hidden min-[390px]:inline">{orderLabel}</span>
      <span className="min-[390px]:hidden">{compactOrderLabel}</span>
    </button>
  </div>
}
~~~

- [ ] **Step 4: Add failing product-page hierarchy assertions**

Extract the current render setup in `ProductPage.test.tsx` into this helper, then add the test below it:

~~~tsx
function renderProductPage() {
  return render(
    <MemoryRouter initialEntries={['/products/layali-necklace']}>
      <I18nProvider>
        <CartProvider>
          <Routes>
            <Route path="/products/:slug" element={<ProductPage />} />
            <Route path="/checkout" element={<div>Checkout form</div>} />
          </Routes>
        </CartProvider>
      </I18nProvider>
    </MemoryRouter>,
  )
}
~~~

~~~tsx
it('keeps the mobile summary compact and the complete description closed', () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Offline catalogue')))
  renderProductPage()

  expect(screen.getByRole('heading', { level: 1 })).toHaveClass('text-[1.8rem]', 'sm:text-5xl')
  expect(screen.getByText(/handcrafted piece shaped by oriental motifs/i)).toHaveClass('hidden', 'sm:block')
  expect(screen.getByText('Description').closest('details')).not.toHaveAttribute('open')

  const actions = screen.getByRole('region', { name: 'Actions d’achat sur mobile' })
  expect(within(actions).getAllByRole('button')).toHaveLength(2)
  expect(actions).not.toHaveTextContent('Layali Necklace')
  expect(actions).not.toHaveTextContent('MAD')
})
~~~

Keep the existing quantity, cart replacement, and checkout navigation assertion unchanged.

- [ ] **Step 5: Run focused tests and confirm the old hierarchy fails**

Run:

~~~powershell
npm --workspace @codavenue/web run test -- ProductPage.test.tsx MobileProductActions.test.tsx
~~~

Expected: the component test passes; the page test fails on the old 37.6 px title, visible short description, open accordion, and sticky metadata.

- [ ] **Step 6: Integrate and simplify `ProductPage`**

Apply these exact changes:

1. Import `MobileProductActions`.
2. Set the H1 classes to `text-[1.8rem] leading-[1.08] sm:text-5xl sm:leading-[1.02]`.
3. Set the short description to `hidden py-5 text-[15px] leading-7 text-muted sm:block sm:text-base`.
4. Add `hidden md:inline-flex` to both inline purchase buttons; keep variants and quantity visible.
5. Remove `open` from the description `details`.
6. Replace the old fixed bar with:

~~~tsx
<MobileProductActions
  added={added}
  disabled={variant.stock === 0}
  regionLabel={locale === 'fr' ? 'Actions d’achat sur mobile' : 'إجراءات الشراء على الهاتف'}
  addLabel={t('addToCart')}
  orderLabel={copy.directOrder}
  compactOrderLabel={locale === 'fr' ? 'Commander' : 'اطلبي'}
  onAdd={add}
  onOrder={orderDirectly}
/>
~~~

7. Reserve the action surface with `pb-24 md:pb-0` on the product-page main element.

- [ ] **Step 7: Verify and commit Task 1**

Run:

~~~powershell
npm --workspace @codavenue/web run test -- ProductPage.test.tsx MobileProductActions.test.tsx
~~~

Expected: PASS, including the existing direct-order business-flow test.

Commit:

~~~powershell
git add apps/web/src/components/product/MobileProductActions.tsx apps/web/src/components/product/MobileProductActions.test.tsx apps/web/src/pages/ProductPage.tsx apps/web/src/pages/ProductPage.test.tsx
git commit -m "refactor: simplify mobile product purchase actions"
~~~

---

### Task 2: Product-first mobile home page

**Files:**
- Modify: `apps/web/src/pages/HomePage.tsx:1-91`
- Modify: `apps/web/src/pages/HomePage.products.test.tsx:1-25`
- Modify: `apps/web/src/pages/HomePage.ordering.test.tsx:1-31`
- Modify: `apps/web/src/i18n/storefront-localization.test.tsx`

**Interfaces:**
- Consumes: `ProductCard({ product }: { product: Product })` and the existing `homeProducts` selection.
- Produces: stable hooks `home-hero`, `mobile-home-products`, and `desktop-home-products`.

- [ ] **Step 1: Write the failing responsive home assertions**

Import `within` where the new assertions use it. Import `CartProvider` and wrap every direct `HomePage` render in the three test files as follows:

~~~tsx
render(
  <MemoryRouter>
    <I18nProvider>
      <CartProvider><HomePage /></CartProvider>
    </I18nProvider>
  </MemoryRouter>,
)
~~~

In the live-product fixture, replace the empty variants array with:

~~~tsx
variants: [{
  id: 'variant-real-1',
  name: 'Doré',
  sku: 'CDP-REAL-1',
  price: 520,
  stock: 2,
  image: 'https://cdn.example.com/collier.jpg',
}],
~~~

Replace the product showcase assertions with:

~~~tsx
const mobileProducts = await screen.findByTestId('mobile-home-products')
const desktopProducts = screen.getByTestId('desktop-home-products')
expect(mobileProducts).toHaveClass('grid', 'grid-cols-1', 'sm:hidden')
expect(within(mobileProducts).getByRole('article')).toBeInTheDocument()
expect(within(mobileProducts).getByRole('button', { name: /Commander Collier Réel/i })).toBeInTheDocument()
expect(desktopProducts).toHaveClass('hidden', 'sm:grid')
expect(within(desktopProducts).getByRole('img', { name: 'Collier Réel' }).closest('a')).toHaveAttribute('href', '/products/collier-reel')
~~~

Add to the ordering-guide test:

~~~tsx
expect(screen.getByTestId('home-hero')).toHaveClass('hidden', 'sm:block')
expect(screen.getByLabelText('Comment commander')).toHaveClass('hidden', 'sm:block')
~~~

- [ ] **Step 2: Run focused tests and confirm the responsive hooks are missing**

Run:

~~~powershell
npm --workspace @codavenue/web run test -- HomePage.products.test.tsx HomePage.ordering.test.tsx storefront-localization.test.tsx
~~~

Expected: FAIL because the responsive wrappers and mobile `ProductCard` list do not exist.

- [ ] **Step 3: Implement the responsive home composition**

In `HomePage.tsx`:

1. Import `ProductCard`.
2. Give the hero `data-testid="home-hero"` and classes `hidden overflow-hidden border-b border-line bg-white sm:block`.
3. Change the collection section spacing to `py-8 sm:py-12 lg:py-20`.
4. Insert:

~~~tsx
<div data-testid="mobile-home-products" className="grid grid-cols-1 gap-6 sm:hidden">
  {homeProducts.map((product) => <ProductCard key={product.id} product={product} />)}
</div>
~~~

5. Give the current editorial wrapper `data-testid="desktop-home-products"` and classes `hidden sm:grid sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-5`.
6. Keep the mobile “View all” link after the cards.
7. Add `hidden sm:block` to the “Comment commander ?” section, preserving its desktop content and styling.

- [ ] **Step 4: Verify and commit Task 2**

Run:

~~~powershell
npm --workspace @codavenue/web run test -- HomePage.products.test.tsx HomePage.ordering.test.tsx storefront-localization.test.tsx
~~~

Expected: PASS for French and Arabic, with all mobile cards receiving cart context.

Commit:

~~~powershell
git add apps/web/src/pages/HomePage.tsx apps/web/src/pages/HomePage.products.test.tsx apps/web/src/pages/HomePage.ordering.test.tsx apps/web/src/i18n/storefront-localization.test.tsx
git commit -m "feat: lead mobile home with product cards"
~~~

---

### Task 3: Browser-level responsive regressions

**Files:**
- Modify: `apps/web/e2e/storefront.spec.ts`

**Interfaces:**
- Consumes: the responsive test hooks from Task 2 and the purchase-region accessible name from Task 1.
- Produces: geometry and route-isolation guarantees at real browser widths.

- [ ] **Step 1: Replace the obsolete mobile swipe-rail test**

Replace it with a mobile test that:

~~~ts
await page.setViewportSize({ width: 390, height: 844 })
await page.goto('/')
await expect(page.getByTestId('home-hero')).toBeHidden()
await expect(page.getByTestId('mobile-home-products')).toBeVisible()
const cards = page.getByTestId('mobile-home-products').locator('article')
expect(await cards.count()).toBeGreaterThan(1)
const boxes = await cards.evaluateAll((elements) => elements.slice(0, 2).map((element) => {
  const box = element.getBoundingClientRect()
  return { x: box.x, top: box.top, width: box.width, height: box.height }
}))
expect(boxes[0].width).toBeGreaterThanOrEqual(350)
expect(Math.abs(boxes[0].x - boxes[1].x)).toBeLessThan(2)
expect(boxes[1].top).toBeGreaterThan(boxes[0].top + boxes[0].height)
expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
~~~

Also assert `page.locator('section[aria-label="Comment commander"]')` is hidden; French is the provider's deterministic default when the browser context has no saved locale.

- [ ] **Step 2: Add desktop-preservation coverage**

Add a 1440×900 test asserting:

~~~ts
await expect(page.getByTestId('home-hero')).toBeVisible()
await expect(page.getByTestId('desktop-home-products')).toBeVisible()
await expect(page.getByTestId('mobile-home-products')).toBeHidden()
await expect(page.locator('section[aria-label="Comment commander"]')).toBeVisible()
~~~

- [ ] **Step 3: Strengthen the purchase-bar geometry test**

For widths 320 and 390, assert:

~~~ts
const purchaseBar = page.getByRole('region', { name: 'Actions d’achat sur mobile' })
const mobileNav = page.getByRole('navigation', { name: 'Navigation principale mobile' })
await expect(purchaseBar).toBeVisible()
await expect(purchaseBar.getByRole('button')).toHaveCount(2)
await expect(purchaseBar.getByText(/MAD/)).toHaveCount(0)
await expect(purchaseBar.getByText('Layali Necklace')).toHaveCount(0)
const purchaseBox = await purchaseBar.boundingBox()
const navBox = await mobileNav.boundingBox()
if (!purchaseBox || !navBox) throw new Error('Mobile purchase controls are missing a measured region')
expect(purchaseBox.y + purchaseBox.height).toBeLessThanOrEqual(navBox.y - 4)
~~~

In the same loop, use these exact assertions for width, title size, hidden inline actions, and the closed description:

~~~ts
expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
const titleSize = await page.locator('main h1').evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize))
expect(titleSize).toBeGreaterThanOrEqual(28)
expect(titleSize).toBeLessThanOrEqual(30)
await expect(page.locator('main aside').getByRole('button', { name: 'Commander via WhatsApp' })).toBeHidden()
await expect(page.locator('main aside').getByRole('button', { name: 'Ajouter à ma sélection' })).toBeHidden()
await expect(page.locator('main details').first()).not.toHaveAttribute('open', '')
~~~

After the loop, navigate to `/catalogue` and assert route isolation:

~~~ts
await page.goto('/catalogue')
await expect(page.getByRole('region', { name: 'Actions d’achat sur mobile' })).toHaveCount(0)
~~~

- [ ] **Step 4: Run focused browser checks**

Run:

~~~powershell
npm --workspace @codavenue/web run test:e2e -- storefront.spec.ts --project=mobile
npm --workspace @codavenue/web run test:e2e -- storefront.spec.ts --project=chromium
~~~

Expected: both projects PASS; 320 px and 390 px have no overflow or fixed-element overlap, and desktop retains editorial content.

- [ ] **Step 5: Run the complete verification suite**

Run:

~~~powershell
npm run test:web
npm run lint:web
npm run build:web
~~~

Expected: zero Vitest failures, zero ESLint warnings, successful TypeScript compilation, and successful Vite production build.

- [ ] **Step 6: Inspect and commit the verified browser coverage**

Run:

~~~powershell
git diff --check
git status --short
git diff --stat
~~~

Expected: no whitespace errors and only the planned storefront and test files changed.

Commit:

~~~powershell
git add apps/web/e2e/storefront.spec.ts
git commit -m "test: cover mobile commerce-first layout"
~~~
