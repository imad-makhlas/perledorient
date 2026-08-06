import type { CartItem } from '../cart/cart'
import type { CheckoutForm } from './checkout-schema'
import { buildWhatsAppMessage, buildWhatsAppUrl } from './whatsapp-order'
import { WHATSAPP_NUMBER } from '../../config/contact'

export type CreatedOrder = { orderNumber: string; total: number; deliveryFee: number; whatsappUrl?: string }

class OrderApiError extends Error {}

export async function createOrder(customer: CheckoutForm, items: CartItem[]): Promise<CreatedOrder> {
  const payload = { customer, items: items.map((item) => ({ variantId: item.variantId, quantity: item.quantity })), idempotencyKey: crypto.randomUUID() }
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
    const deliveryFee = subtotal >= 500 ? 0 : customer.city.toLowerCase() === 'casablanca' ? 30 : 45
    const orderNumber = `PDO-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${Math.floor(100000 + Math.random() * 900000)}`
    const preparedMessage = buildWhatsAppMessage({
      orderNumber,
      customerName: `${customer.firstName} ${customer.lastName}`,
      telephone: customer.telephone,
      city: customer.city,
      address: customer.address,
      notes: customer.deliveryNotes,
      total: subtotal + deliveryFee,
      items: items.map((item) => ({ name: item.name, variantName: item.variantName, quantity: item.quantity, lineTotal: item.unitPrice * item.quantity })),
    })
    return { orderNumber, total: subtotal + deliveryFee, deliveryFee, whatsappUrl: buildWhatsAppUrl(WHATSAPP_NUMBER, preparedMessage) }
  }
}
