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
        <span className="catalog-sort-copy">
          <small>{label}</small>
          <strong>{activeLabel}</strong>
        </span>
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
