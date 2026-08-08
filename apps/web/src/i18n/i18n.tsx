import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { copy as perleCopy } from './perle-copy'

export const legacyCopy = {
  en: {
    shop: 'Shop', categories: 'Categories', newArrivals: 'New arrivals', bestSellers: 'Best sellers',
    search: 'Search', cart: 'Cart', account: 'Account', heroEyebrow: 'The considered collection',
    heroTitle: 'Objects of distinction, selected for modern life.',
    heroBody: 'Explore a curated avenue of fashion, beauty, technology and home essentials—chosen for quality, character and enduring appeal.',
    explore: 'Explore the collection', story: 'Our point of view', featured: 'Featured edit', discover: 'Discover this season’s defining pieces.',
    addToCart: 'Add to cart', outOfStock: 'Out of stock', lowStock: 'Low stock', inStock: 'In stock',
    viewAll: 'View all products', newsletterTitle: 'A more considered inbox.', newsletterBody: 'New edits, private offers and stories from the avenue.',
    subscribe: 'Subscribe', trustDelivery: 'Delivery in Morocco & worldwide', trustPayment: 'Pay on delivery', trustSupport: 'Human support',
    catalogue: 'The catalogue', results: 'products', filters: 'Filters', availability: 'In stock only', allCategories: 'All categories',
    subtotal: 'Subtotal', delivery: 'Delivery', total: 'Total', checkout: 'Proceed to checkout', continueShopping: 'Continue shopping', emptyCart: 'Your cart is waiting for something exceptional.',
    checkoutTitle: 'Delivery details', orderSummary: 'Order summary', placeOrder: 'Confirm order', firstName: 'First name', lastName: 'Last name', telephone: 'Telephone', email: 'Email (optional)', city: 'City', address: 'Delivery address', notes: 'Delivery notes (optional)', cod: 'Cash on delivery', whatsapp: 'Order through WhatsApp', consent: 'I accept the terms and delivery policy.',
    confirmationTitle: 'Your order is confirmed.', confirmationBody: 'We’ll call shortly to confirm delivery details.', orderNumber: 'Order number',
  },
  fr: {
    shop: 'Boutique', categories: 'Catégories', newArrivals: 'Nouveautés', bestSellers: 'Meilleures ventes',
    search: 'Rechercher', cart: 'Panier', account: 'Compte', heroEyebrow: 'La sélection réfléchie',
    heroTitle: 'Des objets distinctifs, choisis pour la vie moderne.',
    heroBody: 'Découvrez une avenue dédiée à la mode, la beauté, la technologie et la maison—sélectionnée pour sa qualité et son caractère.',
    explore: 'Explorer la collection', story: 'Notre vision', featured: 'Sélection phare', discover: 'Découvrez les pièces qui définissent la saison.',
    addToCart: 'Ajouter au panier', outOfStock: 'Épuisé', lowStock: 'Stock limité', inStock: 'En stock',
    viewAll: 'Voir tous les produits', newsletterTitle: 'Une boîte mail plus inspirée.', newsletterBody: 'Nouvelles sélections, offres privées et histoires de l’avenue.',
    subscribe: 'S’inscrire', trustDelivery: 'Livraison au Maroc et à l’international', trustPayment: 'Paiement à la livraison', trustSupport: 'Assistance humaine',
    catalogue: 'Le catalogue', results: 'produits', filters: 'Filtres', availability: 'En stock uniquement', allCategories: 'Toutes les catégories',
    subtotal: 'Sous-total', delivery: 'Livraison', total: 'Total', checkout: 'Passer la commande', continueShopping: 'Continuer mes achats', emptyCart: 'Votre panier attend quelque chose d’exceptionnel.',
    checkoutTitle: 'Détails de livraison', orderSummary: 'Résumé de la commande', placeOrder: 'Confirmer la commande', firstName: 'Prénom', lastName: 'Nom', telephone: 'Téléphone', email: 'E-mail (facultatif)', city: 'Ville', address: 'Adresse de livraison', notes: 'Instructions (facultatif)', cod: 'Paiement à la livraison', whatsapp: 'Commander via WhatsApp', consent: 'J’accepte les conditions et la politique de livraison.',
    confirmationTitle: 'Votre commande est confirmée.', confirmationBody: 'Nous vous appellerons bientôt pour confirmer la livraison.', orderNumber: 'Numéro de commande',
  },
} as const

const copy = perleCopy

export type StoreLocale = keyof typeof copy
type CopyKey = keyof typeof copy.fr
type I18nValue = { locale: StoreLocale; setLocale: (locale: StoreLocale) => void; t: (key: CopyKey) => string }

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({ children }: PropsWithChildren) {
  const [locale, setLocaleState] = useState<StoreLocale>(() => localStorage.getItem('perle-d-orient-locale') === 'ar' ? 'ar' : 'fr')
  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
  }, [locale])
  const value = useMemo<I18nValue>(() => ({
    locale,
    setLocale: (next) => { localStorage.setItem('perle-d-orient-locale', next); setLocaleState(next) },
    t: (key) => copy[locale][key],
  }), [locale])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used within I18nProvider')
  return value
}
