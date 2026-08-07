export type AdminOrderStatus =
  | 'PENDING_CONFIRMATION'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_SHIPMENT'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED'

export type AdminLocale = 'en' | 'fr'

export type AdminOrderItem = {
  productName: string
  variantName: string
  sku: string
  quantity: number
  unitPrice?: string
  lineTotal: string
}

export type AdminOrder = {
  orderNumber: string
  customerName: string
  customerTelephone: string
  customerEmail?: string | null
  city: string
  address?: string
  notes?: string | null
  subtotal: string
  deliveryFee: string
  total: string
  paymentMethod: 'CASH_ON_DELIVERY' | 'WHATSAPP' | 'ONLINE_PAYMENT'
  status: AdminOrderStatus
  createdAt: string
  whatsappUrl: string | null
  items: AdminOrderItem[]
}

export type DeletedAdminOrder = { orderNumber: string; deleted: true }
export type AdminOrderStatusResult = AdminOrder | DeletedAdminOrder
export type AdminCredentials = { email: string; password: string }

const nextActions: Record<AdminOrderStatus, AdminOrderStatus[]> = {
  PENDING_CONFIRMATION: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY_FOR_SHIPMENT', 'CANCELLED'],
  READY_FOR_SHIPMENT: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'RETURNED'],
  DELIVERED: ['RETURNED'],
  CANCELLED: [],
  RETURNED: [],
}

const labels: Record<AdminLocale, Record<AdminOrderStatus, string>> = {
  en: {
    PENDING_CONFIRMATION: 'Pending confirmation',
    CONFIRMED: 'Confirmed',
    PREPARING: 'Preparing',
    READY_FOR_SHIPMENT: 'Ready for shipment',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    RETURNED: 'Returned',
  },
  fr: {
    PENDING_CONFIRMATION: 'En attente',
    CONFIRMED: 'Confirmée',
    PREPARING: 'Préparation',
    READY_FOR_SHIPMENT: 'Prête à expédier',
    SHIPPED: 'Expédiée',
    DELIVERED: 'Livrée',
    CANCELLED: 'Annulée',
    RETURNED: 'Retournée',
  },
}

export function getNextAdminActions(status: AdminOrderStatus) {
  return nextActions[status]
}

export function orderStatusLabel(status: AdminOrderStatus, locale: AdminLocale) {
  return labels[locale][status]
}

export function buildBasicAuthHeader(email: string, password: string) {
  const raw = `${email}:${password}`
  if (typeof btoa === 'function') return `Basic ${btoa(raw)}`
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  let output = ''
  for (let index = 0; index < raw.length; index += 3) {
    const first = raw.charCodeAt(index)
    const second = raw.charCodeAt(index + 1)
    const third = raw.charCodeAt(index + 2)
    output += alphabet[first >> 2]
    output += alphabet[((first & 3) << 4) | (Number.isNaN(second) ? 0 : second >> 4)]
    output += Number.isNaN(second) ? '=' : alphabet[((second & 15) << 2) | (Number.isNaN(third) ? 0 : third >> 6)]
    output += Number.isNaN(third) ? '=' : alphabet[third & 63]
  }
  return `Basic ${output}`
}

export async function fetchAdminOrders(credentials: AdminCredentials): Promise<AdminOrder[]> {
  const response = await fetch('/api/v1/admin/orders', { headers: { Authorization: buildBasicAuthHeader(credentials.email, credentials.password) } })
  if (!response.ok) throw new Error(response.status === 401 ? 'Invalid admin credentials' : 'Unable to load orders')
  return response.json() as Promise<AdminOrder[]>
}

export async function changeAdminOrderStatus(credentials: AdminCredentials, orderNumber: string, status: AdminOrderStatus, comment = ''): Promise<AdminOrderStatusResult> {
  const response = await fetch(`/api/v1/admin/orders/${encodeURIComponent(orderNumber)}/status`, {
    method: 'PATCH',
    headers: { Authorization: buildBasicAuthHeader(credentials.email, credentials.password), 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, comment }),
  })
  if (!response.ok) throw new Error('Unable to update order status')
  return response.json() as Promise<AdminOrderStatusResult>
}

export async function deleteAdminOrder(credentials: AdminCredentials, orderNumber: string): Promise<DeletedAdminOrder> {
  const response = await fetch(`/api/v1/admin/orders/${encodeURIComponent(orderNumber)}`, {
    method: 'DELETE',
    headers: { Authorization: buildBasicAuthHeader(credentials.email, credentials.password) },
  })
  if (!response.ok) throw new Error('Unable to delete order')
  return response.json() as Promise<DeletedAdminOrder>
}
