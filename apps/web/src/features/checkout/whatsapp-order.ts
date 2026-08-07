export type WhatsAppOrder = {
  orderNumber: string
  customerName: string
  telephone: string
  city: string
  address: string
  notes?: string
  total: number
  items: Array<{ name: string; variantName: string; quantity: number; lineTotal: number }>
}

export type WhatsAppLocale = 'en' | 'fr'

const whatsappCopy = {
  fr: {
    intro: "Bonjour Perle d'Orient, je souhaite confirmer cette commande :",
    reference: 'Référence', total: 'Total', name: 'Nom', phone: 'Téléphone', delivery: 'Livraison', note: 'Note',
    closing: 'Merci de confirmer la disponibilité et les modalités de livraison.',
  },
  en: {
    intro: "Hello Perle d'Orient, I would like to confirm this order:",
    reference: 'Reference', total: 'Total', name: 'Name', phone: 'Phone', delivery: 'Delivery', note: 'Note',
    closing: 'Please confirm availability and delivery details.',
  },
} satisfies Record<WhatsAppLocale, Record<string, string>>

export function buildWhatsAppMessage(order: WhatsAppOrder, locale: WhatsAppLocale) {
  const copy = whatsappCopy[locale]
  const separator = locale === 'fr' ? ' :' : ':'
  const lines = order.items.map((item) => `${item.name} — ${item.variantName} × ${item.quantity} — ${item.lineTotal} MAD`)
  const customerDetails = [
    `${copy.total}${separator} ${order.total} MAD`,
    `${copy.name}${separator} ${order.customerName}`,
    `${copy.phone}${separator} ${order.telephone}`,
    `${copy.delivery}${separator} ${order.city}, ${order.address}`,
    ...(order.notes ? [`${copy.note}${separator} ${order.notes}`] : []),
  ]

  return [
    copy.intro,
    `${copy.reference}${separator} ${order.orderNumber}`,
    '',
    ...lines,
    '',
    ...customerDetails,
    '',
    copy.closing,
  ].join('\n')
}

export function buildWhatsAppUrl(phone: string, message: string) {
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
}
