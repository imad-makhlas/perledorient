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

export function buildWhatsAppMessage(order: WhatsAppOrder) {
  const lines = order.items.map((item) => `${item.name} - ${item.variantName} x ${item.quantity} - ${item.lineTotal} MAD`)
  return [
    "Hello Perle d'Orient, I would like to confirm this selection:",
    `Order: ${order.orderNumber}`,
    '',
    ...lines,
    '',
    `Total: ${order.total} MAD`,
    `Customer: ${order.customerName}`,
    `Phone: ${order.telephone}`,
    `Delivery: ${order.city}, ${order.address}`,
    order.notes ? `Note: ${order.notes}` : '',
    '',
    'Please confirm availability and delivery details.',
  ].filter(Boolean).join('\n')
}

export function buildWhatsAppUrl(phone: string, message: string) {
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
}
