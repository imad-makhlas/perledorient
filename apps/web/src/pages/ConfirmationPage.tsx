import { CheckCircle2, MessageCircle } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { useI18n } from '../i18n/i18n'
import { formatMoney } from '../lib/format'

type StoredOrder = { orderNumber: string; total: number; deliveryFee: number; whatsappUrl?: string; customer?: { firstName: string; lastName: string; telephone: string; city: string; address: string } }

export function ConfirmationPage() {
  const [params] = useSearchParams()
  const { locale, t } = useI18n()
  const order = (() => {
    try { return JSON.parse(sessionStorage.getItem('perle-d-orient-last-order') ?? 'null') as StoredOrder | null }
    catch { return null }
  })()
  const number = params.get('order') ?? order?.orderNumber ?? 'PDO-PENDING'
  return <main className="container-shell py-16"><div className="mx-auto max-w-3xl bg-white p-7 text-center shadow-soft sm:p-12"><CheckCircle2 className="mx-auto text-accent" size={50} strokeWidth={1.3} /><p className="eyebrow mt-7">Order received</p><h1 className="display mt-3 text-5xl font-semibold">{t('confirmationTitle')}</h1><p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-muted">{t('confirmationBody')}</p><div className="mx-auto mt-8 max-w-md border-y border-line py-5"><p className="text-[10px] font-bold uppercase tracking-widest text-muted">{t('orderNumber')}</p><p className="mt-2 text-xl font-bold tracking-wider">{number}</p>{order && <p className="mt-2 text-sm text-muted">{t('total')}: {formatMoney(order.total, locale)}</p>}</div>{order?.customer && <div className="mx-auto mt-7 grid max-w-xl gap-4 text-left text-sm sm:grid-cols-2"><div className="bg-canvas p-4"><p className="text-[9px] font-bold uppercase tracking-widest text-accent">Customer</p><p className="mt-2 font-semibold">{order.customer.firstName} {order.customer.lastName}</p><p className="mt-1 text-muted">{order.customer.telephone}</p></div><div className="bg-canvas p-4"><p className="text-[9px] font-bold uppercase tracking-widest text-accent">Delivery</p><p className="mt-2 font-semibold">{order.customer.city}</p><p className="mt-1 text-muted">{order.customer.address}</p></div></div>}<div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><a className="button-primary button-accent" href={order?.whatsappUrl ?? 'https://wa.me/212600000000'} target="_blank" rel="noreferrer"><MessageCircle size={16} />WhatsApp support</a><Link className="button-primary" to="/catalogue">{t('continueShopping')}</Link></div></div></main>
}
