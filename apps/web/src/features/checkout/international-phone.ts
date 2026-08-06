import { getCountryCallingCode, type Country } from 'react-phone-number-input'

export function toInternationalPhone(country: Country, value: string) {
  const trimmed = value.trim()
  if (trimmed.startsWith('+')) return `+${trimmed.replace(/\D/g, '')}`

  const nationalNumber = trimmed.replace(/\D/g, '').replace(/^0+/, '')
  return `+${getCountryCallingCode(country)}${nationalNumber}`
}
