import type { CheckoutForm } from './checkout-schema'

export type OrderCatalogRow = {
  id: string
  product_id: string
  slug: string
  product_name: string
  variant_name: string
  sku: string
  price: number
  stock: number
  active: number
  image_url: string
}

export type PreparedOrderItem = {
  productId: string
  variantId: string
  productName: string
  variantName: string
  sku: string
  quantity: number
  unitPrice: number
  lineTotal: number
  imageUrl: string
}

export function generateOrderNumber(existingOrderNumbers: string[], date = new Date()) {
  const year = date.getUTCFullYear()
  const prefix = `PDO-${year}-`
  const nextSequence = existingOrderNumbers.reduce((highest, orderNumber) => {
    if (!orderNumber.startsWith(prefix)) return highest
    const sequence = Number(orderNumber.slice(prefix.length))
    return Number.isInteger(sequence) && sequence > highest ? sequence : highest
  }, 0) + 1

  return `${prefix}${String(nextSequence).padStart(4, '0')}`
}

export function prepareOrder(customer: CheckoutForm, requestedItems: Array<{ variantId: string; quantity: number }>, catalogue: OrderCatalogRow[], orderNumber: string) {
  if (!requestedItems.length) throw new Error('The order is empty')
  const items = requestedItems.map((requested): PreparedOrderItem => {
    const product = catalogue.find((row) => row.id === requested.variantId && row.active === 1)
    if (!product) throw new Error('A selected piece is unavailable')
    if (!Number.isInteger(requested.quantity) || requested.quantity < 1 || requested.quantity > product.stock) throw new Error('The requested quantity exceeds stock')
    return {
      productId: product.product_id,
      variantId: product.id,
      productName: product.product_name,
      variantName: product.variant_name,
      sku: product.sku,
      quantity: requested.quantity,
      unitPrice: product.price,
      lineTotal: product.price * requested.quantity,
      imageUrl: product.image_url,
    }
  })
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0)
  const deliveryFee = subtotal >= 500 ? 0 : customer.city.trim().toLowerCase() === 'casablanca' ? 30 : 45
  return {
    orderNumber,
    customerName: `${customer.firstName.trim()} ${customer.lastName.trim()}`,
    customerTelephone: customer.telephone.trim(),
    city: customer.city.trim(),
    address: customer.address.trim(),
    notes: customer.deliveryNotes?.trim() || '',
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    paymentMethod: 'WHATSAPP' as const,
    status: 'PENDING_CONFIRMATION' as const,
    items,
  }
}
