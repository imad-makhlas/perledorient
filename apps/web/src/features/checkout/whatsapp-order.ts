export type WhatsAppOrder = {
  orderNumber: string
  customerName: string
  telephone: string
  city: string
  address: string
  notes?: string
  subtotal?: number
  deliveryFee?: number
  deliveryRequiresQuote?: boolean
  total: number
  items: Array<{ name: string; variantName: string; quantity: number; lineTotal: number }>
}

export type WhatsAppLocale = 'fr' | 'ar'

const whatsappCopy = {
  fr: {
    intro: "Bonjour Perle d'Orient, je souhaite confirmer cette commande :",
    reference: 'Référence', subtotal: 'Sous-total', deliveryFee: 'Frais de livraison', quote: 'à confirmer sur WhatsApp', total: 'Total', name: 'Nom', phone: 'Téléphone', delivery: 'Livraison', note: 'Note',
    closing: 'Merci de confirmer la disponibilité et les modalités de livraison.',
  },
  ar: {
    intro: 'مرحباً لؤلؤة الشرق، أود تأكيد هذا الطلب:',
    reference: 'المرجع', subtotal: 'المجموع الفرعي', deliveryFee: 'رسوم التوصيل', quote: 'يتم تأكيدها عبر واتساب', total: 'المجموع', name: 'الاسم', phone: 'الهاتف', delivery: 'التوصيل', note: 'ملاحظة',
    closing: 'يرجى تأكيد التوفر وتفاصيل التوصيل.',
  },
} satisfies Record<WhatsAppLocale, Record<string, string>>

export function buildWhatsAppMessage(order: WhatsAppOrder, locale: WhatsAppLocale) {
  const copy = whatsappCopy[locale]
  const separator = locale === 'fr' ? ' :' : ':'
  const addressSeparator = locale === 'ar' ? '،' : ','
  const lines = order.items.map((item) => `${item.name} — ${item.variantName} × ${item.quantity} — ${item.lineTotal} MAD`)
  const customerDetails = [
    ...(order.subtotal === undefined ? [] : [`${copy.subtotal}${separator} ${order.subtotal} MAD`]),
    ...(order.deliveryFee === undefined ? [] : [`${copy.deliveryFee}${separator} ${order.deliveryRequiresQuote ? copy.quote : `${order.deliveryFee} MAD`}`]),
    `${copy.total}${separator} ${order.total} MAD`,
    `${copy.name}${separator} ${order.customerName}`,
    `${copy.phone}${separator} ${order.telephone}`,
    `${copy.delivery}${separator} ${order.city}${addressSeparator} ${order.address}`,
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
