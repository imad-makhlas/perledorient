import { getCountries, getCountryCallingCode, type Country } from 'react-phone-number-input'
import labelsEn from 'react-phone-number-input/locale/en.json'
import labelsFr from 'react-phone-number-input/locale/fr.json'

type InternationalPhoneFieldProps = {
  country: Country
  value: string
  locale: 'en' | 'fr'
  label: string
  error?: string
  onCountryChange: (country: Country) => void
  onChange: (value: string) => void
}

export function InternationalPhoneField({ country, value, locale, label, error, onCountryChange, onChange }: InternationalPhoneFieldProps) {
  const labels = locale === 'fr' ? labelsFr : labelsEn

  return <div className="text-[10px] font-bold uppercase tracking-widest">
    <label htmlFor="checkout-telephone">{label}</label>
    <div className="mt-2 grid grid-cols-[minmax(132px,42%)_1fr] overflow-hidden rounded-xl border border-line bg-white focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10">
      <select aria-label="Country code" value={country} onChange={(event) => onCountryChange(event.target.value as Country)} className="min-w-0 border-0 border-r border-line bg-[#F8F5F0] px-3 py-3 text-sm font-semibold normal-case tracking-normal outline-none">
        {getCountries().map((code) => <option key={code} value={code}>{labels[code]} (+{getCountryCallingCode(code)})</option>)}
      </select>
      <input id="checkout-telephone" className="min-w-0 border-0 px-3 py-3 text-sm font-normal normal-case tracking-normal outline-none" type="tel" inputMode="tel" autoComplete="tel-national" value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} placeholder={country === 'MA' ? '06 31 21 06 54' : undefined} />
    </div>
    {error && <span className="mt-1 block text-[10px] normal-case tracking-normal text-red-700">{error}</span>}
  </div>
}
