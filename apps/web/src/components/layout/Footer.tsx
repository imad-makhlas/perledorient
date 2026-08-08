import { Instagram, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo } from '../brand/Logo'
import { WHATSAPP_DISPLAY_NUMBER } from '../../config/contact'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../../config/social-links'
import { useI18n } from '../../i18n/i18n'

const footerCopy = {
  fr: {
    description: "Des bijoux artisanaux inspirés par la chaleur, les détails et la poésie de l’Orient. Créés en petites séries et livrés au Maroc comme à l’international.", jewelry: 'Bijoux', necklaces: 'Colliers', earrings: "Boucles d’oreilles", bracelets: 'Bracelets', rings: 'Bagues', atelier: "L’atelier", story: 'Notre histoire', delivery: 'Livraison', care: 'Entretien et retours', contact: 'Contact', signature: '© 2026 Perle d’Orient — Tous droits réservés.',
  },
  ar: {
    description: 'مجوهرات حرفية مستوحاة من دفء الشرق وتفاصيله وشاعريته. تُصنع ضمن مجموعات محدودة وتُوصل داخل المغرب ودولياً.', jewelry: 'المجوهرات', necklaces: 'القلائد', earrings: 'الأقراط', bracelets: 'الأساور', rings: 'الخواتم', atelier: 'المشغل', story: 'قصتنا', delivery: 'التوصيل', care: 'العناية والإرجاع', contact: 'تواصل معنا', signature: '© 2026 Perle d’Orient — جميع الحقوق محفوظة.',
  },
} as const

export function Footer() {
  const { locale } = useI18n()
  const copy = footerCopy[locale]
  return <footer className="border-t-2 border-accent bg-[#2F2A2C] text-white">
    <div className="container-shell grid grid-cols-2 gap-x-5 gap-y-8 py-10 md:grid-cols-[1.45fr_1fr_1fr_1.2fr] md:gap-10 md:py-14 lg:py-16">
      <div className="col-span-2 md:col-span-1"><Logo tone="light" /><p className="mt-4 max-w-sm text-[13px] leading-6 text-white/60 md:mt-5 md:text-sm md:leading-7">{copy.description}</p><div className="champagne-line mt-5 w-32 md:mt-7 md:w-40" /></div>
      <div><h3 className="text-[10px] font-bold uppercase tracking-[.2em]">{copy.jewelry}</h3><div className="mt-5 space-y-3 text-sm text-white/55"><Link className="block hover:text-white" to="/catalogue?category=Necklaces">{copy.necklaces}</Link><Link className="block hover:text-white" to="/catalogue?category=Earrings">{copy.earrings}</Link><Link className="block hover:text-white" to="/catalogue?category=Bracelets">{copy.bracelets}</Link><Link className="block hover:text-white" to="/catalogue?category=Rings">{copy.rings}</Link></div></div>
      <div><h3 className="text-[10px] font-bold uppercase tracking-[.2em]">{copy.atelier}</h3><div className="mt-5 space-y-3 text-sm text-white/55"><Link className="block hover:text-white" to="/about">{copy.story}</Link><Link className="block hover:text-white" to="/delivery">{copy.delivery}</Link><Link className="block hover:text-white" to="/returns">{copy.care}</Link><Link className="block hover:text-white" to="/contact">{copy.contact}</Link></div></div>
      <div role="region" aria-label="Coordonnées Perle d'Orient" dir="ltr" className="col-span-2 border-t border-white/10 pt-6 text-left md:col-span-1 md:border-0 md:pt-0"><h3 className="text-[10px] font-bold uppercase tracking-[.2em]">Perle d'Orient</h3><div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-[13px] text-white/55 md:mt-5 md:block md:space-y-3 md:text-sm"><p dir="ltr" className="flex gap-3"><Phone size={16} className="text-accent" />{WHATSAPP_DISPLAY_NUMBER}</p><a dir="ltr" href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex gap-3 transition-colors hover:text-white" aria-label="Instagram Perle d'Orient"><Instagram size={16} className="text-accent" />{INSTAGRAM_HANDLE}</a></div></div>
    </div>
    <div className="border-t border-white/10 px-5 py-4 text-center text-[9px] tracking-[.1em] text-white/45 md:py-5 md:text-[10px] md:tracking-[.14em]">{copy.signature}</div>
  </footer>
}
