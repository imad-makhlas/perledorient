export type AdminOrderStatus =
  | 'PENDING_CONFIRMATION'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_SHIPMENT'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED'

export type AdminLocale = 'en' | 'fr' | 'ar'

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
  ar: {
    PENDING_CONFIRMATION: 'بانتظار التأكيد',
    CONFIRMED: 'مؤكدة',
    PREPARING: 'قيد التحضير',
    READY_FOR_SHIPMENT: 'جاهزة للشحن',
    SHIPPED: 'تم الشحن',
    DELIVERED: 'تم التسليم',
    CANCELLED: 'ملغاة',
    RETURNED: 'مرتجعة',
  },
}

export function getNextAdminActions(status: AdminOrderStatus) {
  return nextActions[status]
}

export function orderStatusLabel(status: AdminOrderStatus, locale: AdminLocale) {
  return labels[locale][status]
}

const statusPalettes: Record<AdminOrderStatus, { badge: string; action: string }> = {
  PENDING_CONFIRMATION: {
    badge: 'border-[#E5CFA7] bg-[#FBF4E7] text-[#765116]',
    action: 'border-[#C4943D] bg-[#C4943D] text-[#241F21] hover:bg-[#D2A852]',
  },
  CONFIRMED: {
    badge: 'border-[#BED4E2] bg-[#EEF6FA] text-[#315D76]',
    action: 'border-[#BED4E2] bg-[#DCEAF4] text-[#294E67] hover:bg-[#CDE0EC]',
  },
  PREPARING: {
    badge: 'border-[#D8C7E2] bg-[#F5F0F8] text-[#654A73]',
    action: 'border-[#D8C7E2] bg-[#E9E0F1] text-[#5B4269] hover:bg-[#DDD0E8]',
  },
  READY_FOR_SHIPMENT: {
    badge: 'border-[#BDDCD9] bg-[#EDF8F7] text-[#326865]',
    action: 'border-[#BDDCD9] bg-[#DDF0EF] text-[#2D6260] hover:bg-[#CCE7E5]',
  },
  SHIPPED: {
    badge: 'border-[#C8CFE3] bg-[#F0F2F8] text-[#46537A]',
    action: 'border-[#C8CFE3] bg-[#E1E5F2] text-[#3E4B73] hover:bg-[#D3D9EA]',
  },
  DELIVERED: {
    badge: 'border-[#BBDAC8] bg-[#EEF8F2] text-[#356B4F]',
    action: 'border-[#BBDAC8] bg-[#DDEFE5] text-[#2E6348] hover:bg-[#CDE6D8]',
  },
  CANCELLED: {
    badge: 'border-[#E3C2C2] bg-[#FBF0F0] text-[#8A3D3D]',
    action: 'border-[#E3C2C2] bg-[#F3DDDD] text-[#873B3B] hover:bg-[#ECCFCF]',
  },
  RETURNED: {
    badge: 'border-[#D6CFCA] bg-[#F5F2F0] text-[#665C60]',
    action: 'border-[#D6CFCA] bg-[#E9E5E2] text-[#5F565A] hover:bg-[#DDD7D3]',
  },
}

export function orderStatusPalette(status: AdminOrderStatus) {
  return statusPalettes[status]
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
