export const formatMoney = (amount: number, locale = 'en') =>
  new Intl.NumberFormat(locale === 'fr' ? 'fr-MA' : 'en-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(amount)
