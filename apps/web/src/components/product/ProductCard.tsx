import { MessageCircle, ShoppingBag } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import type { Product } from '../../features/catalog/catalog'
import { addCartItem, clearCart } from '../../features/cart/cart'
import { useCart } from '../../features/cart/cart-context'
import { useI18n } from '../../i18n/i18n'
import { formatMoney } from '../../lib/format'

export function ProductCard({ product }: { product: Product }) {
  const { locale, t } = useI18n()
  const { dispatch } = useCart()
  const navigate = useNavigate()
  const discount = product.comparisonPrice ? Math.round((1 - product.price / product.comparisonPrice) * 100) : 0
  const availabilityLabel = product.stock <= 0 ? t('outOfStock') : product.stock <= 5 ? t('lowStock') : t('inStock')
  const availabilityTone = product.stock <= 0
    ? 'bg-red-50 text-red-800'
    : product.stock <= 5
      ? 'bg-amber-50 text-amber-800'
      : 'bg-emerald-50 text-emerald-800'
  const orderDirectly = () => {
    const variant = product.variants.find((item) => item.stock > 0)
    if (!variant) return
    dispatch(clearCart())
    dispatch(addCartItem({
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      name: product.name,
      variantName: variant.name,
      imageUrl: variant.image ?? product.image,
      unitPrice: variant.price,
      stockQuantity: variant.stock,
    }))
    navigate('/checkout')
  }

  return <article className="group h-full min-w-0 overflow-hidden rounded-[6px] border border-line bg-white p-0 shadow-[0_10px_32px_rgba(47,42,44,0.045)] transition duration-500 hover:-translate-y-1 hover:border-champagne hover:shadow-[0_20px_50px_rgba(47,42,44,0.10)]">
    <Link to={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-[#F3F1ED]">
      <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" />
      <div className="absolute inset-0 bg-ink/0 transition duration-500 group-hover:bg-ink/[.06]" />
      <div className="absolute left-3 top-3 flex flex-col gap-2">{product.isNew && <span className="bg-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.14em] text-ink">{locale === 'fr' ? 'Nouveau' : 'جديد'}</span>}{discount > 0 && <span className="bg-accent px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.14em] text-midnight">-{discount}%</span>}</div>
      <span className="absolute bottom-3 right-3 grid h-10 w-10 translate-y-2 place-items-center border border-white/70 bg-white text-burgundy opacity-0 shadow-lift transition group-hover:translate-y-0 group-hover:opacity-100"><ShoppingBag size={16} strokeWidth={1.5} /></span>
    </Link>
    <div className="flex flex-col px-4 pb-4 pt-4 sm:px-5 sm:pb-5 sm:pt-5">
      <Link to={`/products/${product.slug}`} className="block">
        <h3 className="display line-clamp-2 text-[1.05rem] font-semibold leading-[1.16] text-ink sm:text-[1.15rem]">{product.name}</h3>
      </Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1"><span className="text-[15px] font-semibold text-ink sm:text-[16px]">{formatMoney(product.price, locale)}</span>{product.comparisonPrice && <span className="text-[12px] font-normal text-muted line-through">{formatMoney(product.comparisonPrice, locale)}</span>}</div>
        <p className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[.08em] ${availabilityTone}`}><span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />{availabilityLabel}</p>
      </div>
      <button type="button" onClick={orderDirectly} disabled={product.stock <= 0} aria-label={locale === 'fr' ? `Commander ${product.name} via WhatsApp` : `طلب ${product.name} عبر واتساب`} className="product-order-button mt-3 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[6px] px-2 text-[9px] font-bold uppercase tracking-[.08em] disabled:cursor-not-allowed sm:px-3 sm:tracking-[.1em]"><MessageCircle size={15} className="shrink-0" aria-hidden="true" />{locale === 'fr' ? 'Commander via WhatsApp' : 'الطلب عبر واتساب'}</button>
    </div>
  </article>
}
