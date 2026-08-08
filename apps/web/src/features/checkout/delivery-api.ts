import { DEFAULT_DELIVERY_SETTINGS, type DeliverySettings } from './delivery-pricing'

export async function fetchDeliverySettings(): Promise<DeliverySettings> {
  try {
    const response = await fetch('/api/v1/delivery')
    if (!response.ok) return DEFAULT_DELIVERY_SETTINGS
    const data = await response.json() as Partial<DeliverySettings>
    return {
      ...DEFAULT_DELIVERY_SETTINGS,
      ...data,
      majorCities: Array.isArray(data.majorCities) ? data.majorCities : DEFAULT_DELIVERY_SETTINGS.majorCities,
      southCities: Array.isArray(data.southCities) ? data.southCities : DEFAULT_DELIVERY_SETTINGS.southCities,
      activeZones: { ...DEFAULT_DELIVERY_SETTINGS.activeZones, ...(data.activeZones || {}) },
    }
  } catch {
    return DEFAULT_DELIVERY_SETTINGS
  }
}
