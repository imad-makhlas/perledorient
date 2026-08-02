import { Instagram, Search, ShoppingBag } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Logo } from '../brand/Logo'
import { INSTAGRAM_URL } from '../../config/social-links'
import { useCart } from '../../features/cart/cart-context'
import { useI18n } from '../../i18n/i18n'
import { getHeaderAnnouncement } from './header-announcement'
import { isHeaderLinkActive } from './header-nav'

export function Header() {
  const { count } = useCart()
  const { locale, setLocale, t } = useI18n()
  const location = useLocation()
  const links = [['/', locale === 'fr' ? 'Accueil' : 'Home'], ['/catalogue', 'Catalogue'], ['/about', t('storyNav')], ['/contact', 'Contact']]

  return <>
    <div className="bg-black px-3 py-2 text-center text-[8px] font-semibold uppercase tracking-[.12em] text-white sm:px-4 sm:py-2.5 sm:text-[10px] sm:tracking-[.22em]">{getHeaderAnnouncement(locale)}</div>
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="container-shell flex h-[74px] items-center justify-between gap-4 lg:h-[76px] lg:gap-6">
        <span className="hidden sm:block"><Logo /></span><span className="sm:hidden"><Logo compact /></span>
        <nav className="hidden items-center gap-6 lg:flex lg:gap-8" aria-label="Primary navigation">{links.map(([to, label]) => { const active = isHeaderLinkActive(location.pathname, location.search, to); return <Link key={to} to={to} className={`relative whitespace-nowrap text-[10px] font-semibold uppercase tracking-[.18em] transition hover:text-accent lg:text-[11px] ${active ? 'text-ink after:absolute after:-bottom-3 after:left-0 after:h-px after:w-full after:bg-accent' : 'text-ink/60'}`}>{label}</Link> })}</nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')} className="border-r border-line pr-2 text-[10px] font-bold uppercase tracking-wider sm:pr-3" aria-label="Change language">{locale === 'en' ? 'FR' : 'EN'}</button>
          <Link to="/catalogue" aria-label={t('search')}><Search size={19} strokeWidth={1.6} /></Link>
          <Link to="/cart" className="relative" aria-label={`${t('cart')}: ${count}`}><ShoppingBag size={20} strokeWidth={1.6} />{count > 0 && <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[9px] font-bold text-white">{count}</span>}</Link>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram Perle d'Orient" className="transition-colors hover:text-accent"><Instagram size={19} strokeWidth={1.6} /></a>
        </div>
      </div>
    </header>
  </>
}

