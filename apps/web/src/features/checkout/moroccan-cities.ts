import type { DeliverySettings } from './delivery-pricing'

const ADDITIONAL_MOROCCAN_CITIES = [
  'Al Hoceïma', 'Assilah', 'Azrou', 'Benguerir', 'Benslimane', 'Berrechid',
  'Boujdour', 'Chefchaouen', 'Chichaoua', 'El Hajeb', 'Essaouira', 'Figuig',
  'Ifrane', 'Inezgane', 'Jerada', 'Ksar El Kébir', 'Larache', 'Martil',
  'Midelt', 'Ouezzane', 'Rabat', 'Sefrou', 'Settat', 'Sidi Bennour',
  'Sidi Ifni', 'Sidi Kacem', 'Sidi Slimane', 'Skhirat', 'Smara', 'Taounate',
  'Taroudant', 'Tinghir', 'Tiznit', 'Youssoufia',
]

export function getMoroccanCitySuggestions(settings: DeliverySettings) {
  return Array.from(new Set([
    settings.pickupCity,
    ...settings.majorCities,
    ...settings.southCities,
    ...ADDITIONAL_MOROCCAN_CITIES,
  ])).sort((first, second) => first.localeCompare(second, 'fr', { sensitivity: 'base' }))
}
