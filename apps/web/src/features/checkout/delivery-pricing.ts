export type DeliveryCountry = 'MA' | 'INTERNATIONAL'
export type DeliveryZone = 'PICKUP_CITY' | 'MAJOR_CITIES' | 'NORTH_REGIONS' | 'SOUTH_REGIONS'

export type DeliverySettings = {
  pickupCity: string
  freeThreshold: number
  pickupFee: number
  majorCityFee: number
  northRegionFee: number
  southRegionFee: number
  majorCities: string[]
  southCities: string[]
  activeZones: Record<DeliveryZone, boolean>
}

export const DEFAULT_DELIVERY_SETTINGS: DeliverySettings = {
  pickupCity: 'Fès',
  freeThreshold: 2_000,
  pickupFee: 20,
  majorCityFee: 35,
  northRegionFee: 40,
  southRegionFee: 45,
  majorCities: ['Casablanca', 'Marrakech', 'Tanger', 'Salé', 'Meknès', 'Oujda', 'Kénitra', 'Tétouan', 'Témara', 'Safi', 'Mohammedia', 'Khouribga', 'El Jadida', 'Béni Mellal', 'Nador', 'Taza', 'Khémisset', 'Laâyoune', 'Berkane'],
  southCities: ['Agadir', 'Dakhla', 'Guelmim', 'Tan-Tan', 'Tarfaya', 'Ouarzazate', 'Zagora', 'Errachidia'],
  activeZones: { PICKUP_CITY: true, MAJOR_CITIES: true, NORTH_REGIONS: true, SOUTH_REGIONS: true },
}

export function normalizeDeliveryCity(city: string) {
  return city.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, ' ').trim().toLowerCase()
}

export function resolveDeliveryZone(city: string, settings: DeliverySettings): DeliveryZone {
  const normalized = normalizeDeliveryCity(city)
  if (normalized === normalizeDeliveryCity(settings.pickupCity)) return 'PICKUP_CITY'
  if (settings.majorCities.some((item) => normalizeDeliveryCity(item) === normalized)) return 'MAJOR_CITIES'
  if (settings.southCities.some((item) => normalizeDeliveryCity(item) === normalized)) return 'SOUTH_REGIONS'
  return 'NORTH_REGIONS'
}

export function calculateDeliveryFee(subtotal: number, city: string, country: DeliveryCountry, settings: DeliverySettings) {
  if (country === 'INTERNATIONAL') return { fee: 0, zone: 'INTERNATIONAL' as const, free: false, requiresQuote: true }
  const zone = resolveDeliveryZone(city, settings)
  if (!settings.activeZones[zone]) return { fee: 0, zone, free: false, requiresQuote: true }
  if (subtotal >= settings.freeThreshold) return { fee: 0, zone, free: true, requiresQuote: false }
  const fees: Record<DeliveryZone, number> = {
    PICKUP_CITY: settings.pickupFee,
    MAJOR_CITIES: settings.majorCityFee,
    NORTH_REGIONS: settings.northRegionFee,
    SOUTH_REGIONS: settings.southRegionFee,
  }
  return { fee: fees[zone], zone, free: false, requiresQuote: false }
}

export const deliveryZoneLabels: Record<'fr' | 'ar', Record<DeliveryZone | 'INTERNATIONAL', string>> = {
  fr: { PICKUP_CITY: 'Fès', MAJOR_CITIES: 'Grande ville', NORTH_REGIONS: 'Petite ville / région Nord', SOUTH_REGIONS: 'Région Sud', INTERNATIONAL: 'International' },
  ar: { PICKUP_CITY: 'فاس', MAJOR_CITIES: 'مدينة كبرى', NORTH_REGIONS: 'مدينة صغرى / منطقة الشمال', SOUTH_REGIONS: 'منطقة الجنوب', INTERNATIONAL: 'دولي' },
}
