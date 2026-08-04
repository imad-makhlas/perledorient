const announcementParts = {
  en: { lead: 'Complimentary delivery from', threshold: '500 MAD', country: 'in Morocco', international: 'International delivery available' },
  fr: { lead: 'Livraison offerte dès', threshold: '500 MAD', country: 'au Maroc', international: 'Livraison internationale disponible' },
} as const

export function getHeaderAnnouncementParts(locale: keyof typeof announcementParts) {
  return announcementParts[locale]
}

export function getHeaderAnnouncement(locale: keyof typeof announcementParts) {
  const announcement = announcementParts[locale]
  return `${announcement.lead} ${announcement.threshold} ${announcement.country} - ${announcement.international}`
}
