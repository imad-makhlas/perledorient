import { BookOpen, Gem, Home, MessageCircle, type LucideIcon } from 'lucide-react'
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
    className={`relative flex min-h-[64px] items-center justify-center px-1 transition-colors ${active ? 'text-burgundy' : 'text-ink/55 hover:text-burgundy'}`}
  >
    {active && <span className="absolute left-1/2 top-0 h-0.5 w-8 -translate-x-1/2 bg-accent" aria-hidden="true" />}
    <span className="flex min-h-[44px] flex-col items-center justify-center gap-1">
      <Icon size={19} strokeWidth={active ? 1.9 : 1.5} aria-hidden="true" />
      <span className="whitespace-nowrap text-[9px] font-semibold uppercase tracking-[.08em] sm:text-[10px]">{label}</span>
    </span>
  </Link>
}

export function MobileBottomNavigation() {
  const location = useLocation()
  const { locale, t } = useI18n()

  return <nav
    aria-label={locale === 'fr' ? 'Navigation principale mobile' : 'Mobile primary navigation'}
    className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(46,22,29,0.08)] backdrop-blur lg:hidden"
  >
    <div className="grid grid-cols-4">
      <MobileNavItem to="/" label={locale === 'fr' ? 'Accueil' : 'Home'} icon={Home} pathname={location.pathname} />
      <MobileNavItem to="/catalogue" label="Catalogue" icon={Gem} pathname={location.pathname} />
      <MobileNavItem to="/about" label={t('storyNav')} icon={BookOpen} pathname={location.pathname} />
      <MobileNavItem to="/contact" label="Contact" icon={MessageCircle} pathname={location.pathname} />
    </div>
  </nav>
}
