import { Check, ChevronRight, Minus, Plus, Share2, ShoppingBag } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { products } from '../data/jewelry-products'
import { addCartItem } from '../features/cart/cart'
import { useCart } from '../features/cart/cart-context'
import { useI18n } from '../i18n/i18n'
import { formatMoney } from '../lib/format'

const pageCopy = {
  en: { selectFinish: 'Select finish', added: 'Added', purchaseLabel: 'Product purchase details', description: 'Description', specifications: 'Specifications', delivery: 'Delivery & returns', deliveryBody: 'Estimated delivery in 2–4 business days. Unused pieces may be returned within 7 days.', related: 'You may also like', relatedTitle: 'Continue your discovery.' },
  fr: { selectFinish: 'Choisir la finition', added: 'Ajouté', purchaseLabel: "Détails d'achat du produit", description: 'Description', specifications: 'Caractéristiques', delivery: 'Livraison et retours', deliveryBody: 'Livraison estimée sous 2 à 4 jours ouvrés. Les pièces non portées peuvent être retournées sous 7 jours.', related: 'Vous aimerez aussi', relatedTitle: 'Continuez votre découverte.' },
} as const

export function ProductPage() {
  const { slug } = useParams()
  const product = products.find((item) => item.slug === slug) ?? products[0]
  const [variantId, setVariantId] = useState(product.variants[0].id)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle')
  const { dispatch } = useCart()
  const { locale, t } = useI18n()
  const copy = pageCopy[locale]
  const variant = useMemo(() => product.variants.find((item) => item.id === variantId) ?? product.variants[0], [product, variantId])
  const add = () => { dispatch(addCartItem({ productId: product.id, variantId: variant.id, slug: product.slug, name: product.name, variantName: variant.name, imageUrl: variant.image ?? product.image, unitPrice: variant.price, stockQuantity: variant.stock }, quantity)); setAdded(true); setTimeout(() => setAdded(false), 1800) }
  const share = async () => {
    const url = window.location.href
    const title = product.name
    const text = `${product.name} - Perle d'Orient`
    if (navigator.share) {
      await navigator.share({ title, text, url })
      return
    }
    await navigator.clipboard.writeText(url)
    setShareState('copied')
    window.setTimeout(() => setShareState('idle'), 1800)
  }
  const shareLabel = shareState === 'copied' ? (locale === 'fr' ? 'Lien copie' : 'Link copied') : (locale === 'fr' ? 'Partager' : 'Share')
  return <main className="bg-white"><div className="container-shell py-5 text-[9px] font-semibold uppercase tracking-[.16em] text-muted"><Link to="/catalogue" className="transition-colors hover:text-burgundy">{locale === 'fr' ? 'Boutique' : 'Shop'}</Link><ChevronRight className="mx-2 inline text-accent" size={11} />{product.category}<ChevronRight className="mx-2 inline text-accent" size={11} />{product.name}</div>
    <section className="container-shell grid gap-9 pb-16 lg:grid-cols-[1.04fr_.96fr] lg:items-start lg:gap-14"><div className="relative lg:sticky lg:top-32"><div className="absolute -left-2 -top-2 h-full w-full border border-accent/45" aria-hidden="true" /><div className="relative aspect-square overflow-hidden border border-line bg-ivory shadow-[0_22px_65px_rgba(64,16,31,.09)] lg:aspect-[5/4]"><img src={variant.image ?? product.image} alt={product.name} className="h-full w-full object-cover" /></div></div><aside aria-label={copy.purchaseLabel} className="rounded-[28px] border border-line bg-[#FFFDFC] p-6 shadow-[0_24px_70px_rgba(64,16,31,.08)] sm:p-8 lg:p-10"><p className="eyebrow">{product.brand}</p><h1 className="display mt-3 text-4xl font-semibold leading-[1.02] sm:text-5xl">{product.name}</h1><div className="mt-5 flex items-baseline gap-3"><span className="text-xl font-semibold">{formatMoney(variant.price, locale)}</span>{product.comparisonPrice && <span className="text-sm text-muted line-through">{formatMoney(product.comparisonPrice, locale)}</span>}</div><p className="mt-6 border-y border-line py-5 text-sm leading-7 text-muted sm:text-base">{product.shortDescription}</p>
      <div className="mt-7"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><span className="text-[10px] font-bold uppercase tracking-[.16em]">{copy.selectFinish}</span><span className={`rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.14em] ${variant.stock > 0 ? 'border-accent/35 bg-accent/10 text-burgundy' : 'border-line bg-white text-muted'}`}>{variant.stock > 0 ? `${variant.stock <= 5 ? t('lowStock') : t('inStock')} · ${variant.sku}` : t('outOfStock')}</span></div><div className="grid gap-2 sm:grid-cols-2">{product.variants.map((item) => <button key={item.id} disabled={item.stock === 0} onClick={() => { setVariantId(item.id); setQuantity(1) }} className={`rounded-xl border px-4 py-3.5 text-left text-xs font-semibold transition-colors ${item.id === variant.id ? 'border-[#302A2E] bg-[#302A2E] text-white' : 'border-line bg-white hover:border-accent'} disabled:cursor-not-allowed disabled:opacity-40`}>{item.name}<span className="mt-1 block text-[10px] font-normal opacity-65">{formatMoney(item.price, locale)}</span></button>)}</div></div>
      <div className="mt-6 grid grid-cols-[1fr_auto] gap-3 md:grid-cols-[auto_1fr_auto]"><div className="flex h-12 items-center justify-center rounded-xl border border-line bg-white"><button className="grid h-full w-11 place-items-center transition-colors hover:text-burgundy" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity"><Minus size={14} /></button><span className="w-9 text-center text-sm font-semibold">{quantity}</span><button className="grid h-full w-11 place-items-center transition-colors hover:text-burgundy" onClick={() => setQuantity(Math.min(variant.stock, quantity + 1))} aria-label="Increase quantity"><Plus size={14} /></button></div><button onClick={add} disabled={variant.stock === 0} className="button-primary !hidden min-w-0 px-4 disabled:cursor-not-allowed disabled:opacity-45 md:!inline-flex">{added ? <><Check size={17} />{copy.added}</> : <><ShoppingBag size={17} />{t('addToCart')}</>}</button><button type="button" onClick={share} className="grid h-12 w-12 place-items-center rounded-xl border border-line bg-white transition-colors hover:border-accent hover:text-burgundy" aria-label={shareLabel} title={shareLabel}>{shareState === 'copied' ? <Check size={17} /> : <Share2 size={17} />}</button></div>
      <div className="mt-8 divide-y divide-line border-y border-line text-sm"><details className="py-5" open><summary className="cursor-pointer font-semibold">{copy.description}</summary><p className="mt-3 leading-7 text-muted">{product.description}</p></details><details className="py-5"><summary className="cursor-pointer font-semibold">{copy.specifications}</summary><dl className="mt-3 space-y-2">{Object.entries(product.specifications).map(([key, value]) => <div key={key} className="flex justify-between gap-4 text-muted"><dt>{key}</dt><dd className="text-right font-medium text-ink">{value}</dd></div>)}</dl></details><details className="py-5"><summary className="cursor-pointer font-semibold">{copy.delivery}</summary><p className="mt-3 leading-7 text-muted">{copy.deliveryBody}</p></details></div>
    </aside></section>
    <div role="region" aria-label="Mobile purchase actions" className="fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-30 flex min-h-[68px] items-center gap-4 border-t border-line bg-white/95 px-4 py-2 shadow-[0_-12px_34px_rgba(64,16,31,.10)] backdrop-blur-md md:hidden"><div className="min-w-0"><p className="truncate text-[9px] font-bold uppercase tracking-[.14em] text-accent">{product.name}</p><p className="mt-1 text-sm font-semibold">{formatMoney(variant.price, locale)}</p></div><button onClick={add} disabled={variant.stock === 0} className="button-primary ml-auto min-h-[48px] min-w-0 px-4 disabled:cursor-not-allowed disabled:opacity-45">{added ? <><Check size={16} />{copy.added}</> : <><ShoppingBag size={16} />{t('addToCart')}</>}</button></div>
    <section className="border-t border-line bg-white py-12 lg:py-16"><div className="container-shell"><p className="eyebrow">{copy.related}</p><h2 className="display mt-2 text-4xl font-semibold">{copy.relatedTitle}</h2><div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">{products.filter((item) => item.id !== product.id).slice(0, 4).map((item) => <ProductCard key={item.id} product={item} />)}</div></div></section>
  </main>
}
