import { Instagram, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo } from '../brand/Logo'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../../config/social-links'

export function Footer() {
  return <footer className="border-t-2 border-accent bg-[#2F2A2C] text-white">
    <div className="container-shell grid grid-cols-2 gap-x-5 gap-y-8 py-10 md:grid-cols-[1.45fr_1fr_1fr_1.2fr] md:gap-10 md:py-14 lg:py-16">
      <div className="col-span-2 md:col-span-1"><Logo tone="light" /><p className="mt-4 max-w-sm text-[13px] leading-6 text-white/60 md:mt-5 md:text-sm md:leading-7">Handcrafted jewelry inspired by the warmth, detail and poetry of the Orient. Made in small series and delivered in Morocco and internationally.</p><div className="champagne-line mt-5 w-32 md:mt-7 md:w-40" /></div>
      <div><h3 className="text-[10px] font-bold uppercase tracking-[.2em]">Jewelry</h3><div className="mt-5 space-y-3 text-sm text-white/55"><Link className="block hover:text-white" to="/catalogue?category=Necklaces">Necklaces</Link><Link className="block hover:text-white" to="/catalogue?category=Earrings">Earrings</Link><Link className="block hover:text-white" to="/catalogue?category=Bracelets">Bracelets</Link><Link className="block hover:text-white" to="/catalogue?category=Rings">Rings</Link></div></div>
      <div><h3 className="text-[10px] font-bold uppercase tracking-[.2em]">The atelier</h3><div className="mt-5 space-y-3 text-sm text-white/55"><Link className="block hover:text-white" to="/about">Our story</Link><Link className="block hover:text-white" to="/delivery">Delivery</Link><Link className="block hover:text-white" to="/returns">Care & returns</Link><Link className="block hover:text-white" to="/contact">Contact</Link></div></div>
      <div className="col-span-2 border-t border-white/10 pt-6 md:col-span-1 md:border-0 md:pt-0"><h3 className="text-[10px] font-bold uppercase tracking-[.2em]">Perle d'Orient</h3><div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-[13px] text-white/55 md:mt-5 md:block md:space-y-3 md:text-sm"><p className="flex gap-3"><Phone size={16} className="text-accent" />+212 600 000 000</p><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex gap-3 transition-colors hover:text-white" aria-label="Instagram Perle d'Orient"><Instagram size={16} className="text-accent" />{INSTAGRAM_HANDLE}</a></div></div>
    </div>
    <div className="border-t border-white/10 py-4 text-center text-[8px] uppercase tracking-[.16em] text-white/40 md:py-5 md:text-[9px] md:tracking-[.2em]">2026 Perle d'Orient · Bijoux artisanaux</div>
  </footer>
}
