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

  return <div className="text-[10px] font-bold uppercase tracking-widest">
    <label htmlFor="checkout-telephone">{label}</label>
    <div className="mt-2 grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-[minmax(132px,42%)_minmax(0,1fr)]">
      <select aria-label="Country code" value={country} onChange={(event) => onCountryChange(event.target.value as Country)} className="h-[52px] w-[132px] max-w-full rounded-xl border border-line bg-[#F8F5F0] px-3 text-sm font-semibold normal-case tracking-normal outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 sm:w-full">
        {getCountries().map((code) => <option key={code} value={code}>{labels[code]} (+{getCountryCallingCode(code)})</option>)}
      </select>
      <input id="checkout-telephone" className="h-[52px] w-full min-w-0 max-w-full rounded-xl border border-line bg-white px-4 text-base font-normal normal-case tracking-normal outline-none focus:border-accent focus:ring-2 focus:ring-accent/10" type="tel" inputMode="tel" autoComplete="tel-national" value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} placeholder={country === 'MA' ? '06 31 21 06 54' : undefined} />
    </div>
    {error && <span className="mt-1 block text-[10px] normal-case tracking-normal text-red-700">{error}</span>}
  </div>
}
