import { House, MessagesSquare, ScrollText, Store, type LucideIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useI18n } from '../../i18n/i18n'
import { isMobileNavigationLinkActive } from './mobile-bottom-navigation'

type MobileNavItemProps = {
  icon: LucideIcon
  label: string
  pathname: string
  to: string
}

function MobileNavItem({ icon: Icon, label, pathname, to }: MobileNavItemProps) {
  const active = isMobileNavigationLinkActive(pathname, to)

  return <Link
    to={to}
    aria-current={active ? 'page' : undefined}
    className="relative flex min-h-[56px] items-center justify-center bg-transparent px-1 transition-colors duration-200"
  >
    {active && <span className="absolute left-1/2 top-0 h-0.5 w-7 -translate-x-1/2 bg-accent" aria-hidden="true" />}
    <span className="flex min-h-[48px] flex-col items-center justify-center gap-1">
      <span className={`grid h-7 w-7 place-items-center transition-colors duration-200 ${active ? 'text-accent' : 'text-[#75676A]'}`}>
        <Icon size={21} strokeWidth={active ? 2 : 1.6} aria-hidden="true" />
      </span>
      <span className={`whitespace-nowrap text-[9px] font-semibold uppercase tracking-[.04em] sm:text-[10px] ${active ? 'text-[#2F2A2C]' : 'text-[#75676A]'}`}>{label}</span>
    </span>
  </Link>
}

export function MobileBottomNavigation() {
  const location = useLocation()
  const { locale, t } = useI18n()

  return <nav
    aria-label={locale === 'fr' ? 'Navigation principale mobile' : 'Mobile primary navigation'}
    className="fixed inset-x-0 bottom-0 z-40 border-t border-[#DED4C8] bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_20px_rgba(47,42,44,0.08)] backdrop-blur-xl lg:hidden"
  >
    <div className="grid grid-cols-4 px-1 py-1">
      <MobileNavItem to="/" label={locale === 'fr' ? 'Accueil' : 'Home'} icon={House} pathname={location.pathname} />
      <MobileNavItem to="/catalogue" label="Catalogue" icon={Store} pathname={location.pathname} />
      <MobileNavItem to="/about" label={t('storyNav')} icon={ScrollText} pathname={location.pathname} />
      <MobileNavItem to="/contact" label="Contact" icon={MessagesSquare} pathname={location.pathname} />
    </div>
  </nav>
}
