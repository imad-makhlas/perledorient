import { Instagram, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo } from '../brand/Logo'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../../config/social-links'

export function Footer() {
  return <footer className="bg-midnight text-white">
    <div className="container-shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
      <div><Logo tone="light" /><p className="mt-5 max-w-sm text-sm leading-7 text-white/60">Handcrafted jewelry inspired by the warmth, detail and poetry of the Orient. Made in small series and delivered in Morocco and internationally.</p><div className="champagne-line mt-7 w-40" /></div>
      <div><h3 className="text-[10px] font-bold uppercase tracking-[.2em]">Jewelry</h3><div className="mt-5 space-y-3 text-sm text-white/55"><Link className="block hover:text-white" to="/catalogue?category=Necklaces">Necklaces</Link><Link className="block hover:text-white" to="/catalogue?category=Earrings">Earrings</Link><Link className="block hover:text-white" to="/catalogue?category=Bracelets">Bracelets</Link><Link className="block hover:text-white" to="/catalogue?category=Rings">Rings</Link></div></div>
      <div><h3 className="text-[10px] font-bold uppercase tracking-[.2em]">The atelier</h3><div className="mt-5 space-y-3 text-sm text-white/55"><Link className="block hover:text-white" to="/about">Our story</Link><Link className="block hover:text-white" to="/delivery">Delivery</Link><Link className="block hover:text-white" to="/returns">Care & returns</Link><Link className="block hover:text-white" to="/contact">Contact</Link></div></div>
      <div><h3 className="text-[10px] font-bold uppercase tracking-[.2em]">Perle d'Orient</h3><div className="mt-5 space-y-3 text-sm text-white/55"><p className="flex gap-3"><Phone size={16} className="text-accent" />+212 600 000 000</p><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex gap-3 transition-colors hover:text-white" aria-label="Instagram Perle d'Orient"><Instagram size={16} className="text-accent" />{INSTAGRAM_HANDLE}</a></div></div>
    </div>
    <div className="border-t border-white/10 py-5 text-center text-[10px] uppercase tracking-[.16em] text-white/35">2026 Perle d'Orient. All rights reserved.</div>
  </footer>
}
