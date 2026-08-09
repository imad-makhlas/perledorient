import { LockKeyhole, MapPin, MessageCircle, UserRound } from 'lucide-react'
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

  if (!state.items.length) return <main className="container-shell py-24 text-center"><p className="eyebrow">Casa de Perla</p><h1 className="display mt-3 text-5xl font-semibold">{t('emptyCart')}</h1></main>

  const fields: [keyof CheckoutForm, string, string][] = [
    ['firstName', t('firstName'), 'text'], ['lastName', t('lastName'), 'text'],
    ['city', t('city'), 'text'],
  ]

  return <main className="bg-white py-8 lg:py-12">
    <div className="container-shell">
      <div className="mx-auto mb-8 max-w-2xl text-center lg:mb-10"><p className="eyebrow">{locale === 'fr' ? 'Commande WhatsApp' : 'طلب عبر واتساب'}</p><h1 className="display mt-2 text-[2.25rem] font-semibold leading-tight sm:text-5xl">{t('checkoutTitle')}</h1><p className="mx-auto mt-3 max-w-xl text-[15px] leading-7 text-muted">{locale === 'fr' ? "Renseignez vos coordonnées. Nous confirmerons personnellement la disponibilité et la livraison sur WhatsApp." : 'أدخلي معلوماتك وسنؤكد لك شخصياً توفر القطعة والتوصيل عبر واتساب.'}</p></div>
      <form onSubmit={submit} className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px] xl:gap-8">
        <section className="min-w-0 overflow-hidden rounded-[28px] border border-[#E2D8CD] bg-[#FFFEFC] shadow-[0_20px_60px_rgba(48,42,46,.07)]">
          <div className="p-5 sm:p-8">
            <div className="flex items-start gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#F2E6D5] text-[#A87525]"><UserRound size={19} strokeWidth={1.6} /></span><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#B07B2B]">01</p><h2 className="display mt-1 text-2xl font-semibold">{locale === 'fr' ? 'Vos coordonnées' : 'معلوماتك'}</h2><p className="mt-1 text-xs leading-5 text-muted">{locale === 'fr' ? 'Les informations nécessaires pour vous contacter.' : 'المعلومات الضرورية للتواصل معك.'}</p></div></div>
            <div className="mt-6 grid min-w-0 gap-5 sm:grid-cols-2">{fields.slice(0, 2).map(([key, label, type]) => <label key={key} className="block min-w-0 text-[10px] font-bold uppercase tracking-[.14em] text-[#51474B]">{label}<input className="mt-2 h-14 w-full rounded-2xl border border-[#D9CEC1] bg-white px-4 text-base font-normal normal-case tracking-normal outline-none transition focus:border-[#C4943D] focus:ring-2 focus:ring-[#C4943D]/10" type={type} value={String(form[key])} onChange={(event) => set(key, event.target.value)} aria-invalid={Boolean(errors[key])} />{errors[key] && <span className="mt-1.5 block text-[11px] normal-case tracking-normal text-red-700">{errors[key]}</span>}</label>)}<InternationalPhoneField country={phoneCountry} value={form.telephone} locale={locale} label={t('telephone')} error={errors.telephone} onCountryChange={setPhoneCountry} onChange={(value) => set('telephone', value)} /><label className="block min-w-0 text-[10px] font-bold uppercase tracking-[.14em] text-[#51474B]">{locale === 'fr' ? 'Pays de livraison' : 'بلد التوصيل'}<select className="mt-2 h-14 w-full rounded-2xl border border-[#D9CEC1] bg-white px-4 text-base font-normal normal-case tracking-normal outline-none transition focus:border-[#C4943D] focus:ring-2 focus:ring-[#C4943D]/10" value={form.country || 'MA'} onChange={(event) => set('country', event.target.value)}><option value="MA">{locale === 'fr' ? 'Maroc' : 'المغرب'}</option><option value="INTERNATIONAL">{locale === 'fr' ? 'International' : 'دولي'}</option></select></label></div>
          </div>
          <div className="border-t border-[#E8DFD5] bg-[#FCF9F5] p-5 sm:p-8">
            <div className="flex items-start gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#F2E6D5] text-[#A87525]"><MapPin size={19} strokeWidth={1.6} /></span><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#B07B2B]">02</p><h2 className="display mt-1 text-2xl font-semibold">{locale === 'fr' ? 'Informations de livraison' : 'معلومات التوصيل'}</h2><p className="mt-1 text-xs leading-5 text-muted">{locale === 'fr' ? 'Indiquez précisément où votre bijou doit être livré.' : 'حددي بدقة المكان الذي تريدين استلام مجوهراتك فيه.'}</p></div></div>
            <div className="mt-6 grid gap-5">{fields.slice(2).map(([key, label, type]) => <label key={key} className="block text-[10px] font-bold uppercase tracking-[.14em] text-[#51474B]">{label}<input className="mt-2 h-14 w-full rounded-2xl border border-[#D9CEC1] bg-white px-4 text-base font-normal normal-case tracking-normal outline-none transition focus:border-[#C4943D] focus:ring-2 focus:ring-[#C4943D]/10" type={type} value={String(form[key])} onChange={(event) => set(key, event.target.value)} aria-invalid={Boolean(errors[key])} />{errors[key] && <span className="mt-1.5 block text-[11px] normal-case tracking-normal text-red-700">{errors[key]}</span>}</label>)}</div>
            <label className="mt-5 block text-[10px] font-bold uppercase tracking-[.14em] text-[#51474B]">{t('address')}<input className="mt-2 h-14 w-full rounded-2xl border border-[#D9CEC1] bg-white px-4 text-base font-normal normal-case tracking-normal outline-none transition focus:border-[#C4943D] focus:ring-2 focus:ring-[#C4943D]/10" value={form.address} onChange={(event) => set('address', event.target.value)} />{errors.address && <span className="mt-1.5 block text-[11px] normal-case tracking-normal text-red-700">{errors.address}</span>}</label>
            <label className="mt-5 block text-[10px] font-bold uppercase tracking-[.14em] text-[#51474B]">{t('notes')}<textarea className="mt-2 min-h-24 w-full resize-y rounded-2xl border border-[#D9CEC1] bg-white px-4 py-4 text-base font-normal normal-case tracking-normal outline-none transition focus:border-[#C4943D] focus:ring-2 focus:ring-[#C4943D]/10" value={form.deliveryNotes} onChange={(event) => set('deliveryNotes', event.target.value)} /></label>
          </div>
          <div className="border-t border-[#E8DFD5] p-5 sm:p-8"><div className="flex items-start gap-4 rounded-2xl border border-[#DFC99F] bg-[#FBF6EC] p-4 sm:p-5"><MessageCircle className="mt-0.5 shrink-0 text-[#B37A22]" size={20} /><div><p className="text-xs font-bold uppercase tracking-[.14em]">{locale === 'fr' ? 'Confirmation personnelle' : 'تأكيد شخصي'}</p><p className="mt-2 text-xs leading-6 text-muted">{locale === 'fr' ? "Aucun paiement en ligne. Votre pièce, la livraison et les modalités sont confirmées avec vous sur WhatsApp." : 'لا يوجد دفع إلكتروني. نؤكد معك عبر واتساب توفر القطعة والتوصيل وتفاصيل الطلب.'}</p></div></div><label className="mt-5 flex items-start gap-3 text-xs leading-5 text-muted"><input className="mt-0.5 h-4 w-4 accent-[#B9822D]" type="checkbox" checked={form.acceptedTerms} onChange={(event) => set('acceptedTerms', event.target.checked)} />{t('consent')}</label>{errors.acceptedTerms && <p className="mt-2 text-xs text-red-700">{locale === 'fr' ? 'Veuillez accepter les conditions.' : 'يرجى قبول الشروط.'}</p>}{errors.form && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{errors.form}</p>}</div>
        </section>
        <aside className="h-fit overflow-hidden rounded-[28px] border border-[#DED4C8] bg-white shadow-[0_20px_60px_rgba(48,42,46,.08)] lg:sticky lg:top-28">
          <div className="bg-[#302A2E] px-6 py-6 text-white sm:px-7"><p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#D9AB57]">Casa de Perla</p><h2 className="display mt-1 text-3xl font-semibold">{t('orderSummary')}</h2></div>
          <div className="p-5 sm:p-7"><div className="space-y-3">{state.items.map((item) => <div key={item.variantId} className="flex items-center gap-3 rounded-2xl border border-[#E7DED4] bg-[#FCFAF7] p-3"><img src={item.imageUrl} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#302A2E]">{item.name}</p><p className="mt-1 truncate text-[11px] text-muted">{item.variantName} · × {item.quantity}</p></div><span className="shrink-0 text-xs font-bold">{formatMoney(item.unitPrice * item.quantity, locale)}</span></div>)}</div>
            <dl className="mt-6 space-y-4 border-y border-[#E5DCD2] py-5 text-sm"><div className="flex justify-between gap-4 text-muted"><dt>{t('subtotal')}</dt><dd className="font-semibold text-[#302A2E]">{formatMoney(subtotal, locale)}</dd></div><div className="flex items-start justify-between gap-4 text-muted"><dt><span className="block">{t('delivery')}</span><span className="mt-1 block text-[10px] text-[#A87525]">{deliveryZoneLabels[locale][delivery.zone]}</span></dt><dd className="max-w-[55%] text-right font-semibold text-[#302A2E]">{delivery.requiresQuote ? (locale === 'fr' ? 'À confirmer sur WhatsApp' : 'يُؤكد عبر واتساب') : delivery.free ? (locale === 'fr' ? 'Offerte' : 'مجانية') : formatMoney(delivery.fee, locale)}</dd></div><div className="flex items-end justify-between gap-4 pt-2"><dt className="display text-xl font-semibold">{t('total')}</dt><dd className="text-xl font-bold text-[#302A2E]">{delivery.requiresQuote ? formatMoney(subtotal, locale) : formatMoney(subtotal + delivery.fee, locale)}</dd></div></dl>
            <button disabled={submitting} className="mt-6 flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#C4923A] px-5 text-[10px] font-bold uppercase tracking-[.15em] text-[#241B14] shadow-[0_12px_28px_rgba(196,146,58,.22)] transition hover:bg-[#D2A34D] disabled:opacity-50"><MessageCircle size={17} />{submitting ? (locale === 'fr' ? 'Préparation…' : 'جارٍ التحضير…') : t('placeOrder')}</button><p className="mt-4 flex items-center justify-center gap-2 text-center text-[10px] leading-4 text-muted"><LockKeyhole size={13} className="text-[#A87525]" />{locale === 'fr' ? 'Disponibilité confirmée par Casa de Perla' : 'التوفر مؤكد من Casa de Perla'}</p></div>
        </aside>
      </form>
    </div>
  </main>
}
