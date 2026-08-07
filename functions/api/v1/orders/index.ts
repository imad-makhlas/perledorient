import { checkoutSchema, type CheckoutForm } from '../../../../apps/web/src/features/checkout/checkout-schema'
import { generateOrderNumber, prepareOrder, type OrderCatalogRow } from '../../../../apps/web/src/features/checkout/order-record'
import { buildWhatsAppMessage, buildWhatsAppUrl } from '../../../../apps/web/src/features/checkout/whatsapp-order'
import { WHATSAPP_NUMBER } from '../../../../apps/web/src/config/contact'
import { json, type PagesContext } from '../admin/_shared'

type RequestBody = { customer?: CheckoutForm; items?: Array<{ variantId: string; quantity: number }>; idempotencyKey?: string; locale?: 'en' | 'fr' }
type ExistingOrder = { order_number: string; total: number; delivery_fee: number; whatsapp_url: string | null }

export async function onRequestPost({ request, env }: PagesContext) {
  try {
    const body = await request.json() as RequestBody
    const locale = body.locale === 'fr' ? 'fr' : 'en'
    const parsedCustomer = checkoutSchema.safeParse(body.customer)
    if (!parsedCustomer.success || !body.idempotencyKey || !Array.isArray(body.items) || !body.items.length) {
      return json({ error: 'Invalid order details' }, { status: 400 })
    }

    const existing = await env.DB.prepare('SELECT order_number, total, delivery_fee, whatsapp_url FROM orders WHERE idempotency_key = ?')
      .bind(body.idempotencyKey).first<ExistingOrder>()
    if (existing) return json({ orderNumber: existing.order_number, total: existing.total, deliveryFee: existing.delivery_fee, whatsappUrl: existing.whatsapp_url })

    const year = new Date().getUTCFullYear()
    const orderPrefix = `PDO-${year}-%`
    const existingOrderNumbers = (await env.DB.prepare('SELECT order_number FROM orders WHERE order_number LIKE ?')
      .bind(orderPrefix).all<{ order_number: string }>()).results || []
    const uniqueIds = [...new Set(body.items.map((item) => item.variantId))]
    const placeholders = uniqueIds.map(() => '?').join(', ')
    const catalogue = (await env.DB.prepare(`
      SELECT id, product_id, slug,
        CASE
          WHEN ? = 'fr' THEN COALESCE(NULLIF(name_fr, ''), NULLIF(name_en, ''), product_name)
          ELSE COALESCE(NULLIF(name_en, ''), product_name)
        END AS product_name,
        variant_name, sku, price, stock, active, image_url
      FROM admin_products WHERE id IN (${placeholders})
    `).bind(locale, ...uniqueIds).all<OrderCatalogRow>()).results || []
    const prepared = prepareOrder(parsedCustomer.data, body.items, catalogue, generateOrderNumber(existingOrderNumbers.map((order) => order.order_number)))
    const whatsappMessage = buildWhatsAppMessage({
      orderNumber: prepared.orderNumber,
      customerName: prepared.customerName,
      telephone: prepared.customerTelephone,
      city: prepared.city,
      address: prepared.address,
      notes: prepared.notes,
      total: prepared.total,
      items: prepared.items.map((item) => ({ name: item.productName, variantName: item.variantName, quantity: item.quantity, lineTotal: item.lineTotal })),
    }, locale)
    const whatsappUrl = buildWhatsAppUrl(env.WHATSAPP_NUMBER || WHATSAPP_NUMBER, whatsappMessage)
    const orderId = crypto.randomUUID()
    const statements = [
      env.DB.prepare(`
        INSERT INTO orders (
          id, order_number, idempotency_key, customer_name, customer_telephone, city, address,
          notes, subtotal, delivery_fee, total, payment_method, status, whatsapp_url, stock_reserved
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        orderId, prepared.orderNumber, body.idempotencyKey, prepared.customerName,
        prepared.customerTelephone, prepared.city, prepared.address, prepared.notes,
        prepared.subtotal, prepared.deliveryFee, prepared.total, prepared.paymentMethod,
        prepared.status, whatsappUrl, 1,
      ),
      ...prepared.items.map((item) => env.DB.prepare(`
        INSERT INTO order_items (
          id, order_id, product_id, variant_id, product_name, variant_name, sku,
          quantity, unit_price, line_total, image_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        crypto.randomUUID(), orderId, item.productId, item.variantId, item.productName,
        item.variantName, item.sku, item.quantity, item.unitPrice, item.lineTotal, item.imageUrl,
      )),
    ]
    await env.DB.batch(statements)
    return json({ orderNumber: prepared.orderNumber, total: prepared.total, deliveryFee: prepared.deliveryFee, whatsappUrl }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create order'
    if (message.includes('stock_reserved')) {
      return json({ code: 'DATABASE_MIGRATION_REQUIRED', error: 'La base de données des commandes doit être mise à jour avant de pouvoir réserver une pièce.' }, { status: 500 })
    }
    if (message.includes('INSUFFICIENT_STOCK') || message.includes('The requested quantity exceeds stock')) {
      return json({ code: 'STOCK_CONFLICT', error: 'Cette pièce vient d’être réservée. Actualisez votre panier pour voir le stock disponible.' }, { status: 409 })
    }
    return json({ error: message }, { status: 400 })
  }
}
