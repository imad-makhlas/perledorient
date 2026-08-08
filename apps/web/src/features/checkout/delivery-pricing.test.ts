import { describe, expect, it } from 'vitest'
import { DEFAULT_DELIVERY_SETTINGS, calculateDeliveryFee, resolveDeliveryZone } from './delivery-pricing'

describe('Cathedis Silver delivery pricing', () => {
  it('uses Fès as the pickup city and maps known destinations to their zone', () => {
    expect(resolveDeliveryZone('Fès', DEFAULT_DELIVERY_SETTINGS)).toBe('PICKUP_CITY')
    expect(resolveDeliveryZone('Casablanca', DEFAULT_DELIVERY_SETTINGS)).toBe('MAJOR_CITIES')
    expect(resolveDeliveryZone('Dakhla', DEFAULT_DELIVERY_SETTINGS)).toBe('SOUTH_REGIONS')
    expect(resolveDeliveryZone('Ifrane', DEFAULT_DELIVERY_SETTINGS)).toBe('NORTH_REGIONS')
  })

  it('applies Silver rates and offers Moroccan delivery from 2,000 MAD', () => {
    expect(calculateDeliveryFee(500, 'Fès', 'MA', DEFAULT_DELIVERY_SETTINGS)).toMatchObject({ fee: 20, zone: 'PICKUP_CITY', free: false })
    expect(calculateDeliveryFee(500, 'Casablanca', 'MA', DEFAULT_DELIVERY_SETTINGS)).toMatchObject({ fee: 35, zone: 'MAJOR_CITIES', free: false })
    expect(calculateDeliveryFee(500, 'Dakhla', 'MA', DEFAULT_DELIVERY_SETTINGS)).toMatchObject({ fee: 45, zone: 'SOUTH_REGIONS', free: false })
    expect(calculateDeliveryFee(2_000, 'Casablanca', 'MA', DEFAULT_DELIVERY_SETTINGS)).toMatchObject({ fee: 0, zone: 'MAJOR_CITIES', free: true })
  })

  it('marks international delivery for manual WhatsApp confirmation', () => {
    expect(calculateDeliveryFee(2_500, 'Paris', 'INTERNATIONAL', DEFAULT_DELIVERY_SETTINGS)).toEqual({ fee: 0, zone: 'INTERNATIONAL', free: false, requiresQuote: true })
  })
})
