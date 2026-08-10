import { ArrowRight, Gem, Headphones, MapPin, MessageCircle, PackageCheck, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../features/catalog/catalog'
import { useCatalogProducts } from '../features/catalog/catalog-api'
import { selectHomeProducts } from '../features/catalog/home-product-selection'
import { useI18n } from '../i18n/i18n'

const homeCopy = {
  fr: {
    signatures: ['Fait main', 'Petites séries', 'Maroc et international'], imageAlt: 'Collection de bijoux artisanaux Casa de Perla', imageCaption: 'Créés lentement. Portés longtemps.', categoryTitle: 'Trouvez votre pièce.', categoriesLabel: 'Sélection de bijoux', featuredBody: 'Façonnée à la main en petite série, chaque pièce porte de subtiles variations qui la rendent unique.', deliveryDetail: '48 à 72 h dans les grandes villes', paymentDetail: 'Confirmation sur WhatsApp', supportDetail: 'Un conseil humain et direct',
  },
  ar: {
    signatures: ['صنع يدوي', 'مجموعات محدودة', 'المغرب ودولياً'], imageAlt: 'مجموعة مجوهرات Casa de Perla المصنوعة يدوياً', imageCaption: 'صُنعت بعناية. لترافقك دائماً.', categoryTitle: 'اختاري قطعتك.', categoriesLabel: 'تشكيلة من المجوهرات', featuredBody: 'تُنجز كل قطعة يدوياً ضمن مجموعات محدودة، وتحمل تفاصيل دقيقة تجعلها خاصة بك.', deliveryDetail: 'من 48 إلى 72 ساعة في المدن الكبرى', paymentDetail: 'التأكيد عبر واتساب', supportDetail: 'مساعدة شخصية ومباشرة',
  },
} as const

const orderingCopy = {
  fr: {
    eyebrow: 'Commande WhatsApp', title: 'Comment commander ?', aria: 'Comment commander', intro: 'Votre commande, préparée personnellement en quelques étapes.',
    steps: [
      ['Choisissez votre bijou', 'Découvrez la collection et ouvrez la fiche de la pièce qui vous plaît.'],
      ['Renseignez la livraison', 'Ajoutez vos coordonnées, votre ville et l’adresse de réception.'],
      ['Confirmez sur WhatsApp', 'Nous confirmons personnellement le stock, la livraison et votre commande.'],
    ],
  },
  ar: {
    eyebrow: 'طلب عبر واتساب', title: 'كيف تطلبين؟', aria: 'كيفية الطلب', intro: 'طلبك يُحضّر بعناية وبشكل شخصي في خطوات بسيطة.',
    steps: [
      ['اختاري مجوهراتك', 'تصفحي المجموعة وافتحي صفحة القطعة التي أعجبتك.'],
      ['أدخلي معلومات التوصيل', 'أضيفي معلوماتك ومدينتك وعنوان الاستلام.'],
      ['أكدي عبر واتساب', 'نؤكد لك شخصياً التوفر والتوصيل وتفاصيل الطلب.'],
    ],
  },
} as const

const orderingIcons = [Gem, MapPin, MessageCircle] as const
const orderingStepColors = [
  'bg-[#B88632] text-[#FFF9EF]',
  'bg-[#68705B] text-white',
  'bg-[#302B2D] text-[#E2BB72]',
] as const

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
  const ordering = orderingCopy[locale]
  return <main>
    <section data-testid="mobile-home-banner" className="container-shell py-3 sm:hidden">
      <div className="image-frame">
        <div className="overflow-hidden rounded-[6px] border border-line bg-white shadow-[0_10px_24px_rgba(48,43,45,.08)]">
          <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=90" alt={page.imageAlt} className="h-24 w-full object-cover object-center" />
          <div className="px-4 py-2">
            <p className="text-[7px] font-bold uppercase tracking-[.24em] text-accent">Casa de Perla</p>
            <p className="display mt-1 text-[15px] font-semibold leading-tight text-ink">{page.imageCaption}</p>
          </div>
        </div>
      </div>
    </section>

    <section data-testid="home-hero" className="hidden overflow-hidden border-b border-line bg-white sm:block">
      <div className="container-shell grid items-center md:grid-cols-[46%_54%]">
        <div className="relative flex items-center py-8 md:pr-10 lg:py-12 lg:pr-12 xl:py-14 xl:pr-16">
          <span className="absolute left-0 top-7 display text-[5rem] font-semibold leading-none text-burgundy/[.04] lg:text-[6.5rem] xl:text-[8rem]">CP</span>
          <div className="relative max-w-xl">
            <p className="editorial-rule">{t('heroEyebrow')}</p>
            <h1 className="display mt-4 text-[2.35rem] font-semibold leading-[.98] text-ink sm:text-5xl lg:mt-5 lg:text-[clamp(2.75rem,4vw,3.5rem)]">{t('heroTitle')}</h1>
            <p className="mt-4 max-w-md text-[15px] leading-7 text-ink/60 sm:mt-5">{t('heroBody')}</p>
            <div className="mt-6 flex flex-wrap items-center gap-5"><Link to="/catalogue" className="button-primary button-accent">{t('explore')}<ArrowRight size={15} /></Link><Link to="/about" className="border-b border-burgundy pb-1 text-[10px] font-bold uppercase tracking-[.16em] text-burgundy">{t('story')}</Link></div>
            <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-line pt-4 text-[9px] font-bold uppercase tracking-[.14em] text-ink/45"><span>{page.signatures[0]}</span><span className="h-px w-5 bg-accent" /><span>{page.signatures[1]}</span><span className="h-px w-5 bg-accent" /><span>{page.signatures[2]}</span></div>
          </div>
        </div>
        <div className="relative pb-6 md:py-7 md:pl-8 xl:pl-10">
          <div className="image-frame h-[230px] sm:h-[280px] md:h-[350px] lg:h-[clamp(350px,31vw,410px)]">
            <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1800&q=92" alt={page.imageAlt} className="h-full w-full object-cover object-center" />
            <div className="absolute bottom-0 left-0 bg-ivory px-6 py-5 sm:px-8"><p className="text-[9px] font-bold uppercase tracking-[.24em] text-accent">Casa de Perla</p><p className="display mt-1 text-2xl font-semibold text-ink">{page.imageCaption}</p></div>
          </div>
        </div>
      </div>
    </section>

    <section className="container-shell pb-8 pt-2 sm:py-12 lg:py-20">
      <div className="mb-9 flex items-end justify-between"><div><p className="editorial-rule">{t('categories')}</p><h2 className="display mt-4 text-4xl font-semibold sm:text-5xl">{page.categoryTitle}</h2></div><Link to="/catalogue" className="hidden items-center gap-2 border-b border-ink pb-2 text-[10px] font-bold uppercase tracking-[.18em] md:flex">{t('viewAll')}<ArrowRight size={14} /></Link></div>
      <div data-testid="mobile-home-products" role="region" aria-label={page.categoriesLabel} className="grid grid-cols-2 gap-3 sm:hidden">{homeProducts.map((product, index) => <EditorialProductCard key={product.id} product={product} index={index} mobile />)}</div>
      <div data-testid="desktop-home-products" className="hidden sm:grid sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">{homeProducts.map((product, index) => <EditorialProductCard key={product.id} product={product} index={index} />)}</div>
      <div className="mt-8 text-center md:hidden"><Link to="/catalogue" className="button-primary">{t('viewAll')}<ArrowRight size={15} /></Link></div>
    </section>

    <section className="hidden border-y border-[#DED4C8] bg-[#F3EFE7] py-12 sm:block lg:py-16" aria-label={ordering.aria}>
      <div className="container-shell">
        <div className="mx-auto max-w-2xl text-center"><p className="text-[9px] font-bold uppercase tracking-[.24em] text-[#98702F]">{ordering.eyebrow}</p><h2 className="display mt-4 text-4xl font-semibold text-[#302B2D] sm:text-5xl">{ordering.title}</h2><p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-[#766C68]">{ordering.intro}</p></div>
        <ol className="relative mx-auto mt-10 grid max-w-6xl gap-8 md:grid-cols-3 md:gap-0 lg:mt-12">
          <span aria-hidden="true" className={`absolute bottom-5 top-5 w-px bg-gradient-to-b from-[#B88632]/15 via-[#B88632]/65 to-[#B88632]/15 md:bottom-auto md:left-[16.66%] md:right-[16.66%] md:top-7 md:h-px md:w-auto md:bg-gradient-to-r ${locale === 'ar' ? 'right-6 md:right-[16.66%]' : 'left-6 md:left-[16.66%]'}`} />
          {ordering.steps.map(([title, body], index) => {
            const Icon = orderingIcons[index]
            return <li key={title} data-order-step className={`relative z-[1] grid grid-cols-[48px_minmax(0,1fr)] gap-5 ${locale === 'ar' ? 'pr-0' : 'pl-0'} md:block md:px-8 md:text-center`}><div className="relative"><span className={`grid h-12 w-12 place-items-center rounded-full ring-[7px] ring-[#F3EFE7] shadow-[0_6px_18px_rgba(48,43,45,.10)] ${orderingStepColors[index]}`}><Icon size={18} strokeWidth={1.5} /></span></div><div className="pt-0.5 md:pt-0"><span className="text-[9px] font-bold uppercase tracking-[.2em] text-[#A17A3B]">0{index + 1}</span><h3 className="display mt-2 text-xl font-semibold text-[#302B2D] md:mt-4">{title}</h3><p className="mt-2 text-sm leading-6 text-[#766C68] md:mx-auto md:max-w-[280px]">{body}</p></div></li>
          })}
        </ol>
      </div>
    </section>

    <section className="container-shell grid py-12 md:grid-cols-3 lg:py-16">{[[PackageCheck, t('trustDelivery'), page.deliveryDetail], [ShieldCheck, t('trustPayment'), page.paymentDetail], [Headphones, t('trustSupport'), page.supportDetail]].map(([Icon, title, body], index) => <div key={String(title)} className={`px-6 py-5 md:px-9 ${index > 0 ? 'border-t border-line md:border-l md:border-t-0' : ''}`}><Icon size={22} strokeWidth={1.25} className="text-accent" /><h3 className="display mt-4 text-xl font-semibold">{String(title)}</h3><p className="mt-2 text-sm text-muted">{String(body)}</p></div>)}</section>

  </main>
}
