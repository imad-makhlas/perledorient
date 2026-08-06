import { MessageCircle } from 'lucide-react'
import { WHATSAPP_URL } from '../config/contact'
import { useLocation } from 'react-router-dom'

const content: Record<string, [string, string]> = {
  '/about': ["The story of Perle d'Orient", "Born from a love of traditional detail and modern simplicity, Perle d'Orient creates handcrafted jewelry in small series. Every piece carries a warm oriental spirit and the subtle irregularities that make artisan work unique."],
  '/contact': ['Speak directly with the artisan', 'For sizing, materials, gifts or availability, write to us on WhatsApp. We answer personally and help you choose the piece that feels right.'],
  '/delivery': ['Delivery in Morocco & worldwide', 'Orders are confirmed personally on WhatsApp. Casablanca delivery is 30 MAD, other Moroccan cities are 45 MAD, and delivery is complimentary from 500 MAD in Morocco. International delivery fees and timing are confirmed through WhatsApp according to destination.'],
  '/returns': ['Returns and care', 'Please contact us on WhatsApp within 7 days of delivery if an unused piece is not right for you. Personalized pieces are reviewed individually.'],
  '/tracking': ['Follow your order', 'Send your PDO reference and telephone number on WhatsApp for a personal delivery update.'],
}

export function BrandContentPage() {
  const { pathname } = useLocation()
  const [title, body] = content[pathname] ?? ["Perle d'Orient", 'Handcrafted jewelry inspired by an oriental breath.']
  return <main className="container-shell grid min-h-[58vh] place-items-center py-20"><article className="max-w-2xl text-center"><p className="eyebrow">The atelier</p><h1 className="display mt-4 text-5xl font-semibold sm:text-6xl">{title}</h1><p className="mt-6 text-base leading-8 text-muted">{body}</p><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="button-primary button-accent mt-8"><MessageCircle size={16} />Write on WhatsApp</a></article></main>
}
