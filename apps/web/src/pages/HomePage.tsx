import { ArrowRight, Headphones, PackageCheck, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { categories, products } from '../data/jewelry-products'
import { categoryLabel, type CatalogCategory } from '../features/catalog/catalog-ui'
import { useI18n } from '../i18n/i18n'

export function HomePage() {
  const { locale, t } = useI18n()
  return <main>
    <section className="overflow-hidden border-b border-line bg-white">
      <div className="container-shell grid items-center md:grid-cols-[48%_52%]">
        <div className="relative flex items-center py-12 md:pr-8 lg:py-16 lg:pr-12">
          <span className="absolute left-0 top-7 display text-[5rem] font-semibold leading-none text-burgundy/[.04] lg:text-[8rem]">PO</span>
          <div className="relative max-w-xl">
            <p className="editorial-rule">{t('heroEyebrow')}</p>
            <h1 className="display mt-5 text-4xl font-semibold leading-[.96] tracking-[-.03em] text-ink sm:text-5xl lg:text-[3.75rem]">{t('heroTitle')}</h1>
            <p className="mt-5 max-w-lg text-sm leading-6 text-ink/60 sm:text-[15px]">{t('heroBody')}</p>
            <div className="mt-7 flex flex-wrap gap-3"><Link to="/catalogue" className="button-primary">{t('explore')}<ArrowRight size={15} /></Link><Link to="/about" className="button-primary border-line bg-white text-ink hover:border-ink hover:bg-white">{t('story')}</Link></div>
            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-4 text-[9px] font-bold uppercase tracking-[.18em] text-ink/45"><span>Handmade</span><span className="h-1 w-1 rounded-full bg-accent" /><span>Small series</span><span className="h-1 w-1 rounded-full bg-accent" /><span>Morocco & worldwide</span></div>
          </div>
        </div>
        <div className="relative pb-6 md:py-8 md:pl-8 lg:pl-10">
          <div className="image-frame h-[260px] md:h-[360px] lg:h-[440px]">
            <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1800&q=92" alt="Perle d'Orient handcrafted jewelry collection" className="h-full w-full object-cover object-center" />
            <div className="absolute bottom-0 left-0 bg-ivory px-6 py-5 sm:px-8"><p className="text-[9px] font-bold uppercase tracking-[.24em] text-accent">Perle d'Orient</p><p className="display mt-1 text-2xl font-semibold text-ink">Made slowly. Worn often.</p></div>
          </div>
        </div>
      </div>
    </section>

    <section className="container-shell py-20 lg:py-28">
      <div className="mb-12 flex items-end justify-between"><div><p className="editorial-rule">{t('categories')}</p><h2 className="display mt-4 text-4xl font-semibold tracking-[-.02em] sm:text-6xl">Find your piece.</h2></div><Link to="/catalogue" className="hidden items-center gap-2 border-b border-ink pb-2 text-[10px] font-bold uppercase tracking-[.18em] md:flex">{t('viewAll')}<ArrowRight size={14} /></Link></div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">{categories.map((category, index) => <Link key={category.name} to={`/catalogue?category=${category.name}`} className="group relative aspect-[4/5] overflow-hidden bg-burgundy sm:aspect-[5/6] lg:aspect-[4/5]"><img src={category.image} alt={categoryLabel(category.name as CatalogCategory, locale)} className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.025]" /><div className="absolute inset-0 bg-gradient-to-t from-burgundy/95 via-burgundy/15 to-black/5" /><div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white sm:p-7"><div><p className="text-[9px] font-bold uppercase tracking-[.24em] text-champagne">0{index + 1}</p><p className="display mt-2 text-xl font-semibold tracking-[-.02em] sm:text-3xl">{categoryLabel(category.name as CatalogCategory, locale)}</p></div><span className="grid h-10 w-10 shrink-0 place-items-center border border-white/45 transition duration-300 group-hover:border-champagne group-hover:bg-champagne group-hover:text-burgundy"><ArrowRight size={15} /></span></div></Link>)}</div>
    </section>

    <section className="border-y border-line bg-white py-20 lg:py-28"><div className="container-shell"><div className="mb-12 grid gap-5 md:grid-cols-[1fr_auto] md:items-end"><div><p className="editorial-rule">{t('featured')}</p><h2 className="display mt-4 max-w-3xl text-4xl font-semibold tracking-[-.02em] sm:text-6xl">{t('discover')}</h2></div><p className="max-w-sm text-sm leading-7 text-muted">Hand-finished in small series, each piece carries subtle variations that make it distinctly yours.</p></div><div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 lg:gap-6">{products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div><div className="mt-14 text-center"><Link to="/catalogue" className="button-primary border-line bg-white text-ink hover:border-ink hover:bg-white">{t('viewAll')}<ArrowRight size={15} /></Link></div></div></section>

    <section className="container-shell grid py-16 md:grid-cols-3 lg:py-20">{[[PackageCheck, t('trustDelivery'), locale === 'fr' ? '48-72h dans les grandes villes' : '48-72h to major cities'], [ShieldCheck, t('trustPayment'), locale === 'fr' ? 'Confirmation WhatsApp' : 'WhatsApp confirmation'], [Headphones, t('trustSupport'), locale === 'fr' ? 'Un conseil humain et direct' : 'Personal, direct assistance']].map(([Icon, title, body], index) => <div key={String(title)} className={`px-6 py-5 md:px-10 ${index > 0 ? 'border-t border-line md:border-l md:border-t-0' : ''}`}><Icon size={23} strokeWidth={1.3} className="text-accent" /><h3 className="display mt-5 text-2xl font-semibold">{String(title)}</h3><p className="mt-2 text-sm text-muted">{String(body)}</p></div>)}</section>

  </main>
}
