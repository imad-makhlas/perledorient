import { useLocation } from 'react-router-dom'

const content: Record<string, [string, string]> = {
  '/about': ['About CODAvenue', 'We created CODAvenue to make exceptional everyday objects easier to discover. Our edit crosses categories but follows one standard: considered design, dependable quality, and service that feels personal.'],
  '/contact': ['Speak with our concierge', 'Our customer care team is available Monday through Saturday. Call +212 600 000 000, write to support@codavenue.ma, or reach us through WhatsApp.'],
  '/delivery': ['Delivery policy', 'Orders are confirmed by telephone and typically delivered within 2–4 business days. Casablanca delivery is 30 MAD, other Moroccan cities are 45 MAD, and orders from 500 MAD receive complimentary delivery in Morocco. International delivery fees and timing are confirmed through WhatsApp according to destination.'],
  '/returns': ['Return policy', 'Unused items in their original condition may be requested for return within 7 days of delivery. Contact our concierge before returning an item.'],
  '/tracking': ['Track an order', 'For your privacy, order tracking requires both your order number and the telephone number used at checkout. The secure tracking service becomes available with the API.'],
  '/account': ['Your CODAvenue account', 'Customer accounts are optional. Guest checkout is always available; sign-in, saved addresses, and order history are included in the next secured account slice.'],
}

export function ContentPage() {
  const { pathname } = useLocation()
  const [title, body] = content[pathname] ?? ['CODAvenue', 'Curated essentials for modern life.']
  return <main className="container-shell grid min-h-[58vh] place-items-center py-20"><article className="max-w-2xl text-center"><p className="eyebrow">CODAvenue concierge</p><h1 className="display mt-4 text-5xl font-semibold sm:text-6xl">{title}</h1><p className="mt-6 text-base leading-8 text-muted">{body}</p></article></main>
}
