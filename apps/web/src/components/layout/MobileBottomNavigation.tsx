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
    className={`group relative flex min-h-[58px] items-center justify-center border-e border-[#E9E2D9] px-1 transition-colors duration-200 last:border-e-0 active:bg-[#F8F4EE] ${active ? 'bg-[#FCFAF6]' : 'bg-transparent'}`}
  >
    {active && <span className="absolute left-1/2 top-0 h-[2px] w-8 -translate-x-1/2 rounded-b-full bg-accent" aria-hidden="true" />}
    <span className="flex min-h-[50px] flex-col items-center justify-center gap-0.5">
      <span className={`grid h-8 w-8 place-items-center rounded-[10px] transition-all duration-200 ${active ? 'bg-accent/10 text-accent' : 'text-[#675E61] group-hover:text-[#302A2E]'}`}>
        <Icon size={20} strokeWidth={active ? 2 : 1.65} aria-hidden="true" />
      </span>
      <span className={`max-w-full truncate whitespace-nowrap px-0.5 text-[10px] font-semibold leading-none sm:text-[10.5px] ${active ? 'text-[#2F2A2C]' : 'text-[#756D70]'}`}>{label}</span>
    </span>
  </Link>
}

export function MobileBottomNavigation() {
  const location = useLocation()
  const { locale, t } = useI18n()
  const currentPageLabel = locale === 'fr' ? 'page actuelle' : 'الصفحة الحالية'

  return <nav
    aria-label={locale === 'fr' ? 'Navigation principale mobile' : 'التنقل الرئيسي على الهاتف'}
    className="fixed left-3 right-3 bottom-2 z-40 mx-auto max-w-[720px] overflow-hidden rounded-[20px] border border-[#DED4C8] bg-white/[.98] pb-[env(safe-area-inset-bottom)] shadow-[0_12px_34px_rgba(47,42,44,0.15)] backdrop-blur-xl lg:hidden"
  >
    <div className="grid grid-cols-4">
      <MobileNavItem to="/" label={locale === 'fr' ? 'Accueil' : 'الرئيسية'} icon={House} pathname={location.pathname} currentPageLabel={currentPageLabel} />
      <MobileNavItem to="/catalogue" label={locale === 'fr' ? 'Catalogue' : 'الكتالوج'} icon={Gem} pathname={location.pathname} currentPageLabel={currentPageLabel} />
      <MobileNavItem to="/about" label={t('storyNav')} icon={BookOpenText} pathname={location.pathname} currentPageLabel={currentPageLabel} />
      <MobileNavItem to="/contact" label={locale === 'fr' ? 'Contact' : 'تواصل'} icon={MessageCircle} pathname={location.pathname} currentPageLabel={currentPageLabel} />
    </div>
  </nav>
}
