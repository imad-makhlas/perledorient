import { ArrowUpRight, Ruler, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ProductSummary } from '../../features/catalog/catalog'
import { useI18n } from '../../i18n/i18n'
import { formatMoney } from '../../lib/format'

export function ProductCard({ product }: { product: ProductSummary }) {
  const { locale, t } = useI18n()
  const discount = product.comparisonPrice ? Math.round((1 - product.price / product.comparisonPrice) * 100) : 0
  const availabilityLabel = product.stock <= 0 ? t('outOfStock') : product.stock <= 5 ? t('lowStock') : t('inStock')
  const availabilityTone = product.stock <= 0
    ? 'bg-red-50 text-red-800'
    : product.stock <= 5
      ? 'bg-amber-50 text-amber-800'
      : 'bg-emerald-50 text-emerald-800'

  return <article className="group h-full min-w-0 overflow-hidden border border-line bg-white transition duration-500 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(64,16,31,0.10)]">
    <Link to={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-[#F3F1ED]">
      <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" />
      <div className="absolute inset-0 bg-ink/0 transition duration-500 group-hover:bg-ink/10" />
      <div className="absolute left-3 top-3 flex flex-col gap-2">{product.isNew && <span className="bg-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.14em] text-ink">New</span>}{discount > 0 && <span className="bg-accent px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.14em] text-midnight">-{discount}%</span>}</div>
      <span className="absolute bottom-3 right-3 grid h-11 w-11 translate-y-2 place-items-center bg-white text-ink opacity-0 shadow-lift transition group-hover:translate-y-0 group-hover:opacity-100"><ShoppingBag size={17} strokeWidth={1.5} /></span>
    </Link>
    <div className="flex min-h-[205px] flex-col px-4 py-5">
      <p className="text-[10px] font-bold uppercase tracking-[.16em] text-accent sm:text-[11px]">{product.material ?? product.category}</p>
      <Link to={`/products/${product.slug}`} className="mt-2.5 flex items-start justify-between gap-3">
        <h3 className="display text-[1.2rem] font-semibold leading-[1.15] text-ink sm:text-[1.4rem]">{product.name}</h3>
        <ArrowUpRight size={16} className="mt-1 shrink-0 text-ink/30 transition group-hover:text-accent" />
      </Link>
      {product.dimensions && <div className="mt-4 flex items-center gap-2 border-y border-line/70 py-3 text-[11px] leading-snug text-muted sm:text-[12px]"><Ruler size={14} strokeWidth={1.5} className="shrink-0 text-accent" /><span><strong className="font-semibold text-ink/70">{locale === 'fr' ? 'Taille' : 'Size'}</strong><span className="mx-1.5 text-accent">·</span>{product.dimensions}</span></div>}
      <div className="mt-auto flex flex-col items-start gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1"><span className="text-[15px] font-semibold text-ink sm:text-[16px]">{formatMoney(product.price, locale)}</span>{product.comparisonPrice && <span className="text-[12px] font-normal text-muted line-through">{formatMoney(product.comparisonPrice, locale)}</span>}</div>
        <p className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[.08em] ${availabilityTone}`}><span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />{availabilityLabel}</p>
      </div>
    </div>
  </article>
}
