import { Check, ChevronRight, Minus, Plus, Share2, ShoppingBag } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { products } from '../data/jewelry-products'
import { addCartItem } from '../features/cart/cart'
import { useCart } from '../features/cart/cart-context'
import { useI18n } from '../i18n/i18n'
import { formatMoney } from '../lib/format'

export function ProductPage() {
  const { slug } = useParams()
  const product = products.find((item) => item.slug === slug) ?? products[0]
  const [variantId, setVariantId] = useState(product.variants[0].id)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { dispatch } = useCart()
  const { locale, t } = useI18n()
  const variant = useMemo(() => product.variants.find((item) => item.id === variantId) ?? product.variants[0], [product, variantId])
  const add = () => { dispatch(addCartItem({ productId: product.id, variantId: variant.id, slug: product.slug, name: product.name, variantName: variant.name, imageUrl: variant.image ?? product.image, unitPrice: variant.price, stockQuantity: variant.stock }, quantity)); setAdded(true); setTimeout(() => setAdded(false), 1800) }
  return <main><div className="container-shell py-6 text-[10px] font-semibold uppercase tracking-widest text-muted"><Link to="/catalogue">Shop</Link><ChevronRight className="mx-2 inline" size={12} />{product.category}<ChevronRight className="mx-2 inline" size={12} />{product.name}</div>
    <section className="container-shell grid gap-10 pb-16 lg:grid-cols-[1.12fr_.88fr] lg:gap-16"><div className="aspect-[4/4.7] overflow-hidden bg-white"><img src={variant.image ?? product.image} alt={product.name} className="h-full w-full object-cover" /></div><div className="self-center lg:py-10"><p className="eyebrow">{product.brand}</p><h1 className="display mt-3 text-5xl font-semibold leading-none sm:text-6xl">{product.name}</h1><div className="mt-5 flex items-baseline gap-3"><span className="text-xl font-bold">{formatMoney(variant.price, locale)}</span>{product.comparisonPrice && <span className="text-sm text-muted line-through">{formatMoney(product.comparisonPrice, locale)}</span>}</div><p className="mt-7 border-y border-line py-6 text-sm leading-7 text-muted">{product.shortDescription}</p>
      <div className="mt-7"><div className="mb-3 flex items-center justify-between"><label className="text-[10px] font-bold uppercase tracking-widest">Select finish</label><span className={`text-[10px] font-bold uppercase tracking-widest ${variant.stock > 0 ? 'text-emerald-700' : 'text-red-700'}`}>{variant.stock > 0 ? `${variant.stock <= 5 ? t('lowStock') : t('inStock')} · ${variant.sku}` : t('outOfStock')}</span></div><div className="grid grid-cols-2 gap-2">{product.variants.map((item) => <button key={item.id} disabled={item.stock === 0} onClick={() => { setVariantId(item.id); setQuantity(1) }} className={`border px-4 py-3 text-left text-xs font-semibold transition ${item.id === variant.id ? 'border-ink bg-ink text-white' : 'border-line bg-white hover:border-accent'} disabled:cursor-not-allowed disabled:opacity-40`}>{item.name}<span className="mt-1 block text-[10px] font-normal opacity-65">{formatMoney(item.price, locale)}</span></button>)}</div></div>
      <div className="mt-7 flex gap-3"><div className="flex h-12 items-center border border-line bg-white"><button className="grid h-full w-11 place-items-center" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity"><Minus size={15} /></button><span className="w-8 text-center text-sm font-semibold">{quantity}</span><button className="grid h-full w-11 place-items-center" onClick={() => setQuantity(Math.min(variant.stock, quantity + 1))} aria-label="Increase quantity"><Plus size={15} /></button></div><button onClick={add} disabled={variant.stock === 0} className="button-primary flex-1 disabled:cursor-not-allowed disabled:opacity-45">{added ? <><Check size={17} />Added</> : <><ShoppingBag size={17} />{t('addToCart')}</>}</button><button className="grid h-12 w-12 place-items-center border border-line bg-white" aria-label="Share"><Share2 size={17} /></button></div>
      <a href={`https://wa.me/212600000000?text=${encodeURIComponent(`Hello Perle d'Orient, I would like to order ${product.name} - ${variant.name}.`)}`} target="_blank" rel="noreferrer" className="mt-3 flex min-h-12 items-center justify-center border border-[#25D366] text-[11px] font-bold uppercase tracking-widest text-[#128C4A]">Order this piece on WhatsApp</a>
      <div className="mt-8 divide-y divide-line border-y border-line text-sm"><details className="py-5" open><summary className="cursor-pointer font-semibold">Description</summary><p className="mt-3 leading-7 text-muted">{product.description}</p></details><details className="py-5"><summary className="cursor-pointer font-semibold">Specifications</summary><dl className="mt-3 space-y-2">{Object.entries(product.specifications).map(([key, value]) => <div key={key} className="flex justify-between gap-4 text-muted"><dt>{key}</dt><dd className="font-medium text-ink">{value}</dd></div>)}</dl></details><details className="py-5"><summary className="cursor-pointer font-semibold">Delivery & returns</summary><p className="mt-3 leading-7 text-muted">Estimated delivery in 2–4 business days. Unused items may be returned within 7 days.</p></details></div>
    </div></section>
    <section className="bg-white py-16"><div className="container-shell"><p className="eyebrow">You may also like</p><h2 className="display mt-2 text-4xl font-semibold">Continue your edit.</h2><div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-7">{products.filter((item) => item.id !== product.id).slice(0, 4).map((item) => <ProductCard key={item.id} product={item} />)}</div></div></section>
  </main>
}
