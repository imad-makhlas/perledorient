import { ChevronDown } from 'lucide-react'
import { getCountries, getCountryCallingCode, type Country } from 'react-phone-number-input'
import labelsAr from 'react-phone-number-input/locale/ar.json'
import labelsFr from 'react-phone-number-input/locale/fr.json'

type InternationalPhoneFieldProps = {
  country: Country
  value: string
  locale: 'fr' | 'ar'
  label: string
  error?: string
  onCountryChange: (country: Country) => void
  onChange: (value: string) => void
}

export function InternationalPhoneField({ country, value, locale, label, error, onCountryChange, onChange }: InternationalPhoneFieldProps) {
  const labels = locale === 'fr' ? labelsFr : labelsAr
  const flag = country.replace(/./g, (character) => String.fromCodePoint(127397 + character.charCodeAt(0)))

  return <div className="min-w-0 text-[10px] font-bold uppercase tracking-widest">
    <label htmlFor="checkout-telephone">{label}</label>
    <div className="mt-2 grid min-w-0 grid-cols-[104px_minmax(0,1fr)] gap-2" dir="ltr">
      <div className="relative h-14 overflow-hidden rounded-[6px] border border-[#D9CEC1] bg-[#F7F2EA] shadow-[inset_0_1px_0_rgba(255,255,255,.7)] transition focus-within:border-[#C4943D] focus-within:ring-2 focus-within:ring-[#C4943D]/10">
        <div aria-hidden="true" className="flex h-full items-center justify-center gap-2 px-3 normal-case tracking-normal text-[#302A2E]"><span className="text-base leading-none">{flag}</span><strong className="text-sm">+{getCountryCallingCode(country)}</strong><ChevronDown size={14} className="shrink-0 text-[#8A7E82]" /></div>
        <select aria-label="Country code" value={country} onChange={(event) => onCountryChange(event.target.value as Country)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0">
          {getCountries().map((code) => <option key={code} value={code}>{labels[code]} (+{getCountryCallingCode(code)})</option>)}
        </select>
      </div>
      <input id="checkout-telephone" className="h-14 w-full min-w-0 max-w-full rounded-[6px] border border-[#D9CEC1] bg-white px-4 text-base font-normal normal-case tracking-normal outline-none transition placeholder:text-[#A69B9E] focus:border-[#C4943D] focus:ring-2 focus:ring-[#C4943D]/10" type="tel" inputMode="tel" autoComplete="tel-national" value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} placeholder={country === 'MA' ? '06 31 21 06 54' : undefined} />
    </div>
    {error && <span className="mt-1 block text-[10px] normal-case tracking-normal text-red-700">{error}</span>}
  </div>
}
