import { BadgeCheck, Banknote, Check, ChevronDown, ChevronRight, MessageCircle, Minus, PackageCheck, Plus, RotateCcw, Share2, ShoppingBag } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { ProductImageViewer } from '../components/product/ProductImageViewer'
import { MobileProductActions } from '../components/product/MobileProductActions'
import { addCartItem, clearCart } from '../features/cart/cart'
import { useCart } from '../features/cart/cart-context'
import { useCatalogProducts } from '../features/catalog/catalog-api'
import { useI18n } from '../i18n/i18n'
import { formatMoney } from '../lib/format'

const pageCopy = {
  ar: { selectFinish: 'اختاري اللمسة النهائية', quantity: 'الكمية', added: 'تمت الإضافة', purchaseLabel: 'تفاصيل شراء القطعة', reassuranceLabel: 'الدفع والتوصيل', assurances: ['الدفع عند الاستلام أو التحويل البنكي', 'تأكيد الطلب بشكل شخصي', 'التوصيل المتوقع خلال يومين إلى 4 أيام عمل', 'الإرجاع خلال 7 أيام'], description: 'الوصف', specifications: 'المواصفات', delivery: 'التوصيل والإرجاع', deliveryBody: 'التوصيل المتوقع خلال يومين إلى 4 أيام عمل. يمكن إرجاع القطع غير المستعملة خلال 7 أيام.', related: 'قد يعجبك أيضاً', relatedTitle: 'واصلي اكتشاف المجموعة.', directOrder: 'اطلبي عبر واتساب', openImage: 'تكبير صورة القطعة', closeImage: 'إغلاق الصورة المكبرة', enlargedImage: 'صورة مكبرة', imageHint: 'تكبير' },
  fr: { selectFinish: 'Choisir la finition', quantity: 'Quantité', added: 'Ajouté', purchaseLabel: "Détails d'achat du produit", reassuranceLabel: 'Paiement et livraison', assurances: ['Paiement à la livraison ou virement bancaire', 'Commande confirmée personnellement', 'Livraison estimée sous 2 à 4 jours ouvrés', 'Retours sous 7 jours'], description: 'Description', specifications: 'Caractéristiques', delivery: 'Livraison et retours', deliveryBody: 'Livraison estimée sous 2 à 4 jours ouvrés. Les pièces non portées peuvent être retournées sous 7 jours.', related: 'Vous aimerez aussi', relatedTitle: 'Continuez votre découverte.', directOrder: 'Commander via WhatsApp', openImage: 'Agrandir la photo du bijou', closeImage: 'Fermer la photo agrandie', enlargedImage: 'Photo agrandie', imageHint: 'Agrandir' },
} as const

const reassuranceIcons = [Banknote, BadgeCheck, PackageCheck, RotateCcw] as const

export function ProductPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { locale, t } = useI18n()
  const products = useCatalogProducts(locale)
  const product = products.find((item) => item.slug === slug) ?? products[0]
  const [variantId, setVariantId] = useState(product.variants[0].id)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle')
  const { dispatch } = useCart()
  const copy = pageCopy[locale]
  useEffect(() => { setVariantId(product.variants[0].id); setQuantity(1) }, [product.id, product.variants])
  const variant = useMemo(() => product.variants.find((item) => item.id === variantId) ?? product.variants[0], [product, variantId])
  const selectedCartItem = { productId: product.id, variantId: variant.id, slug: product.slug, name: product.name, variantName: variant.name, imageUrl: variant.image ?? product.image, unitPrice: variant.price, stockQuantity: variant.stock }
  const add = () => { dispatch(addCartItem(selectedCartItem, quantity)); setAdded(true); setTimeout(() => setAdded(false), 1800) }
  const orderDirectly = () => {
    if (variant.stock === 0) return
    dispatch(clearCart())
    dispatch(addCartItem(selectedCartItem, quantity))
    navigate('/checkout')
  }
  const share = async () => {
    const url = window.location.href
    const title = product.name
    const text = `${product.name} - Casa de Perla`
    if (navigator.share) {
      await navigator.share({ title, text, url })
      return
    }
    await navigator.clipboard.writeText(url)
    setShareState('copied')
    window.setTimeout(() => setShareState('idle'), 1800)
  }
  const shareLabel = shareState === 'copied' ? (locale === 'fr' ? 'Lien copié' : 'تم نسخ الرابط') : (locale === 'fr' ? 'Partager' : 'مشاركة')
  const galleryImages = [variant.image, ...product.images, product.image].filter((image): image is string => Boolean(image))
  return <main className="bg-white pb-24 md:pb-0"><nav aria-label={locale === 'fr' ? 'Fil d’Ariane' : 'مسار التنقل'} className="container-shell flex items-center gap-2 overflow-hidden py-4 text-[9px] font-semibold uppercase tracking-[.16em] text-muted sm:py-5"><Link to="/catalogue" className="shrink-0 transition-colors hover:text-accent">{locale === 'fr' ? 'Boutique' : 'المتجر'}</Link><ChevronRight className="shrink-0 text-accent" size={11} /><span className="shrink-0">{product.category}</span><ChevronRight className="shrink-0 text-accent" size={11} /><span className="truncate text-ink">{product.name}</span></nav>
    <section className="container-shell grid gap-7 pb-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(380px,.92fr)] lg:items-start lg:gap-10 xl:gap-14"><div className="lg:sticky lg:top-28"><ProductImageViewer images={galleryImages} alt={product.name} openLabel={copy.openImage} closeLabel={copy.closeImage} dialogLabel={`${copy.enlargedImage} : ${product.name}`} enlargedAlt={`${product.name} — ${copy.enlargedImage}`} hint={copy.imageHint} previousLabel={locale === 'fr' ? 'Image précédente' : 'الصورة السابقة'} nextLabel={locale === 'fr' ? 'Image suivante' : 'الصورة التالية'} thumbnailLabel={locale === 'fr' ? 'Afficher la photo' : 'عرض الصورة'} /></div><aside aria-label={copy.purchaseLabel} className="overflow-hidden rounded-[6px] border border-line bg-white p-5 shadow-[0_22px_70px_rgba(47,42,44,.07)] sm:rounded-[6px] sm:p-8 lg:p-9"><div className="flex items-start justify-between gap-4"><div className="min-w-0"><p className="eyebrow">{product.brand}</p><h1 className="display mt-3 text-[1.8rem] font-semibold leading-[1.08] text-ink sm:text-5xl sm:leading-[1.02]">{product.name}</h1></div><button type="button" onClick={share} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-accent hover:text-accent" aria-label={shareLabel} title={shareLabel}>{shareState === 'copied' ? <Check size={17} /> : <Share2 size={17} />}</button></div><div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5"><div className="flex items-baseline gap-3"><span className="text-2xl font-semibold text-ink">{formatMoney(variant.price, locale)}</span>{product.comparisonPrice && <span className="text-sm text-muted line-through">{formatMoney(product.comparisonPrice, locale)}</span>}</div><span className={`rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.13em] ${variant.stock > 0 ? 'border-accent/35 bg-[#FBF4E7] text-[#765116]' : 'border-line bg-[#F4F1EE] text-muted'}`}>{variant.stock > 0 ? `${variant.stock <= 5 ? t('lowStock') : t('inStock')} · ${variant.sku}` : t('outOfStock')}</span></div><p className="hidden py-5 text-[15px] leading-7 text-muted sm:block sm:text-base">{product.shortDescription}</p>
      <div className="border-t border-line pt-5"><span className="text-[10px] font-bold uppercase tracking-[.16em] text-ink">{copy.selectFinish}</span><div className="mt-3 grid gap-2 sm:grid-cols-2">{product.variants.map((item) => <button key={item.id} type="button" disabled={item.stock === 0} onClick={() => { setVariantId(item.id); setQuantity(1) }} className={`rounded-[6px] border px-4 py-3.5 text-left text-xs font-semibold transition duration-300 ${item.id === variant.id ? 'border-[#2F2A2C] bg-[#2F2A2C] text-white shadow-[0_10px_24px_rgba(47,42,44,.13)]' : 'border-line bg-white hover:border-accent hover:bg-[#FFFCF7]'} disabled:cursor-not-allowed disabled:opacity-40`}>{item.name}<span className="mt-1 block text-[10px] font-normal opacity-65">{formatMoney(item.price, locale)}</span></button>)}</div></div>
      <div className="mt-6 rounded-[6px] border border-line bg-[#FBFAF8] p-3 sm:p-4"><div className="mb-3 flex items-center justify-between gap-4"><span className="text-[9px] font-bold uppercase tracking-[.16em] text-muted">{copy.quantity}</span><div className="flex h-11 items-center rounded-[6px] border border-line bg-white"><button type="button" className="grid h-full w-10 place-items-center transition-colors hover:text-accent" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity"><Minus size={14} /></button><span className="w-8 text-center text-sm font-semibold">{quantity}</span><button type="button" className="grid h-full w-10 place-items-center transition-colors hover:text-accent" onClick={() => setQuantity(Math.min(variant.stock, quantity + 1))} aria-label="Increase quantity"><Plus size={14} /></button></div></div><button type="button" onClick={orderDirectly} disabled={variant.stock === 0} className="hidden min-h-[52px] w-full items-center justify-center gap-2.5 rounded-[6px] bg-[#C4953D] px-5 py-4 text-[10px] font-bold uppercase tracking-[.12em] text-[#241F21] shadow-[0_12px_28px_rgba(196,149,61,.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#B88833] hover:shadow-[0_16px_34px_rgba(196,149,61,.3)] disabled:cursor-not-allowed disabled:bg-[#E8E1D9] disabled:text-[#8B7E80] disabled:shadow-none md:inline-flex"><MessageCircle size={17} aria-hidden="true" />{copy.directOrder}</button><button type="button" onClick={add} disabled={variant.stock === 0} className="mt-2.5 hidden min-h-12 w-full items-center justify-center gap-2.5 rounded-[6px] border border-[#2F2A2C] bg-[#2F2A2C] px-5 text-[10px] font-bold uppercase tracking-[.11em] text-white transition duration-300 hover:bg-[#40393C] disabled:cursor-not-allowed disabled:border-line disabled:bg-[#E8E1D9] disabled:text-[#8B7E80] md:inline-flex">{added ? <><Check size={16} />{copy.added}</> : <><ShoppingBag size={16} />{t('addToCart')}</>}</button></div>
      <div role="region" aria-label={copy.reassuranceLabel} className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[6px] border border-line bg-line">{copy.assurances.map((label, index) => { const Icon = reassuranceIcons[index]; return <div key={label} className="flex min-h-[74px] items-start gap-2.5 bg-[#FBFAF8] p-3"><Icon size={15} strokeWidth={1.6} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" /><span className="text-[9px] font-semibold uppercase leading-4 tracking-[.06em] text-ink/70">{label}</span></div> })}</div>
      <div className="mt-7 divide-y divide-line border-y border-line text-sm"><details className="group py-1"><summary className="flex cursor-pointer list-none items-center justify-between py-4 font-semibold [&::-webkit-details-marker]:hidden">{copy.description}<ChevronDown size={16} className="text-accent transition-transform group-open:rotate-180" /></summary><p className="pb-5 leading-7 text-muted">{product.description}</p></details><details className="group py-1"><summary className="flex cursor-pointer list-none items-center justify-between py-4 font-semibold [&::-webkit-details-marker]:hidden">{copy.specifications}<ChevronDown size={16} className="text-accent transition-transform group-open:rotate-180" /></summary><dl className="space-y-3 pb-5">{Object.entries(product.specifications).map(([key, value]) => <div key={key} className="flex justify-between gap-4 text-muted"><dt>{key}</dt><dd className="text-right font-medium text-ink">{value}</dd></div>)}</dl></details><details className="group py-1"><summary className="flex cursor-pointer list-none items-center justify-between py-4 font-semibold [&::-webkit-details-marker]:hidden">{copy.delivery}<ChevronDown size={16} className="text-accent transition-transform group-open:rotate-180" /></summary><p className="pb-5 leading-7 text-muted">{copy.deliveryBody}</p></details></div>
    </aside></section>
    <MobileProductActions added={added} disabled={variant.stock === 0} regionLabel={locale === 'fr' ? 'Actions d’achat sur mobile' : 'إجراءات الشراء على الهاتف'} addLabel={t('addToCart')} orderLabel={copy.directOrder} compactOrderLabel={locale === 'fr' ? 'Commander' : 'اطلبي'} onAdd={add} onOrder={orderDirectly} />
    <section className="border-t border-line bg-white py-12 lg:py-16"><div className="container-shell"><p className="eyebrow">{copy.related}</p><h2 className="display mt-2 text-4xl font-semibold">{copy.relatedTitle}</h2><div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">{products.filter((item) => item.id !== product.id).slice(0, 4).map((item) => <ProductCard key={item.id} product={item} />)}</div></div></section>
  </main>
}
