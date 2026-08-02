# Catalogue Filter Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the boxed catalogue controls with the approved compact editorial ribbon and an accessible custom sort menu.

**Architecture:** Keep product filtering state in `CataloguePage` and extract only the interactive sort popover into a focused `CatalogSortMenu` component. Preserve the existing catalog filtering and localization data, then replace the visual treatment through the catalogue-specific CSS classes in `index.css`.

**Tech Stack:** React 19, TypeScript 5.9, Vite 7, Tailwind CSS 3, Vitest, Testing Library

## Global Constraints

- Preserve search, category, availability, sorting, result count, French, and English behavior.
- Use white, ivory, deep burgundy, and antique gold.
- Do not add a new dependency.
- Do not use a native `select`.
- Do not reintroduce the French label “Sélection.”
- The page must not overflow horizontally at 320 px.
- Commit steps are omitted because `C:\Imad Makhlas\projects\codavenue` is not a Git repository.

---

### Task 1: Accessible Sort Menu

**Files:**
- Create: `apps/web/src/features/catalog/CatalogSortMenu.tsx`
- Create: `apps/web/src/features/catalog/CatalogSortMenu.test.tsx`

**Interfaces:**
- Consumes: `CatalogFilters['sort']` from `apps/web/src/features/catalog/catalog.ts`.
- Produces: `CatalogSortMenu({ label, value, options, onChange })`.

- [ ] **Step 1: Write the failing component test**

```tsx
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CatalogSortMenu } from './CatalogSortMenu'

const options = [
  ['featured', 'Nos favoris'],
  ['newest', 'Nouveautés'],
] as const

describe('CatalogSortMenu', () => {
  it('opens, selects an option, and closes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<CatalogSortMenu label="Classer par" value="featured" options={options} onChange={onChange} />)

    const trigger = screen.getByRole('button', { name: /classer par/i })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    await user.click(screen.getByRole('option', { name: 'Nouveautés' }))
    expect(onChange).toHaveBeenCalledWith('newest')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes when Escape is pressed', async () => {
    const user = userEvent.setup()
    render(<CatalogSortMenu label="Classer par" value="featured" options={options} onChange={() => undefined} />)

    const trigger = screen.getByRole('button', { name: /classer par/i })
    await user.click(trigger)
    await user.keyboard('{Escape}')

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveFocus()
  })
})
```

- [ ] **Step 2: Run the focused test and confirm the red state**

Run:

```powershell
npm run test -- CatalogSortMenu.test.tsx
```

Expected: FAIL because `CatalogSortMenu.tsx` does not exist.

- [ ] **Step 3: Implement the component**

```tsx
import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import type { CatalogFilters } from './catalog'

type SortValue = CatalogFilters['sort']

type CatalogSortMenuProps = {
  label: string
  value: SortValue
  options: ReadonlyArray<readonly [SortValue, string]>
  onChange: (value: SortValue) => void
}

export function CatalogSortMenu({ label, value, options, onChange }: CatalogSortMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listboxId = useId()
  const activeLabel = options.find(([optionValue]) => optionValue === value)?.[1] ?? options[0]?.[1] ?? ''

  useEffect(() => {
    function closeFromOutside(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }

    function closeFromEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      setOpen(false)
      triggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', closeFromOutside)
    document.addEventListener('keydown', closeFromEscape)
    return () => {
      document.removeEventListener('pointerdown', closeFromOutside)
      document.removeEventListener('keydown', closeFromEscape)
    }
  }, [])

  return (
    <div className="catalog-sort" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="catalog-sort-trigger"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="catalog-sort-copy"><small>{label}</small><strong>{activeLabel}</strong></span>
        <ChevronDown aria-hidden="true" size={15} />
      </button>
      {open && (
        <div id={listboxId} className="catalog-sort-menu" role="listbox" aria-label={label}>
          {options.map(([optionValue, optionLabel]) => (
            <button
              key={optionValue}
              type="button"
              role="option"
              aria-selected={optionValue === value}
              className="catalog-sort-menu-option"
              onClick={() => {
                onChange(optionValue)
                setOpen(false)
              }}
            >
              <span>{optionLabel}</span>
              {optionValue === value && <Check aria-hidden="true" size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run the focused test**

Run:

```powershell
npm run test -- CatalogSortMenu.test.tsx
```

Expected: 2 tests pass.

---

### Task 2: Editorial Catalogue Toolbar

**Files:**
- Modify: `apps/web/src/pages/CataloguePage.tsx`
- Modify: `apps/web/src/index.css`

**Interfaces:**
- Consumes: `CatalogSortMenu` from Task 1 and existing `catalogUi(locale)` labels.
- Produces: the approved responsive “Ruban éditorial” toolbar without changing filter state ownership.

- [ ] **Step 1: Add accessibility assertions to the component test**

Add to `CatalogSortMenu.test.tsx`:

```tsx
it('marks the current choice as selected', async () => {
  const user = userEvent.setup()
  render(<CatalogSortMenu label="Classer par" value="featured" options={options} onChange={() => undefined} />)

  await user.click(screen.getByRole('button', { name: /classer par/i }))

  expect(screen.getByRole('option', { name: 'Nos favoris' })).toHaveAttribute('aria-selected', 'true')
  expect(screen.getByRole('option', { name: 'Nouveautés' })).toHaveAttribute('aria-selected', 'false')
})
```

- [ ] **Step 2: Run the focused test**

Run:

```powershell
npm run test -- CatalogSortMenu.test.tsx
```

Expected: all 3 tests pass, proving the component contract before page integration.

- [ ] **Step 3: Replace the boxed toolbar markup**

In `CataloguePage.tsx`:

- Import `CatalogSortMenu`.
- Remove the `catalog-sort-panel` and six visible sort buttons.
- Keep `sortEntries` and pass it to `CatalogSortMenu`.
- Add `aria-pressed={category === value}` to category buttons.
- Use this structure:

```tsx
<section className="catalog-toolbar" aria-label={t('filters')}>
  <div className="catalog-toolbar-head">
    <div>
      <p>{locale === 'fr' ? 'La collection' : 'The collection'}</p>
      <span>{locale === 'fr' ? "Bijoux artisanaux inspirés d'un souffle oriental" : 'Artisan jewelry inspired by an oriental breath'}</span>
    </div>
    <p className="catalog-count"><strong>{results.length}</strong><span>{ui.results}</span></p>
  </div>
  <label className="catalog-search">
    <Search aria-hidden="true" size={18} />
    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={ui.search} />
  </label>
  <div className="catalog-filter-row">
    <div className="catalog-chips" aria-label={t('categories')}>
      {categoryValues.map((value) => (
        <button
          key={value || 'all'}
          type="button"
          aria-pressed={category === value}
          onClick={() => setCategory(value)}
          className={`catalog-chip ${category === value ? 'catalog-chip-active' : ''}`}
        >
          {categoryLabel((value || 'All') as CatalogCategory, locale)}
        </button>
      ))}
    </div>
    <div className="catalog-utilities">
      <label className="catalog-availability">
        <input className="sr-only" type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} />
        <span aria-hidden="true" className={`catalog-switch ${inStockOnly ? 'catalog-switch-active' : ''}`}><span /></span>
        <span>{ui.availability}</span>
      </label>
      <CatalogSortMenu label={ui.sortLabel} value={sort} options={sortEntries} onChange={setSort} />
    </div>
  </div>
</section>
```

- [ ] **Step 4: Apply the editorial styling**

Replace the current catalogue toolbar rules in `index.css` with:

```css
.catalog-toolbar { padding: .25rem 0 0; }
.catalog-toolbar-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; margin-bottom: 1.5rem; }
.catalog-toolbar-head > div > p { color: #B8893D; font-size: .62rem; font-weight: 800; letter-spacing: .22em; text-transform: uppercase; }
.catalog-toolbar-head > div > span { display: block; margin-top: .55rem; color: #75676A; font-family: Georgia, serif; font-size: 1rem; }
.catalog-count { display: flex; align-items: baseline; gap: .45rem; color: #75676A; font-size: .58rem; letter-spacing: .16em; text-transform: uppercase; }
.catalog-count strong { color: #681F32; font-family: Georgia, serif; font-size: 1.35rem; font-weight: 500; }
.catalog-search { display: flex; min-height: 54px; align-items: center; gap: .9rem; border-bottom: 1px solid #DCCFC4; color: #75676A; }
.catalog-search input { min-width: 0; flex: 1; border: 0; background: transparent; color: #2C2023; font-size: .92rem; outline: none; }
.catalog-search:focus-within { border-color: #B8893D; }
.catalog-filter-row { display: flex; align-items: stretch; justify-content: space-between; gap: 2rem; margin-top: 1rem; border-block: 1px solid #E9DDD2; }
.catalog-chips { display: flex; min-width: 0; align-items: stretch; gap: 1.75rem; overflow-x: auto; scrollbar-width: none; }
.catalog-chips::-webkit-scrollbar { display: none; }
.catalog-chip { position: relative; flex: 0 0 auto; border: 0; background: transparent; padding: 1.05rem 0 .95rem; color: #75676A; font-size: .56rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
.catalog-chip::after { position: absolute; right: 0; bottom: -1px; left: 0; height: 2px; background: transparent; content: ''; }
.catalog-chip:hover { color: #681F32; }
.catalog-chip-active { color: #681F32; }
.catalog-chip-active::after { background: #681F32; }
.catalog-utilities { display: flex; flex: 0 0 auto; align-items: stretch; }
.catalog-availability { display: flex; cursor: pointer; align-items: center; gap: .65rem; white-space: nowrap; padding: 0 1rem; color: #2C2023; font-size: .56rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
.catalog-switch { position: relative; width: 34px; height: 18px; border-radius: 999px; background: #E6DDD4; transition: background .2s ease; }
.catalog-switch span { position: absolute; left: 3px; top: 3px; width: 12px; height: 12px; border-radius: 50%; background: #fff; box-shadow: 0 1px 4px rgba(44,32,35,.2); transition: transform .2s ease; }
.catalog-switch-active { background: #681F32; }
.catalog-switch-active span { transform: translateX(16px); }
.catalog-sort { position: relative; border-left: 1px solid #E9DDD2; }
.catalog-sort-trigger { display: flex; min-width: 164px; height: 100%; align-items: center; justify-content: space-between; gap: 1rem; border: 0; background: transparent; padding: .65rem 0 .65rem 1.1rem; color: #681F32; text-align: left; }
.catalog-sort-copy { display: grid; gap: .24rem; }
.catalog-sort-copy small { color: #75676A; font-size: .48rem; font-weight: 800; letter-spacing: .13em; text-transform: uppercase; }
.catalog-sort-copy strong { font-size: .58rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
.catalog-sort-menu { position: absolute; z-index: 30; top: calc(100% + .6rem); right: 0; min-width: 210px; border: 1px solid #E9DDD2; background: #fff; padding: .4rem; box-shadow: 0 20px 50px rgba(64,16,31,.12); }
.catalog-sort-menu-option { display: flex; width: 100%; min-height: 40px; align-items: center; justify-content: space-between; border: 0; background: transparent; padding: 0 .75rem; color: #4B3C3F; font-size: .58rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.catalog-sort-menu-option:hover, .catalog-sort-menu-option[aria-selected='true'] { background: #FFF9F0; color: #681F32; }
```

Add a mobile override:

```css
@media (max-width: 767px) {
  .catalog-toolbar-head { align-items: flex-start; margin-bottom: 1rem; }
  .catalog-toolbar-head > div > span { max-width: 200px; font-size: .88rem; line-height: 1.45; }
  .catalog-search { min-height: 50px; }
  .catalog-filter-row { display: block; margin-top: .8rem; }
  .catalog-chips { gap: 1.2rem; }
  .catalog-chip { padding-block: .9rem; }
  .catalog-utilities { min-height: 56px; width: 100%; justify-content: space-between; border-top: 1px solid #E9DDD2; }
  .catalog-availability { padding-left: 0; }
  .catalog-sort-trigger { min-width: 145px; }
  .catalog-sort-menu { right: 0; }
}
```

- [ ] **Step 5: Run component tests, lint, and build**

Run:

```powershell
npm run test
npm run lint
npm run build
```

Expected: all tests pass, ESLint exits with zero warnings, and Vite produces `dist`.

---

### Task 3: Browser Verification

**Files:**
- Verify: `apps/web/src/pages/CataloguePage.tsx`
- Verify: `apps/web/src/index.css`

**Interfaces:**
- Consumes: the completed toolbar and running Vite development server.
- Produces: evidence that the approved design works in both locales and responsive sizes.

- [ ] **Step 1: Verify desktop French at 1280 × 820**

Open `/catalogue`, switch to French, and confirm:

```text
The toolbar has no surrounding card border.
Only one sort value, “Nos favoris,” is visible before opening the menu.
Clicking the trigger exposes all six sorting choices.
Choosing “Nouveautés” updates the trigger and closes the menu.
No “Sélection” text is present.
No native select element is present.
```

- [ ] **Step 2: Verify desktop English**

Switch to English and confirm the active sort label and all menu options are localized.

- [ ] **Step 3: Verify 320 × 740 mobile**

Confirm:

```text
Category tabs scroll horizontally inside their own strip.
The availability and sort controls share one compact row.
The sort menu remains inside the viewport.
document.documentElement.scrollWidth <= window.innerWidth
```

- [ ] **Step 4: Run final verification**

Run:

```powershell
npm run test
npm run lint
npm run build
```

Expected: all tests, lint, and build succeed after browser-driven adjustments.

