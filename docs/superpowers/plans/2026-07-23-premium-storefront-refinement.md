# Perle d'Orient Premium Storefront Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize the Perle d'Orient category grid and catalogue controls into a balanced, responsive premium boutique interface.

**Architecture:** Keep filtering state inside `CataloguePage` and extract pure localized presentation data into a small catalogue UI helper that can be tested without a browser. Keep the home category grid data-driven, but enforce one card component geometry for every category. Extend existing shared CSS only for reusable premium controls rather than adding a component library.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, existing Node test runner, ESLint.

## Global Constraints

- Preserve the ivory `#FFF9F0`, deep burgundy `#681F32`, and antique gold `#B8893D` identity.
- Preserve Inter typography and English/French behavior.
- Keep the black delivery announcement bar and Oriental Arch & Pearl logo.
- Use five equal category cards: Necklaces, Earrings, Bracelets, Rings, and Gift Sets.
- Keep WhatsApp as the only ordering method.
- Do not change backend product models, owner authentication, or product-management APIs.
- Leave all changes uncommitted because the user manages Git.

---

### Task 1: Localized catalogue presentation contract

**Files:**
- Create: `apps/web/src/features/catalog/catalog-ui.ts`
- Create: `apps/web/src/features/catalog/catalog-ui.node.test.ts`

**Interfaces:**
- Consumes: locale values `'en' | 'fr'` and `CatalogFilters['sort']`.
- Produces: `catalogUi(locale)` returning localized search, availability, results, empty-state, and sort-option labels; `categoryLabel(category, locale)` returning localized jewelry category labels.

- [ ] **Step 1: Write the failing localized presentation test**

```ts
import assert from 'node:assert/strict'
import test from 'node:test'
import { catalogUi, categoryLabel } from './catalog-ui.ts'

test('provides complete English and French catalogue labels', () => {
  assert.equal(catalogUi('en').sort.featured, 'Featured')
  assert.equal(catalogUi('fr').sort.featured, 'Sélection')
  assert.equal(categoryLabel('Earrings', 'fr'), "Boucles d'oreilles")
  assert.equal(categoryLabel('Gift Sets', 'fr'), 'Coffrets cadeaux')
})
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
& 'C:\Users\imadm\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test --experimental-strip-types apps/web/src/features/catalog/catalog-ui.node.test.ts
```

Expected: FAIL because `catalog-ui.ts` does not exist.

- [ ] **Step 3: Implement the localized presentation helper**

```ts
export type CatalogLocale = 'en' | 'fr'

const copy = {
  en: { search: 'Search the collection', availability: 'Available now', results: 'pieces', emptyTitle: 'No piece matches your selection.', emptyBody: 'Try another category or clear a filter.', sortLabel: 'Sort by', sort: { featured: 'Featured', newest: 'Newest', 'price-asc': 'Price: low to high', 'price-desc': 'Price: high to low', 'name-asc': 'Name A-Z', 'name-desc': 'Name Z-A' } },
  fr: { search: 'Rechercher dans la collection', availability: 'Disponibles', results: 'pièces', emptyTitle: 'Aucun bijou ne correspond à votre sélection.', emptyBody: 'Essayez une autre catégorie ou retirez un filtre.', sortLabel: 'Trier par', sort: { featured: 'Sélection', newest: 'Nouveautés', 'price-asc': 'Prix croissant', 'price-desc': 'Prix décroissant', 'name-asc': 'Nom A-Z', 'name-desc': 'Nom Z-A' } },
} as const

const categories = {
  en: { All: 'All pieces', Necklaces: 'Necklaces', Earrings: 'Earrings', Bracelets: 'Bracelets', Rings: 'Rings', 'Gift Sets': 'Gift Sets' },
  fr: { All: 'Tous les bijoux', Necklaces: 'Colliers', Earrings: "Boucles d'oreilles", Bracelets: 'Bracelets', Rings: 'Bagues', 'Gift Sets': 'Coffrets cadeaux' },
} as const

export function catalogUi(locale: CatalogLocale) { return copy[locale] }
export function categoryLabel(category: keyof typeof categories.en, locale: CatalogLocale) { return categories[locale][category] }
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run the Step 2 command. Expected: 1 test passed, 0 failed.

---

### Task 2: Balanced premium category grid

**Files:**
- Modify: `apps/web/src/pages/HomePage.tsx`

**Interfaces:**
- Consumes: the existing five-entry `categories` array and current locale from `useI18n()`.
- Produces: five equal-ratio category links with consistent overlay, numbering, title placement, and arrow treatment.

- [ ] **Step 1: Replace conditional card sizing with one shared geometry**

Use this card structure for every category:

```tsx
<Link className="group relative aspect-[4/5] overflow-hidden bg-burgundy sm:aspect-[5/6] lg:aspect-[4/5]">
  <img className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.025]" />
  <div className="absolute inset-0 bg-gradient-to-t from-burgundy/95 via-burgundy/15 to-black/5" />
  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 sm:p-7">
    {/* fixed number and localized title */}
  </div>
</Link>
```

Remove the `index < 2` aspect-ratio branch. Use `grid-cols-2 md:grid-cols-3` with uniform `gap-4 lg:gap-6`. The fifth card remains the same size rather than spanning columns.

- [ ] **Step 2: Localize card titles and keep overlay alignment identical**

Import `categoryLabel` and render `categoryLabel(category.name, locale)` while retaining the canonical English value in the catalogue URL.

- [ ] **Step 3: Correct the home trust copy**

Replace `Cash or WhatsApp` with `WhatsApp confirmation`. Keep `t('trustPayment')` as the localized heading and use the localized body `Confirmation WhatsApp` when the locale is French. Do not introduce cash-on-delivery language.

- [ ] **Step 4: Run build verification for the home grid**

Run `npm.cmd run build` in `apps/web`. Expected: exit code 0 with Vite output.

---

### Task 3: Premium catalogue toolbar and aligned product results

**Files:**
- Modify: `apps/web/src/pages/CataloguePage.tsx`
- Modify: `apps/web/src/index.css`

**Interfaces:**
- Consumes: `catalogUi(locale)`, `categoryLabel`, existing filter state, and `filterProducts`.
- Produces: a two-tier premium filter panel with category chips and native accessible utility controls.

- [ ] **Step 1: Replace the raw four-column control row**

Create one `luxe-surface` panel with:

```tsx
<div className="catalog-toolbar">
  <div className="catalog-search-row">
    <label className="catalog-search">
      <Search aria-hidden="true" size={17} />
      <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={ui.search} />
    </label>
    <p className="catalog-count">{results.length} {ui.results}</p>
  </div>
  <div className="catalog-filter-row">
    <div className="catalog-chips" aria-label={t('categories')}>
      {['', ...categories.map((item) => item.name)].map((value) => <button key={value || 'all'} type="button" onClick={() => setCategory(value)} className={`catalog-chip ${category === value ? 'catalog-chip-active' : ''}`}>{categoryLabel(value || 'All', locale)}</button>)}
    </div>
    <div className="catalog-utilities">
      <label className="catalog-availability"><input type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} /><span aria-hidden="true" className="catalog-switch" />{ui.availability}</label>
      <label className="catalog-sort"><span>{ui.sortLabel}</span><select value={sort} onChange={(event) => setSort(event.target.value as CatalogFilters['sort'])}>{Object.entries(ui.sort).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    </div>
  </div>
</div>
```

Render category buttons from `['', ...categories.map(item => item.name)]`. Selected buttons receive `bg-burgundy text-white border-burgundy`; unselected buttons receive `border-line bg-white text-ink/65 hover:border-accent`.

- [ ] **Step 2: Style availability as a compact premium switch**

Keep a native checkbox for keyboard and screen-reader behavior. Use a visible track and thumb tied to `inStockOnly`, with the localized `ui.availability` label beside it. Do not render a large boxed checkbox row.

- [ ] **Step 3: Style and localize the native sort control**

Render a small uppercase `ui.sortLabel` above or beside the select and use `Object.entries(ui.sort)` for options. Keep the native `<select>` and its accessible label.

- [ ] **Step 4: Add reusable toolbar CSS**

Add focused classes to `index.css` for `.catalog-toolbar`, `.catalog-search-row`, `.catalog-filter-row`, `.catalog-chips`, `.catalog-chip`, and `.catalog-utilities`. Use `#FFF9F0`, `#681F32`, `#B8893D`, and `#E9DDD2`; add a mobile media rule at `max-width: 767px` that stacks rows without overflow.

- [ ] **Step 5: Align the result header and product grid**

Remove the redundant `SlidersHorizontal` label. Keep the grid at `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`, with consistent `gap-x-4 gap-y-12 lg:gap-x-6 lg:gap-y-16`. Use `ui.emptyTitle` and `ui.emptyBody` for the empty state.

- [ ] **Step 6: Run build and lint**

Run in `apps/web`:

```powershell
npm.cmd run build
npm.cmd run lint
```

Expected: both commands exit 0; ESLint reports no warnings.

---

### Task 4: Header balance, regression audit, and responsive verification

**Files:**
- Modify: `apps/web/src/components/layout/Header.tsx`
- Modify: `apps/web/src/components/product/ProductCard.tsx` only if image/text alignment differs between cards
- Test: all `apps/web/src/**/*.node.test.ts`

**Interfaces:**
- Consumes: existing header links, logo, locale control, search link, and cart state.
- Produces: a compact aligned desktop header and unchanged functional mobile navigation.

- [ ] **Step 1: Tighten desktop header geometry**

Use a 76px desktop header, a bounded navigation gap (`gap-6 lg:gap-8`), and keep the action group from shrinking. Preserve the black announcement bar and all existing routes.

- [ ] **Step 2: Check card alignment**

Confirm `ProductCard` uses one image aspect ratio and a consistent content stack. If not, set the image wrapper to `aspect-[4/5]` and reserve stable spacing for metadata, title, and price without adding a heavy outer card border.

- [ ] **Step 3: Run the complete dependency-free test suite**

Run:

```powershell
& 'C:\Users\imadm\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test --experimental-strip-types (Get-ChildItem apps/web/src -Recurse -Filter *.node.test.ts | ForEach-Object FullName)
```

Expected: all tests pass, 0 failures.

- [ ] **Step 4: Run final production gates**

Run `npm.cmd run lint` and `npm.cmd run build` in `apps/web`. Expected: both exit code 0.

- [ ] **Step 5: Perform visual smoke checks**

Start Vite on an unused port and inspect `/` and `/catalogue` at desktop width and 320px mobile width. Verify equal category cards, no filter overflow, readable overlays, correct French labels, and no cash-on-delivery copy. If the in-app browser cannot attach, report that limitation explicitly and do not claim visual verification.
