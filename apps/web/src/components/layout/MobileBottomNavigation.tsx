import { BookOpenText, Gem, House, MessageCircle, type LucideIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useI18n } from '../../i18n/i18n'
import { isMobileNavigationLinkActive } from './mobile-bottom-navigation'

type MobileNavItemProps = {
  icon: LucideIcon
  label: string
  pathname: string
  to: string
  currentPageLabel: string
}

function MobileNavItem({ icon: Icon, label, pathname, to, currentPageLabel }: MobileNavItemProps) {
  const active = isMobileNavigationLinkActive(pathname, to)

  return <Link
    to={to}
    aria-label={active ? `${label}, ${currentPageLabel}` : label}
    aria-current={active ? 'page' : undefined}
    className="group relative flex min-h-[58px] items-center justify-center bg-transparent px-1 transition-colors duration-[250ms] ease-out"
  >
    {active && <span data-active-panel className="absolute inset-1 rounded-[2px] border border-[#D8A94F] bg-[#62575D]" aria-hidden="true" />}
    <span className="relative z-[1] flex min-h-[50px] flex-col items-center justify-center gap-0.5">
      <span className={`grid h-7 w-7 place-items-center transition-all duration-[250ms] ease-out ${active ? 'text-[#B8893D]' : 'text-[#DDD3CC] group-hover:text-white'}`}>
        <Icon size={17} strokeWidth={active ? 2 : 1.65} aria-hidden="true" />
      </span>
      <span className={`max-w-full truncate whitespace-nowrap px-0.5 text-[8px] font-semibold leading-none transition-colors duration-[250ms] ${active ? 'text-[#D8A94F]' : 'text-[#CFC3BD]'}`}>{label}</span>
    </span>
  </Link>
}

export function MobileBottomNavigation() {
  const location = useLocation()
  const { locale, t } = useI18n()
  const currentPageLabel = locale === 'fr' ? 'page actuelle' : 'الصفحة الحالية'

  return <nav
    aria-label={locale === 'fr' ? 'Navigation principale mobile' : 'التنقل الرئيسي على الهاتف'}
    className="fixed bottom-2 left-3 right-3 z-40 mx-auto max-w-[720px] overflow-hidden rounded-[6px] border border-white/15 bg-[#51484D] pb-[env(safe-area-inset-bottom)] shadow-[0_12px_34px_rgba(48,42,46,0.20)] lg:hidden"
  >
    <div className="grid grid-cols-4">
      <MobileNavItem to="/" label={locale === 'fr' ? 'Accueil' : 'الرئيسية'} icon={House} pathname={location.pathname} currentPageLabel={currentPageLabel} />
      <MobileNavItem to="/catalogue" label={locale === 'fr' ? 'Catalogue' : 'الكتالوج'} icon={Gem} pathname={location.pathname} currentPageLabel={currentPageLabel} />
      <MobileNavItem to="/about" label={t('storyNav')} icon={BookOpenText} pathname={location.pathname} currentPageLabel={currentPageLabel} />
      <MobileNavItem to="/contact" label={locale === 'fr' ? 'Contact' : 'تواصل'} icon={MessageCircle} pathname={location.pathname} currentPageLabel={currentPageLabel} />
    </div>
  </nav>
}
