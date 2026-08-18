import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../features/catalog/catalog'
import { useCatalogProducts } from '../features/catalog/catalog-api'
import { selectHomeProducts } from '../features/catalog/home-product-selection'
import { useI18n } from '../i18n/i18n'

const homeCopy = {
  fr: {
    signatures: ['Fait main', 'Petites séries', 'Maroc et international'], imageAlt: 'Collection de bijoux artisanaux Casa de Perla', imageCaption: 'Créés lentement. Portés longtemps.', categoryTitle: 'Trouvez votre pièce.', categoriesLabel: 'Sélection de bijoux', featuredBody: 'Façonnée à la main en petite série, chaque pièce porte de subtiles variations qui la rendent unique.', trustLabel: 'Informations de confiance', trustEyebrow: 'Casa de Perla', trustTitle: 'Les engagements de la Maison', assurances: ['Paiement à la livraison', 'Virement bancaire', 'Livraison au Maroc', 'Confirmation WhatsApp'], assuranceDetails: ['Réglez simplement à la réception', 'Une alternative sécurisée sur demande', 'Délais communiqués avant confirmation', 'Stock et livraison vérifiés avec vous'],
  },
  ar: {
    signatures: ['صنع يدوي', 'مجموعات محدودة', 'المغرب ودولياً'], imageAlt: 'مجموعة مجوهرات Casa de Perla المصنوعة يدوياً', imageCaption: 'صُنعت بعناية. لترافقك دائماً.', categoryTitle: 'اختاري قطعتك.', categoriesLabel: 'تشكيلة من المجوهرات', featuredBody: 'تُنجز كل قطعة يدوياً ضمن مجموعات محدودة، وتحمل تفاصيل دقيقة تجعلها خاصة بك.', trustLabel: 'معلومات موثوقة', trustEyebrow: 'Casa de Perla', trustTitle: 'التزامات الدار', assurances: ['الدفع عند الاستلام', 'التحويل البنكي', 'التوصيل داخل المغرب', 'التأكيد عبر واتساب'], assuranceDetails: ['ادفعي بسهولة عند الاستلام', 'خيار آمن متاح عند الطلب', 'نؤكد مدة التوصيل قبل الطلب', 'نتحقق معك من التوفر والتوصيل'],
  },
} as const

function EditorialProductCard({ product, index, mobile = false }: { product: Product; index: number; mobile?: boolean }) {
  return <Link to={`/products/${product.slug}`} className={`group relative block aspect-[4/5] overflow-hidden bg-burgundy ${mobile ? 'w-full rounded-[6px]' : ''}`}>
    <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.025]" />
    <div className="absolute inset-0 bg-gradient-to-t from-burgundy/95 via-burgundy/10 to-black/5" />
    <div className={`absolute inset-x-0 bottom-0 flex items-end justify-between text-white ${mobile ? 'gap-2 p-3' : 'p-5'}`}>
      <div><p className={`${mobile ? 'text-[7px]' : 'text-[8px]'} font-bold uppercase tracking-[.24em] text-champagne`}>0{index + 1}</p><p className={`display font-semibold ${mobile ? 'mt-1.5 text-[.82rem] leading-[1.12]' : 'mt-2 text-xl'}`}>{product.name}</p></div>
      <span className={`grid shrink-0 place-items-center border border-white/45 transition duration-300 group-hover:border-champagne group-hover:bg-champagne group-hover:text-burgundy ${mobile ? 'h-8 w-8' : 'h-10 w-10'}`}><ArrowRight size={mobile ? 12 : 14} aria-hidden="true" /></span>
    </div>
  </Link>
}

export function HomePage() {
  const { locale, t } = useI18n()
  const products = useCatalogProducts(locale)
  const homeProducts = selectHomeProducts(products)
  const page = homeCopy[locale]
  const heroImage = homeProducts[0]?.image ?? products[0]?.image
  return <main>
    <section data-testid="home-hero" className="overflow-hidden border-b border-line bg-white">
      <Link to="/catalogue" aria-label={t('explore')} className="block">
        <img
          src={heroImage}
          alt={page.imageAlt}
          fetchPriority="high"
          className="h-[220px] w-full object-cover object-center sm:h-[340px] lg:h-[460px]"
        />
      </Link>
    </section>

    <section className="container-shell pb-10 pt-5 sm:py-12 lg:py-16">
      <div className="mb-7 flex items-end justify-between sm:mb-9"><div><p className="editorial-rule">{t('categories')}</p><h2 className="display mt-3 text-3xl font-semibold sm:text-4xl">{page.categoryTitle}</h2></div><Link to="/catalogue" className="hidden items-center gap-2 border-b border-ink pb-2 text-[10px] font-bold uppercase tracking-[.18em] md:flex">{t('viewAll')}<ArrowRight size={14} /></Link></div>
      <div data-testid="mobile-home-products" role="region" aria-label={page.categoriesLabel} className="grid grid-cols-2 gap-3 sm:hidden">{homeProducts.map((product, index) => <EditorialProductCard key={product.id} product={product} index={index} mobile />)}</div>
      <div data-testid="desktop-home-products" className="hidden sm:grid sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">{homeProducts.map((product, index) => <EditorialProductCard key={product.id} product={product} index={index} />)}</div>
      <div className="mt-8 text-center md:hidden"><Link to="/catalogue" className="button-primary">{t('viewAll')}<ArrowRight size={15} /></Link></div>
    </section>

    <section role="region" aria-label={page.trustLabel} className="border-y border-accent/45 bg-white py-10 sm:py-12 lg:py-16">
      <div className="container-shell grid gap-9 lg:grid-cols-[.72fr_1.55fr] lg:items-start lg:gap-20">
        <header className="lg:sticky lg:top-28"><p className="text-[9px] font-bold uppercase tracking-[.32em] text-accent">{page.trustEyebrow}</p><h2 className="editorial-display mt-3 max-w-sm text-[2.35rem] leading-[.98] text-[#3E3035] sm:text-5xl lg:text-[3.5rem]">{page.trustTitle}</h2><div aria-hidden="true" className="mt-7 flex items-center gap-3"><span className="h-px w-16 bg-accent" /><span className="text-[8px] text-accent">◆</span></div></header>
        <ol className="grid sm:grid-cols-2 sm:gap-x-10 lg:gap-x-14">
          {page.assurances.map((label, index) => <li key={label} className="border-t border-line py-5 sm:min-h-[142px] sm:py-6"><div className="flex items-center gap-3"><span data-testid="assurance-index" className="text-[10px] font-semibold tracking-[.22em] text-accent">0{index + 1}</span><span aria-hidden="true" className="h-px flex-1 bg-accent/25" /></div><h3 className="mt-5 text-[10px] font-bold uppercase leading-4 tracking-[.16em] text-[#4B2432]">{label}</h3><p className="mt-2 max-w-xs text-xs leading-5 text-muted">{page.assuranceDetails[index]}</p></li>)}
        </ol>
      </div>
    </section>

  </main>
}
