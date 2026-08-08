import { ArrowRight, Headphones, PackageCheck, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { categories } from '../data/jewelry-products'
import { useCatalogProducts } from '../features/catalog/catalog-api'
import { categoryLabel, type CatalogCategory } from '../features/catalog/catalog-ui'
import { useI18n } from '../i18n/i18n'

const homeCopy = {
  fr: {
    signatures: ['Fait main', 'Petites séries', 'Maroc et international'], imageAlt: "Collection de bijoux artisanaux Perle d’Orient", imageCaption: 'Créés lentement. Portés longtemps.', categoryTitle: 'Trouvez votre pièce.', categoriesLabel: 'Catégories de bijoux', featuredBody: 'Façonnée à la main en petite série, chaque pièce porte de subtiles variations qui la rendent unique.', deliveryDetail: '48 à 72 h dans les grandes villes', paymentDetail: 'Confirmation sur WhatsApp', supportDetail: 'Un conseil humain et direct',
  },
  ar: {
    signatures: ['صنع يدوي', 'مجموعات محدودة', 'المغرب ودولياً'], imageAlt: 'مجموعة مجوهرات لؤلؤة الشرق المصنوعة يدوياً', imageCaption: 'صُنعت بعناية. لترافقك دائماً.', categoryTitle: 'اختاري قطعتك.', categoriesLabel: 'فئات المجوهرات', featuredBody: 'تُنجز كل قطعة يدوياً ضمن مجموعات محدودة، وتحمل تفاصيل دقيقة تجعلها خاصة بك.', deliveryDetail: 'من 48 إلى 72 ساعة في المدن الكبرى', paymentDetail: 'التأكيد عبر واتساب', supportDetail: 'مساعدة شخصية ومباشرة',
  },
} as const

export function HomePage() {
  const { locale, t } = useI18n()
  const products = useCatalogProducts(locale)
  const page = homeCopy[locale]
  return <main>
    <section className="overflow-hidden border-b border-line bg-white">
      <div className="container-shell grid items-center md:grid-cols-[46%_54%]">
        <div className="relative flex items-center py-8 md:pr-10 lg:py-14 lg:pr-16">
          <span className="absolute left-0 top-7 display text-[5rem] font-semibold leading-none text-burgundy/[.04] lg:text-[8rem]">PO</span>
          <div className="relative max-w-xl">
            <p className="editorial-rule">{t('heroEyebrow')}</p>
            <h1 className="display mt-4 text-[2.35rem] font-semibold leading-[.98] text-ink sm:text-5xl lg:mt-5 lg:text-[3.5rem]">{t('heroTitle')}</h1>
            <p className="mt-4 max-w-md text-[15px] leading-7 text-ink/60 sm:mt-5">{t('heroBody')}</p>
            <div className="mt-6 flex flex-wrap items-center gap-5"><Link to="/catalogue" className="button-primary button-accent">{t('explore')}<ArrowRight size={15} /></Link><Link to="/about" className="border-b border-burgundy pb-1 text-[10px] font-bold uppercase tracking-[.16em] text-burgundy">{t('story')}</Link></div>
            <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-line pt-4 text-[9px] font-bold uppercase tracking-[.14em] text-ink/45"><span>{page.signatures[0]}</span><span className="h-px w-5 bg-accent" /><span>{page.signatures[1]}</span><span className="h-px w-5 bg-accent" /><span>{page.signatures[2]}</span></div>
          </div>
        </div>
        <div className="relative pb-6 md:py-7 md:pl-8 lg:pl-10">
          <div className="image-frame h-[230px] sm:h-[280px] md:h-[350px] lg:h-[410px]">
            <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1800&q=92" alt={page.imageAlt} className="h-full w-full object-cover object-center" />
            <div className="absolute bottom-0 left-0 bg-ivory px-6 py-5 sm:px-8"><p className="text-[9px] font-bold uppercase tracking-[.24em] text-accent">Perle d'Orient</p><p className="display mt-1 text-2xl font-semibold text-ink">{page.imageCaption}</p></div>
          </div>
        </div>
      </div>
    </section>

    <section className="container-shell py-12 lg:py-20">
      <div className="mb-9 flex items-end justify-between"><div><p className="editorial-rule">{t('categories')}</p><h2 className="display mt-4 text-4xl font-semibold sm:text-5xl">{page.categoryTitle}</h2></div><Link to="/catalogue" className="hidden items-center gap-2 border-b border-ink pb-2 text-[10px] font-bold uppercase tracking-[.18em] md:flex">{t('viewAll')}<ArrowRight size={14} /></Link></div>
      <div role="region" aria-label={page.categoriesLabel} className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:grid-cols-3 lg:grid-cols-5 lg:gap-4">{categories.map((category, index) => <Link key={category.name} to={`/catalogue?category=${category.name}`} className="group relative aspect-[4/5] w-[76vw] max-w-[290px] shrink-0 snap-start overflow-hidden bg-burgundy sm:w-auto sm:max-w-none"><img src={category.image} alt={categoryLabel(category.name as CatalogCategory, locale)} className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.025]" /><div className="absolute inset-0 bg-gradient-to-t from-burgundy/95 via-burgundy/10 to-black/5" /><div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white"><div><p className="text-[8px] font-bold uppercase tracking-[.24em] text-champagne">0{index + 1}</p><p className="display mt-2 text-xl font-semibold">{categoryLabel(category.name as CatalogCategory, locale)}</p></div><span className="grid h-10 w-10 shrink-0 place-items-center border border-white/45 transition duration-300 group-hover:border-champagne group-hover:bg-champagne group-hover:text-burgundy"><ArrowRight size={14} /></span></div></Link>)}</div>
    </section>

    <section className="border-y border-line bg-[#FCFAF7] py-12 lg:py-20"><div className="container-shell"><div className="mb-8 grid gap-4 md:grid-cols-[1fr_auto] md:items-end lg:mb-10"><div><p className="editorial-rule">{t('featured')}</p><h2 className="display mt-4 max-w-3xl text-4xl font-semibold sm:text-5xl">{t('discover')}</h2></div><p className="max-w-sm text-[15px] leading-7 text-muted">{page.featuredBody}</p></div><div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4 lg:gap-5">{products.slice(0, 4).map((product) => <div key={product.id} className="w-[82vw] max-w-[330px] shrink-0 snap-start sm:w-auto sm:max-w-none"><ProductCard product={product} /></div>)}</div><div className="mt-9 text-center lg:mt-12"><Link to="/catalogue" className="button-primary">{t('viewAll')}<ArrowRight size={15} /></Link></div></div></section>

    <section className="container-shell grid py-12 md:grid-cols-3 lg:py-16">{[[PackageCheck, t('trustDelivery'), page.deliveryDetail], [ShieldCheck, t('trustPayment'), page.paymentDetail], [Headphones, t('trustSupport'), page.supportDetail]].map(([Icon, title, body], index) => <div key={String(title)} className={`px-6 py-5 md:px-9 ${index > 0 ? 'border-t border-line md:border-l md:border-t-0' : ''}`}><Icon size={22} strokeWidth={1.25} className="text-accent" /><h3 className="display mt-4 text-xl font-semibold">{String(title)}</h3><p className="mt-2 text-sm text-muted">{String(body)}</p></div>)}</section>

  </main>
}
