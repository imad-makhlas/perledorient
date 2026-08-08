import type { CartItem } from '../cart/cart'
import type { CheckoutForm } from './checkout-schema'
import { generateOrderNumber } from './order-record'
import { buildWhatsAppMessage, buildWhatsAppUrl } from './whatsapp-order'
import type { WhatsAppLocale } from './whatsapp-order'
import { WHATSAPP_NUMBER } from '../../config/contact'
import { calculateDeliveryFee, DEFAULT_DELIVERY_SETTINGS } from './delivery-pricing'

export type CreatedOrder = { orderNumber: string; total: number; deliveryFee: number; deliveryZone?: string; deliveryRequiresQuote?: boolean; whatsappUrl?: string }

class OrderApiError extends Error {}

export async function createOrder(customer: CheckoutForm, items: CartItem[], locale: WhatsAppLocale): Promise<CreatedOrder> {
  const payload = { customer, locale, items: items.map((item) => ({ variantId: item.variantId, quantity: item.quantity })), idempotencyKey: crypto.randomUUID() }
  try {
    const response = await fetch('/api/v1/orders', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': payload.idempotencyKey }, body: JSON.stringify(payload) })
    if (!response.ok) {
      let message = 'Order could not be created'
      try { message = (await response.json() as { error?: string }).error || message } catch { /* Use the fallback message. */ }
      throw new OrderApiError(message)
    }
    return await response.json() as CreatedOrder
  } catch (error) {
    if (!import.meta.env.DEV || error instanceof OrderApiError) throw error
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    const delivery = calculateDeliveryFee(subtotal, customer.city, customer.country || 'MA', DEFAULT_DELIVERY_SETTINGS)
    const deliveryFee = delivery.fee
    const orderNumber = generateOrderNumber([])
    const preparedMessage = buildWhatsAppMessage({
      orderNumber,
      customerName: `${customer.firstName} ${customer.lastName}`,
      telephone: customer.telephone,
      city: customer.city,
      address: customer.address,
      notes: customer.deliveryNotes,
      subtotal,
      deliveryFee,
      deliveryRequiresQuote: delivery.requiresQuote,
      total: subtotal + deliveryFee,
      items: items.map((item) => ({ name: item.name, variantName: item.variantName, quantity: item.quantity, lineTotal: item.unitPrice * item.quantity })),
    }, locale)
    return { orderNumber, total: subtotal + deliveryFee, deliveryFee, deliveryZone: delivery.zone, deliveryRequiresQuote: delivery.requiresQuote, whatsappUrl: buildWhatsAppUrl(WHATSAPP_NUMBER, preparedMessage) }
  }
}
