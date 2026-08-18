import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo } from '../brand/Logo'
import { WHATSAPP_DISPLAY_NUMBER, WHATSAPP_NUMBER } from '../../config/contact'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../../config/social-links'
import { useI18n } from '../../i18n/i18n'

const footerCopy = {
  fr: {
    maison: 'Maison artisanale', motto: 'L’art du bijou, en petites séries.', description: "Des bijoux artisanaux inspirés par la chaleur, les détails et la poésie de l’Orient. Créés en petites séries et livrés au Maroc comme à l’international.", jewelry: 'Bijoux', necklaces: 'Colliers', earrings: "Boucles d’oreilles", bracelets: 'Bracelets', rings: 'Bagues', atelier: "L’atelier", story: 'Notre histoire', delivery: 'Livraison', care: 'Entretien et retours', contact: 'Contact', signature: '© 2026 Casa de Perla — Créations artisanales inspirées par l’Orient. Tous droits réservés.',
  },
  ar: {
    maison: 'دار حرفية', motto: 'فن المجوهرات، في مجموعات محدودة.', description: 'مجوهرات حرفية مستوحاة من دفء الشرق وتفاصيله وشاعريته. تُصنع ضمن مجموعات محدودة وتُوصل داخل المغرب ودولياً.', jewelry: 'المجوهرات', necklaces: 'القلائد', earrings: 'الأقراط', bracelets: 'الأساور', rings: 'الخواتم', atelier: 'المشغل', story: 'قصتنا', delivery: 'التوصيل', care: 'العناية والإرجاع', contact: 'تواصل معنا', signature: '© 2026 Casa de Perla — إبداعات حرفية مستوحاة من الشرق. جميع الحقوق محفوظة.',
  },
} as const

export function Footer() {
  const { locale } = useI18n()
  const copy = footerCopy[locale]
  return <footer className="border-t border-accent/60 bg-white text-ink">
    <div className="container-shell py-11 md:py-16 lg:py-[72px]">
      <div className="grid gap-7 border-b border-line pb-9 md:grid-cols-[auto_1fr] md:items-end md:gap-12 md:pb-12"><Logo tone="dark" /><div className="md:text-right"><p className="text-[9px] font-bold uppercase tracking-[.3em] text-accent">{copy.maison}</p><h2 className="editorial-display mt-2 text-[2.4rem] leading-none text-[#3E3035] sm:text-5xl">{copy.motto}</h2></div></div>
      <div className="grid grid-cols-2 gap-x-7 gap-y-10 pt-9 md:grid-cols-[1.3fr_.7fr_.7fr_1fr] md:gap-10 md:pt-12 lg:gap-16">
        <div className="col-span-2 md:col-span-1"><p className="max-w-sm text-[13px] leading-6 text-[#756B6F] md:text-sm md:leading-7">{copy.description}</p><div className="mt-7 flex items-center gap-3" aria-hidden="true"><span className="h-px w-14 bg-accent/70" /><span className="text-[8px] text-accent">◆</span></div></div>
        <div><h3 className="text-[9px] font-bold uppercase tracking-[.26em] text-[#A87931]">{copy.jewelry}</h3><div className="mt-5 space-y-3 text-sm text-[#756B6F]"><Link className="block transition-colors hover:text-[#4B2432]" to="/catalogue?category=Necklaces">{copy.necklaces}</Link><Link className="block transition-colors hover:text-[#4B2432]" to="/catalogue?category=Earrings">{copy.earrings}</Link><Link className="block transition-colors hover:text-[#4B2432]" to="/catalogue?category=Bracelets">{copy.bracelets}</Link><Link className="block transition-colors hover:text-[#4B2432]" to="/catalogue?category=Rings">{copy.rings}</Link></div></div>
        <div><h3 className="text-[9px] font-bold uppercase tracking-[.26em] text-[#A87931]">{copy.atelier}</h3><div className="mt-5 space-y-3 text-sm text-[#756B6F]"><Link className="block transition-colors hover:text-[#4B2432]" to="/about">{copy.story}</Link><Link className="block transition-colors hover:text-[#4B2432]" to="/delivery">{copy.delivery}</Link><Link className="block transition-colors hover:text-[#4B2432]" to="/returns">{copy.care}</Link><Link className="block transition-colors hover:text-[#4B2432]" to="/contact">{copy.contact}</Link></div></div>
        <div role="region" aria-label="Coordonnées Casa de Perla" dir="ltr" className="col-span-2 bg-white text-left text-ink md:col-span-1 md:border-l md:border-accent/35 md:pl-8 lg:pl-10"><h3 className="text-[9px] font-bold uppercase tracking-[.26em] text-[#A87931]">Casa de Perla</h3><div className="mt-3 text-[13px] text-muted md:text-sm"><a dir="ltr" href={`tel:+${WHATSAPP_NUMBER}`} className="flex items-center justify-between gap-4 border-b border-line py-3 transition-colors hover:text-[#4B2432]">{WHATSAPP_DISPLAY_NUMBER}<ArrowUpRight size={14} className="shrink-0 text-accent" /></a><a dir="ltr" href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 border-b border-line py-3 transition-colors hover:text-[#4B2432]" aria-label="Instagram Casa de Perla">{INSTAGRAM_HANDLE}<ArrowUpRight size={14} className="shrink-0 text-accent" /></a></div></div>
      </div>
    </div>
    <div className="border-t border-accent/30 bg-white px-5 py-5 text-center text-[9px] tracking-[.13em] text-muted before:mr-3 before:inline-block before:h-px before:w-7 before:bg-accent/60 before:align-middle before:content-[''] after:ml-3 after:inline-block after:h-px after:w-7 after:bg-accent/60 after:align-middle after:content-[''] md:py-6 md:text-[10px] md:tracking-[.17em]">{copy.signature}</div>
  </footer>
}
