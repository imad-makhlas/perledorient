export const formatMoney = (amount: number, locale = 'fr') =>
  new Intl.NumberFormat(locale === 'ar' ? 'ar-MA' : 'fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(amount)
