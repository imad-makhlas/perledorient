export function isMobileWhatsAppDevice(userAgent: string) {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent)
}

export function toWhatsAppAppUrl(webUrl: string) {
  const url = new URL(webUrl)
  const phone = url.pathname.replace(/^\/+/, '')
  const text = url.searchParams.get('text') || ''
  return `whatsapp://send?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}`
}
