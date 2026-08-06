import { CheckCircle2, Clock3, LogIn, MessageCircle, PackageCheck, RefreshCw, Search, Truck, XCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { changeAdminOrderStatus, fetchAdminOrders, getNextAdminActions, orderStatusLabel, type AdminCredentials, type AdminOrder, type AdminOrderStatus } from '../features/admin/admin-orders'
import { formatMoney } from '../lib/format'
import { useI18n } from '../i18n/i18n'

const credentialsKey = 'perle-d-orient-owner-credentials'
const statuses: AdminOrderStatus[] = ['PENDING_CONFIRMATION', 'CONFIRMED', 'PREPARING', 'READY_FOR_SHIPMENT', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED']

const statusIcon: Record<AdminOrderStatus, typeof Clock3> = {
  PENDING_CONFIRMATION: Clock3,
  CONFIRMED: CheckCircle2,
  PREPARING: PackageCheck,
  READY_FOR_SHIPMENT: PackageCheck,
  SHIPPED: Truck,
  DELIVERED: CheckCircle2,
  CANCELLED: XCircle,
  RETURNED: RefreshCw,
}

export function AdminOrdersPage() {
  const { locale } = useI18n()
  const [credentials, setCredentials] = useState<AdminCredentials>(() => {
    try { return JSON.parse(localStorage.getItem(credentialsKey) || '{"email":"atelier@perledorient.ma","password":""}') as AdminCredentials } catch { return { email: 'atelier@perledorient.ma', password: '' } }
  })
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [filter, setFilter] = useState<AdminOrderStatus | 'ALL'>('ALL')
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const [busyOrder, setBusyOrder] = useState<string | null>(null)

  const load = async () => {
    setMessage('')
    const data = await fetchAdminOrders(credentials)
    localStorage.setItem(credentialsKey, JSON.stringify(credentials))
    setOrders(data)
  }

  const visible = useMemo(() => orders.filter((order) => {
    const haystack = `${order.orderNumber} ${order.customerName} ${order.customerTelephone} ${order.city}`.toLowerCase()
    return (filter === 'ALL' || order.status === filter) && haystack.includes(query.toLowerCase())
  }), [filter, orders, query])

  const updateStatus = async (order: AdminOrder, status: AdminOrderStatus) => {
    setBusyOrder(order.orderNumber)
    setMessage('')
    try {
      const updated = await changeAdminOrderStatus(credentials, order.orderNumber, status)
      setOrders((current) => 'deleted' in updated
        ? current.filter((item) => item.orderNumber !== updated.orderNumber)
        : current.map((item) => item.orderNumber === updated.orderNumber ? updated : item))
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update order status')
    } finally {
      setBusyOrder(null)
    }
  }

  return <main className="bg-canvas">
    <section className="border-b border-accent/20 bg-pearl">
      <div className="container-shell grid gap-6 py-8 lg:grid-cols-[1fr_420px] lg:items-end">
        <div>
          <p className="eyebrow">Perle d'Orient Atelier</p>
          <h1 className="display mt-3 text-4xl font-semibold text-ink md:text-5xl">Order operations</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/70">Confirm COD and WhatsApp orders, move parcels through fulfilment, and keep reserved stock aligned with the real order status.</p>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); load().catch((error: Error) => setMessage(error.message)) }} className="luxe-surface grid gap-3 p-4 sm:grid-cols-[1fr_1fr_auto]">
          <input className="field" value={credentials.email} onChange={(event) => setCredentials((current) => ({ ...current, email: event.target.value }))} placeholder="Admin email" type="email" />
          <input className="field" value={credentials.password} onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))} placeholder="Password" type="password" />
          <button className="button-primary min-w-32" type="submit"><LogIn size={16} /> Sign in</button>
        </form>
      </div>
    </section>

    <section className="container-shell py-8">
      <div className="flex flex-col gap-4 border-b border-line pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilter('ALL')} className={`border px-3 py-2 text-[11px] font-bold uppercase tracking-wider ${filter === 'ALL' ? 'border-ink bg-ink text-white' : 'border-line bg-white'}`}>All</button>
          {statuses.map((status) => <button key={status} onClick={() => setFilter(status)} className={`border px-3 py-2 text-[11px] font-bold uppercase tracking-wider ${filter === status ? 'border-ink bg-ink text-white' : 'border-line bg-white'}`}>{orderStatusLabel(status, locale)}</button>)}
        </div>
        <label className="flex min-h-12 items-center gap-3 border border-line bg-white px-4">
          <Search size={17} />
          <input className="w-full bg-transparent text-sm outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search orders" />
        </label>
      </div>
      {message && <p className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{message}</p>}
      <div className="mt-6 grid gap-4">
        {visible.map((order) => {
          const Icon = statusIcon[order.status]
          return <article key={order.orderNumber} className="luxe-surface p-5">
            <div className="grid gap-5 xl:grid-cols-[1fr_260px]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="display text-2xl font-semibold">{order.orderNumber}</span>
                  <span className="inline-flex items-center gap-2 border border-line bg-canvas px-3 py-1 text-[11px] font-bold uppercase tracking-wider"><Icon size={14} />{orderStatusLabel(order.status, locale)}</span>
                  <span className="text-xs uppercase tracking-wider text-ink/50">{new Date(order.createdAt).toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')}</span>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-ink/75 md:grid-cols-3">
                  <p><span className="block text-[10px] font-bold uppercase tracking-wider text-ink/45">Customer</span>{order.customerName}<br />{order.customerTelephone}</p>
                  <p><span className="block text-[10px] font-bold uppercase tracking-wider text-ink/45">Delivery</span>{order.city}<br />{order.address}</p>
                  <p><span className="block text-[10px] font-bold uppercase tracking-wider text-ink/45">Payment</span>{order.paymentMethod.replaceAll('_', ' ')}<br />{formatMoney(Number(order.total))}</p>
                </div>
                <div className="mt-5 divide-y divide-line border-y border-line">
                  {order.items.map((item) => <div key={`${order.orderNumber}-${item.sku}`} className="grid gap-2 py-3 text-sm md:grid-cols-[1fr_auto_auto]">
                    <span>{item.productName} <span className="text-ink/50">/ {item.variantName} / {item.sku}</span></span>
                    <span>Qty {item.quantity}</span>
                    <span>{formatMoney(Number(item.lineTotal))}</span>
                  </div>)}
                </div>
              </div>
              <div className="flex flex-col gap-3 border-t border-line pt-4 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0">
                {order.whatsappUrl && <a href={order.whatsappUrl} target="_blank" rel="noreferrer" className="button-primary button-accent"><MessageCircle size={16} /> WhatsApp</a>}
                {getNextAdminActions(order.status).map((status) => <button key={status} disabled={busyOrder === order.orderNumber} onClick={() => updateStatus(order, status)} className="button-primary disabled:cursor-wait disabled:opacity-60">{orderStatusLabel(status, locale)}</button>)}
                {getNextAdminActions(order.status).length === 0 && <p className="border border-line bg-canvas px-4 py-3 text-center text-xs uppercase tracking-wider text-ink/55">No further actions</p>}
              </div>
            </div>
          </article>
        })}
      </div>
    </section>
  </main>
}
