import { LockKeyhole, MessageCircle } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../features/cart/cart-context'
import { checkoutSchema, type CheckoutForm } from '../features/checkout/checkout-schema'
import { createOrder } from '../features/checkout/order-api'
import { useI18n } from '../i18n/i18n'
import { formatMoney } from '../lib/format'

const defaults: CheckoutForm = {
  firstName: '', lastName: '', telephone: '', city: 'Casablanca',
  address: '', deliveryNotes: '', paymentMethod: 'WHATSAPP', acceptedTerms: true,
}

export function WhatsAppCheckoutPage() {
  const [form, setForm] = useState<CheckoutForm>(defaults)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const { state, subtotal } = useCart()
  const { locale, t } = useI18n()
  const navigate = useNavigate()
  const delivery = subtotal >= 500 ? 0 : form.city.toLowerCase() === 'casablanca' ? 30 : 45
  const set = (key: keyof CheckoutForm, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }))

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (submitting) return
    const result = checkoutSchema.safeParse(form)
    if (!result.success) {
      setErrors(Object.fromEntries(result.error.issues.map((issue) => [String(issue.path[0]), issue.message])))
      return
    }
    setErrors({})
    setSubmitting(true)
    try {
      const order = await createOrder(result.data, state.items)
      sessionStorage.setItem('perle-d-orient-last-order', JSON.stringify({ ...order, customer: result.data, items: state.items }))
      if (order.whatsappUrl) window.open(order.whatsappUrl, '_blank', 'noopener,noreferrer')
      navigate(`/order-confirmation?order=${order.orderNumber}`)
    } catch {
      setErrors({ form: 'We could not prepare your WhatsApp order. Please try again.' })
      setSubmitting(false)
    }
  }

  if (!state.items.length) return <main className="container-shell py-24 text-center"><p className="eyebrow">Perle d'Orient</p><h1 className="display mt-3 text-5xl font-semibold">{t('emptyCart')}</h1></main>

  const fields: [keyof CheckoutForm, string, string][] = [
    ['firstName', t('firstName'), 'text'], ['lastName', t('lastName'), 'text'],
    ['telephone', t('telephone'), 'tel'], ['city', t('city'), 'text'],
  ]

  return <main className="container-shell py-9 lg:py-16">
    <div className="mb-7 text-center lg:mb-10"><p className="eyebrow">WhatsApp order</p><h1 className="display mt-2 text-[2.4rem] font-semibold sm:text-5xl">{t('checkoutTitle')}</h1><p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-muted">{locale === 'fr' ? "Aucun paiement en ligne. Renseignez vos coordonnées, puis confirmez la disponibilité et la livraison directement sur WhatsApp." : 'No online payment. Share your delivery details, then confirm availability and delivery directly on WhatsApp.'}</p></div>
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_420px]">
      <section className="rounded-[24px] border border-line bg-white p-5 shadow-soft sm:p-9">
        <div className="grid gap-5 sm:grid-cols-2">{fields.map(([key, label, type]) => <label key={key} className="text-[10px] font-bold uppercase tracking-widest">{label}<input className="field mt-2 normal-case tracking-normal" type={type} value={String(form[key])} onChange={(event) => set(key, event.target.value)} aria-invalid={Boolean(errors[key])} />{errors[key] && <span className="mt-1 block text-[10px] normal-case tracking-normal text-red-700">{errors[key]}</span>}</label>)}</div>
        <label className="mt-5 block text-[10px] font-bold uppercase tracking-widest">{t('address')}<input className="field mt-2 normal-case tracking-normal" value={form.address} onChange={(event) => set('address', event.target.value)} />{errors.address && <span className="mt-1 block text-[10px] normal-case tracking-normal text-red-700">{errors.address}</span>}</label>
        <label className="mt-5 block text-[10px] font-bold uppercase tracking-widest">{t('notes')}<textarea className="field mt-2 min-h-24 resize-y normal-case tracking-normal" value={form.deliveryNotes} onChange={(event) => set('deliveryNotes', event.target.value)} /></label>
        <div className="mt-7 flex items-start gap-4 border border-champagne bg-canvas p-5"><MessageCircle className="mt-0.5 shrink-0 text-accent" size={20} /><div><p className="text-xs font-bold uppercase tracking-widest">{locale === 'fr' ? 'Confirmation directe sur WhatsApp' : 'Direct WhatsApp confirmation'}</p><p className="mt-2 text-xs leading-5 text-muted">{locale === 'fr' ? "Sans compte client. Nous confirmons personnellement votre bijou, la livraison et les modalités sur WhatsApp." : 'No customer account. We confirm your piece, delivery and order details personally on WhatsApp.'}</p></div></div>
        <label className="mt-7 flex items-start gap-3 text-xs leading-5 text-muted"><input className="mt-1" type="checkbox" checked={form.acceptedTerms} onChange={(event) => set('acceptedTerms', event.target.checked)} />{t('consent')}</label>
        {errors.acceptedTerms && <p className="mt-2 text-xs text-red-700">Please accept the terms.</p>}{errors.form && <p className="mt-4 text-sm text-red-700">{errors.form}</p>}
      </section>
      <aside className="h-fit rounded-[24px] bg-burgundy p-6 text-white sm:p-7 lg:sticky lg:top-28">
        <h2 className="display text-3xl font-semibold">{t('orderSummary')}</h2>
        <div className="mt-6 space-y-4">{state.items.map((item) => <div key={item.variantId} className="flex gap-3"><img src={item.imageUrl} alt="" className="h-16 w-14 object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.name}</p><p className="mt-1 text-[10px] text-white/55">{item.variantName} x {item.quantity}</p></div><span className="text-xs font-semibold">{formatMoney(item.unitPrice * item.quantity, locale)}</span></div>)}</div>
        <dl className="mt-7 space-y-3 border-y border-white/15 py-5 text-sm"><div className="flex justify-between text-white/65"><dt>{t('subtotal')}</dt><dd>{formatMoney(subtotal, locale)}</dd></div><div className="flex justify-between text-white/65"><dt>{t('delivery')}</dt><dd>{delivery ? formatMoney(delivery, locale) : 'Complimentary'}</dd></div><div className="flex justify-between pt-2 text-lg font-bold"><dt>{t('total')}</dt><dd>{formatMoney(subtotal + delivery, locale)}</dd></div></dl>
        <button disabled={submitting} className="button-primary button-accent mt-6 w-full disabled:opacity-50"><MessageCircle size={16} />{submitting ? 'Preparing...' : t('placeOrder')}</button>
        <p className="mt-4 flex items-center justify-center gap-2 text-[10px] text-white/50"><LockKeyhole size={13} />Availability confirmed by Perle d'Orient</p>
      </aside>
    </form>
  </main>
}
