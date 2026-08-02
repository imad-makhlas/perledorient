const announcements = {
  en: 'Complimentary delivery from 500 MAD in Morocco - International delivery available',
  fr: 'Livraison offerte dès 500 MAD au Maroc - Livraison internationale disponible',
} as const

export function getHeaderAnnouncement(locale: keyof typeof announcements) {
  return announcements[locale]
}
