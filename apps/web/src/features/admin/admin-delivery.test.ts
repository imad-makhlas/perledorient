import { afterEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_DELIVERY_SETTINGS } from '../checkout/delivery-pricing'
import { fetchAdminDeliverySettings, updateAdminDeliverySettings } from './admin-delivery'

afterEach(() => vi.unstubAllGlobals())

describe('admin delivery API client', () => {
  it('loads and saves the central delivery configuration with admin authentication', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(DEFAULT_DELIVERY_SETTINGS), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ...DEFAULT_DELIVERY_SETTINGS, freeThreshold: 2_500 }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    const credentials = { email: 'atelier@gmail.com', password: 'secret' }

    await expect(fetchAdminDeliverySettings(credentials)).resolves.toEqual(DEFAULT_DELIVERY_SETTINGS)
    await expect(updateAdminDeliverySettings(credentials, { ...DEFAULT_DELIVERY_SETTINGS, freeThreshold: 2_500 })).resolves.toMatchObject({ freeThreshold: 2_500 })
    expect(fetchMock.mock.calls[1]?.[1]).toMatchObject({ method: 'PUT' })
    expect((fetchMock.mock.calls[1]?.[1] as RequestInit).headers).toMatchObject({ 'Content-Type': 'application/json' })
  })
})
