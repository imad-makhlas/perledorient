import { Check, ChevronDown, MapPin, Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { DeliveryCountry } from '../../features/checkout/delivery-pricing'

type DeliveryCityFieldProps = {
  value: string
  country: DeliveryCountry
  locale: 'fr' | 'ar'
  label: string
  cities: string[]
  error?: string
  onChange: (value: string) => void
}

function normalizeSearch(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr')
}

export function DeliveryCityField({ value, country, locale, label, cities, error, onChange }: DeliveryCityFieldProps) {
  const [open, setOpen] = useState(false)
  const [customEntry, setCustomEntry] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const suggestionsEnabled = country === 'MA' && !customEntry
  const exactCitySelected = cities.some((city) => normalizeSearch(city) === normalizeSearch(value))
  const searchTerm = exactCitySelected ? '' : normalizeSearch(value.trim())
  const filteredCities = useMemo(
    () => searchTerm ? cities.filter((city) => normalizeSearch(city).includes(searchTerm)) : cities,
    [cities, searchTerm],
  )
  const listLabel = locale === 'fr' ? 'Villes disponibles' : 'المدن المتاحة'

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [])

  const selectCity = (city: string) => {
    onChange(city)
    setOpen(false)
  }

  const enableCustomEntry = () => {
    setCustomEntry(true)
    setOpen(false)
    onChange('')
  }

  const returnToSuggestions = () => {
    setCustomEntry(false)
    onChange('')
    setOpen(true)
  }

  return <div ref={rootRef} className="relative block text-[10px] font-bold uppercase tracking-[.14em] text-[#51474B]">
    <div className="flex items-center justify-between gap-4">
      <label htmlFor="checkout-city">{label}</label>
      {customEntry && country === 'MA' && <button type="button" className="normal-case tracking-normal text-[#A87525] transition hover:text-[#7C551C]" onClick={returnToSuggestions}>
        {locale === 'fr' ? 'Choisir dans la liste' : 'الاختيار من القائمة'}
      </button>}
    </div>
    <div className={`mt-2 flex h-14 items-center rounded-[6px] border bg-white transition ${open ? 'border-[#C4943D] ring-2 ring-[#C4943D]/10' : 'border-[#D9CEC1]'} ${error ? 'border-red-400' : ''}`}>
      <MapPin aria-hidden="true" className="ms-4 shrink-0 text-[#B07B2B]" size={18} strokeWidth={1.6} />
      <input
        id="checkout-city"
        className="h-full min-w-0 flex-1 bg-transparent px-3 text-base font-normal normal-case tracking-normal outline-none placeholder:text-[#A69B9E]"
        type="text"
        autoComplete="address-level2"
        role="combobox"
        aria-autocomplete="list"
        aria-controls="moroccan-delivery-cities"
        aria-expanded={suggestionsEnabled && open}
        value={value}
        onFocus={() => suggestionsEnabled && setOpen(true)}
        onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false) }}
        onChange={(event) => {
          onChange(event.target.value)
          if (suggestionsEnabled) setOpen(true)
        }}
        aria-invalid={Boolean(error)}
        placeholder={country === 'MA' ? (locale === 'fr' ? 'Rechercher une ville' : 'ابحثي عن مدينة') : (locale === 'fr' ? 'Ville de destination' : 'مدينة الوجهة')}
      />
      {suggestionsEnabled && <button type="button" aria-label={locale === 'fr' ? 'Afficher les villes' : 'عرض المدن'} className="me-2 grid h-10 w-10 shrink-0 place-items-center rounded-[6px] text-[#746A6D] transition hover:bg-[#F7F1E8] hover:text-[#A87525]" onClick={() => setOpen((current) => !current)}>
        <ChevronDown aria-hidden="true" className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} size={18} />
      </button>}
    </div>

    {suggestionsEnabled && open && <div className="absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-[6px] border border-[#DDD1C3] bg-white shadow-[0_22px_55px_rgba(48,42,46,.16)]">
      <div className="flex items-center gap-2 border-b border-[#EEE6DC] bg-[#FCFAF7] px-4 py-3 text-[#8A7E80]">
        <Search aria-hidden="true" size={15} />
        <span className="text-[10px] font-bold uppercase tracking-[.14em]">{locale === 'fr' ? `${filteredCities.length} villes disponibles` : `${filteredCities.length} مدينة متاحة`}</span>
      </div>
      <div id="moroccan-delivery-cities" role="listbox" aria-label={listLabel} className="max-h-60 overflow-y-auto overscroll-contain p-2">
        {filteredCities.length ? filteredCities.map((city) => {
          const selected = normalizeSearch(city) === normalizeSearch(value)
          return <button key={city} type="button" role="option" aria-selected={selected} className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-[6px] px-3 text-start text-sm font-medium normal-case tracking-normal transition ${selected ? 'bg-[#F5E9D7] text-[#754E17]' : 'text-[#393135] hover:bg-[#FAF6F0]'}`} onClick={() => selectCity(city)}>
            <span>{city}</span>
            {selected && <Check aria-hidden="true" className="shrink-0 text-[#B07B2B]" size={16} strokeWidth={2} />}
          </button>
        }) : <p className="px-3 py-5 text-center text-xs font-normal normal-case tracking-normal text-[#857A7D]">{locale === 'fr' ? 'Aucune ville trouvée.' : 'لم يتم العثور على مدينة.'}</p>}
      </div>
      <div className="border-t border-[#EEE6DC] bg-[#FCFAF7] p-2">
        <button type="button" role="option" aria-label={locale === 'fr' ? 'Autre ville' : 'مدينة أخرى'} aria-selected="false" className="flex min-h-11 w-full items-center gap-3 rounded-[6px] px-3 text-start text-sm font-semibold normal-case tracking-normal text-[#8A5C1D] transition hover:bg-[#F5E9D7]" onClick={enableCustomEntry}>
          <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#D9B97A] text-base font-normal">+</span>
          {locale === 'fr' ? 'Autre ville' : 'مدينة أخرى'}
        </button>
      </div>
    </div>}

    <span className="mt-1.5 block text-[11px] font-normal normal-case tracking-normal text-[#857A7D]">
      {customEntry
        ? (locale === 'fr' ? 'Saisissez librement votre ville.' : 'أدخلي اسم مدينتك بحرية.')
        : country === 'MA'
          ? (locale === 'fr' ? 'Recherchez ou choisissez votre ville.' : 'ابحثي عن مدينتك أو اختاريها.')
          : (locale === 'fr' ? 'Saisissez la ville de destination.' : 'أدخلي مدينة الوجهة.')}
    </span>
    {error && <span className="mt-1.5 block text-[11px] font-normal normal-case tracking-normal text-red-700">{error}</span>}
  </div>
}
