import { Instagram, Search, ShoppingBag, Truck } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Logo } from '../brand/Logo'
import { INSTAGRAM_URL } from '../../config/social-links'
import { useCart } from '../../features/cart/cart-context'
import { useI18n } from '../../i18n/i18n'
import { getHeaderAnnouncementParts } from './header-announcement'
import { isHeaderLinkActive } from './header-nav'

export function Header() {
  const { count } = useCart()
  const { locale, setLocale, t } = useI18n()
  const location = useLocation()
  const announcement = getHeaderAnnouncementParts(locale)
  const links = [['/', locale === 'fr' ? 'Accueil' : 'الرئيسية'], ['/catalogue', locale === 'fr' ? 'Catalogue' : 'الكتالوج'], ['/about', t('storyNav')], ['/contact', locale === 'fr' ? 'Contact' : 'تواصل معنا']]

  return <>
    <div role="region" aria-label={locale === 'fr' ? 'Informations de livraison' : 'معلومات التوصيل'} className="border-b border-accent/25 bg-black px-3 text-white">
      <div className="mx-auto flex min-h-[30px] max-w-5xl flex-wrap items-center justify-center gap-x-2.5 gap-y-0 text-center text-[7px] font-semibold uppercase leading-4 tracking-[.1em] sm:flex-nowrap sm:text-[9px] sm:tracking-[.14em]">
        <Truck size={13} strokeWidth={1.6} className="shrink-0 text-accent" aria-hidden="true" />
        <span>{announcement.lead} <strong className="font-bold text-accent">{announcement.threshold}</strong> {announcement.country}</span>
        <span className="h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
        <span>{announcement.international}</span>
      </div>
    </div>
    <header className="sticky top-0 z-40 bg-transparent py-2 backdrop-blur-md lg:py-3">
      <div className="container-shell flex h-[58px] items-center justify-between gap-4 rounded-[6px] bg-[#302A2E] px-4 text-ivory shadow-[0_14px_36px_rgba(64,16,31,0.16)] sm:h-[62px] sm:px-5 lg:h-[68px] lg:gap-6 lg:rounded-[6px] lg:px-7">
        <span className="hidden sm:block"><Logo tone="light" /></span><span className="sm:hidden"><Logo tone="light" compact /></span>
        <nav className="hidden items-center gap-6 lg:flex lg:gap-9" aria-label="Primary navigation">{links.map(([to, label]) => { const active = isHeaderLinkActive(location.pathname, location.search, to); return <Link key={to} to={to} className={`relative whitespace-nowrap text-[10px] font-semibold uppercase tracking-[.2em] transition-colors hover:text-accent ${active ? 'text-white after:absolute after:-bottom-3 after:left-0 after:h-px after:w-full after:bg-accent' : 'text-white/55'}`}>{label}</Link> })}</nav>
        <div className="flex shrink-0 items-center gap-2 text-ivory sm:gap-3">
          <div
            role="group"
            aria-label={locale === 'fr' ? 'Choisir la langue' : 'اختيار اللغة'}
            className="grid h-9 w-[78px] shrink-0 grid-cols-2 rounded-full border border-white/20 bg-white/[.06] p-0.5 shadow-inner sm:w-[84px]"
          >
            <button
              type="button"
              onClick={() => setLocale('fr')}
              aria-label="Français"
              aria-pressed={locale === 'fr'}
              className={`grid min-w-0 place-items-center rounded-full text-[10px] font-bold uppercase tracking-[.08em] transition-all ${locale === 'fr' ? 'bg-accent text-[#241F21] shadow-sm' : 'text-white/70 hover:text-white'}`}
            >
              FR
            </button>
            <button
              type="button"
              onClick={() => setLocale('ar')}
              aria-label="العربية"
              aria-pressed={locale === 'ar'}
              className={`grid min-w-0 place-items-center rounded-full text-[10px] font-bold uppercase tracking-[.08em] transition-all ${locale === 'ar' ? 'bg-accent text-[#241F21] shadow-sm' : 'text-white/70 hover:text-white'}`}
            >
              AR
            </button>
          </div>
          <Link to="/catalogue" aria-label={t('search')} className="hidden transition-colors hover:text-accent lg:inline-flex"><Search size={19} strokeWidth={1.6} /></Link>
          <Link to="/cart" className="relative transition-colors hover:text-accent" aria-label={`${t('cart')}: ${count}`}><ShoppingBag size={20} strokeWidth={1.6} />{count > 0 && <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[9px] font-bold text-midnight">{count}</span>}</Link>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram Casa de Perla" className="hidden transition-colors hover:text-accent lg:inline-flex"><Instagram size={19} strokeWidth={1.6} /></a>
        </div>
      </div>
    </header>
  </>
}

