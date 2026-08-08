import { LockKeyhole, MessageCircle } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import type { Country } from 'react-phone-number-input'
import { useNavigate } from 'react-router-dom'
import { InternationalPhoneField } from '../components/checkout/InternationalPhoneField'
import { clearCart } from '../features/cart/cart'
import { useCart } from '../features/cart/cart-context'
import { checkoutSchema, type CheckoutForm } from '../features/checkout/checkout-schema'
import { toInternationalPhone } from '../features/checkout/international-phone'
import { createOrder } from '../features/checkout/order-api'
import { fetchDeliverySettings } from '../features/checkout/delivery-api'
import { calculateDeliveryFee, DEFAULT_DELIVERY_SETTINGS, deliveryZoneLabels } from '../features/checkout/delivery-pricing'
import { isMobileWhatsAppDevice, toWhatsAppAppUrl } from '../features/checkout/whatsapp-handoff'
import { useI18n } from '../i18n/i18n'
import { formatMoney } from '../lib/format'

const defaults: CheckoutForm = {
  firstName: '', lastName: '', country: 'MA', telephone: '', city: 'Fès',
  address: '', deliveryNotes: '', paymentMethod: 'WHATSAPP', acceptedTerms: true,
}

export function WhatsAppCheckoutPage() {
  const [form, setForm] = useState<CheckoutForm>(defaults)
  const [phoneCountry, setPhoneCountry] = useState<Country>('MA')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [deliverySettings, setDeliverySettings] = useState(DEFAULT_DELIVERY_SETTINGS)
  const { state, subtotal, dispatch } = useCart()
  const { locale, t } = useI18n()
  const navigate = useNavigate()
  const delivery = calculateDeliveryFee(subtotal, form.city, form.country || 'MA', deliverySettings)
  const set = (key: keyof CheckoutForm, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }))

  useEffect(() => { fetchDeliverySettings().then(setDeliverySettings) }, [])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (submitting) return
    const result = checkoutSchema.safeParse({ ...form, telephone: toInternationalPhone(phoneCountry, form.telephone) })
    if (!result.success) {
      setErrors(Object.fromEntries(result.error.issues.map((issue) => [String(issue.path[0]), issue.message])))
      return
    }
    setErrors({})
    setSubmitting(true)
    try {
      const order = await createOrder(result.data, state.items, locale)
      sessionStorage.setItem('perle-d-orient-last-order', JSON.stringify({ ...order, customer: result.data, items: state.items }))
      dispatch(clearCart())
      navigate('/', { replace: true })
      if (order.whatsappUrl) {
        if (isMobileWhatsAppDevice(navigator.userAgent)) {
          window.setTimeout(() => window.location.assign(toWhatsAppAppUrl(order.whatsappUrl!)), 0)
        } else {
          window.open(order.whatsappUrl, '_blank', 'noopener,noreferrer')
        }
      }
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : 'We could not prepare your WhatsApp order. Please try again.' })
      setSubmitting(false)
    }
  }

  if (!state.items.length) return <main className="container-shell py-24 text-center"><p className="eyebrow">Perle d'Orient</p><h1 className="display mt-3 text-5xl font-semibold">{t('emptyCart')}</h1></main>

  const fields: [keyof CheckoutForm, string, string][] = [
    ['firstName', t('firstName'), 'text'], ['lastName', t('lastName'), 'text'],
    ['city', t('city'), 'text'],
  ]

  return <main className="container-shell py-9 lg:py-16">
    <div className="mb-7 text-center lg:mb-10"><p className="eyebrow">{locale === 'fr' ? 'Commande WhatsApp' : 'طلب عبر واتساب'}</p><h1 className="display mt-2 text-[2.4rem] font-semibold sm:text-5xl">{t('checkoutTitle')}</h1><p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-muted">{locale === 'fr' ? "Aucun paiement en ligne. Renseignez vos coordonnées, puis confirmez la disponibilité et la livraison directement sur WhatsApp." : 'لا يوجد دفع إلكتروني. أدخلي معلومات التوصيل، ثم أكدي التوفر والتوصيل مباشرة عبر واتساب.'}</p></div>
    <form onSubmit={submit} className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
      <section className="min-w-0 rounded-[24px] border border-line bg-white p-5 shadow-soft sm:p-9">
        <div className="grid gap-5 sm:grid-cols-2">{fields.slice(0, 2).map(([key, label, type]) => <label key={key} className="text-[10px] font-bold uppercase tracking-widest">{label}<input className="field mt-2 normal-case tracking-normal" type={type} value={String(form[key])} onChange={(event) => set(key, event.target.value)} aria-invalid={Boolean(errors[key])} />{errors[key] && <span className="mt-1 block text-[10px] normal-case tracking-normal text-red-700">{errors[key]}</span>}</label>)}<InternationalPhoneField country={phoneCountry} value={form.telephone} locale={locale} label={t('telephone')} error={errors.telephone} onCountryChange={setPhoneCountry} onChange={(value) => set('telephone', value)} /><label className="text-[10px] font-bold uppercase tracking-widest">{locale === 'fr' ? 'Pays de livraison' : 'بلد التوصيل'}<select className="field mt-2 normal-case tracking-normal" value={form.country || 'MA'} onChange={(event) => set('country', event.target.value)}><option value="MA">{locale === 'fr' ? 'Maroc' : 'المغرب'}</option><option value="INTERNATIONAL">{locale === 'fr' ? 'International' : 'دولي'}</option></select></label>{fields.slice(2).map(([key, label, type]) => <label key={key} className="text-[10px] font-bold uppercase tracking-widest sm:col-span-2">{label}<input className="field mt-2 normal-case tracking-normal" type={type} value={String(form[key])} onChange={(event) => set(key, event.target.value)} aria-invalid={Boolean(errors[key])} />{errors[key] && <span className="mt-1 block text-[10px] normal-case tracking-normal text-red-700">{errors[key]}</span>}</label>)}</div>
        <label className="mt-5 block text-[10px] font-bold uppercase tracking-widest">{t('address')}<input className="field mt-2 normal-case tracking-normal" value={form.address} onChange={(event) => set('address', event.target.value)} />{errors.address && <span className="mt-1 block text-[10px] normal-case tracking-normal text-red-700">{errors.address}</span>}</label>
        <label className="mt-5 block text-[10px] font-bold uppercase tracking-widest">{t('notes')}<textarea className="field mt-2 min-h-24 resize-y normal-case tracking-normal" value={form.deliveryNotes} onChange={(event) => set('deliveryNotes', event.target.value)} /></label>
        <div className="mt-7 flex items-start gap-4 border border-champagne bg-canvas p-5"><MessageCircle className="mt-0.5 shrink-0 text-accent" size={20} /><div><p className="text-xs font-bold uppercase tracking-widest">{locale === 'fr' ? 'Confirmation directe sur WhatsApp' : 'تأكيد مباشر عبر واتساب'}</p><p className="mt-2 text-xs leading-5 text-muted">{locale === 'fr' ? "Sans compte client. Nous confirmons personnellement votre bijou, la livraison et les modalités sur WhatsApp." : 'لا تحتاجين إلى حساب. نؤكد لك شخصياً القطعة والتوصيل وتفاصيل الطلب عبر واتساب.'}</p></div></div>
        <label className="mt-7 flex items-start gap-3 text-xs leading-5 text-muted"><input className="mt-1" type="checkbox" checked={form.acceptedTerms} onChange={(event) => set('acceptedTerms', event.target.checked)} />{t('consent')}</label>
        {errors.acceptedTerms && <p className="mt-2 text-xs text-red-700">Please accept the terms.</p>}{errors.form && <p className="mt-4 text-sm text-red-700">{errors.form}</p>}
      </section>
      <aside className="h-fit rounded-[24px] bg-burgundy p-6 text-white sm:p-7 lg:sticky lg:top-28">
        <h2 className="display text-3xl font-semibold">{t('orderSummary')}</h2>
        <div className="mt-6 space-y-4">{state.items.map((item) => <div key={item.variantId} className="flex gap-3"><img src={item.imageUrl} alt="" className="h-16 w-14 object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.name}</p><p className="mt-1 text-[10px] text-white/55">{item.variantName} x {item.quantity}</p></div><span className="text-xs font-semibold">{formatMoney(item.unitPrice * item.quantity, locale)}</span></div>)}</div>
        <dl className="mt-7 space-y-3 border-y border-white/15 py-5 text-sm"><div className="flex justify-between text-white/65"><dt>{t('subtotal')}</dt><dd>{formatMoney(subtotal, locale)}</dd></div><div className="flex items-start justify-between gap-4 text-white/65"><dt><span className="block">{t('delivery')}</span><span className="mt-1 block text-[10px] text-white/45">{deliveryZoneLabels[locale][delivery.zone]}</span></dt><dd className="text-right">{delivery.requiresQuote ? (locale === 'fr' ? 'À confirmer sur WhatsApp' : 'يُؤكد عبر واتساب') : delivery.free ? (locale === 'fr' ? 'Offerte' : 'مجانية') : formatMoney(delivery.fee, locale)}</dd></div><div className="flex justify-between pt-2 text-lg font-bold"><dt>{t('total')}</dt><dd>{delivery.requiresQuote ? formatMoney(subtotal, locale) : formatMoney(subtotal + delivery.fee, locale)}</dd></div></dl>
        <button disabled={submitting} className="button-primary button-accent mt-6 w-full disabled:opacity-50"><MessageCircle size={16} />{submitting ? (locale === 'fr' ? 'Préparation…' : 'جارٍ التحضير…') : t('placeOrder')}</button>
        <p className="mt-4 flex items-center justify-center gap-2 text-[10px] text-white/50"><LockKeyhole size={13} />{locale === 'fr' ? "Disponibilité confirmée par Perle d’Orient" : 'التوفر مؤكد من Perle d’Orient'}</p>
      </aside>
    </form>
  </main>
}
