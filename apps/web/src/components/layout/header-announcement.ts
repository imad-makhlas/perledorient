const announcementParts = {
  ar: { lead: 'توصيل مجاني ابتداءً من', threshold: '500 MAD', country: 'داخل المغرب', international: 'التوصيل الدولي متاح' },
  fr: { lead: 'Livraison offerte dès', threshold: '500 MAD', country: 'au Maroc', international: 'Livraison internationale disponible' },
} as const

export function getHeaderAnnouncementParts(locale: keyof typeof announcementParts) {
  return announcementParts[locale]
}

export function getHeaderAnnouncement(locale: keyof typeof announcementParts) {
  const announcement = announcementParts[locale]
  return `${announcement.lead} ${announcement.threshold} ${announcement.country} - ${announcement.international}`
}
