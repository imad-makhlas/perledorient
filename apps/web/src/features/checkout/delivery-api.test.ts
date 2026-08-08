import { afterEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_DELIVERY_SETTINGS } from './delivery-pricing'
import { fetchDeliverySettings } from './delivery-api'

afterEach(() => vi.unstubAllGlobals())

describe('public delivery settings API', () => {
  it('uses D1 settings and falls back safely when the endpoint is unavailable', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ ...DEFAULT_DELIVERY_SETTINGS, pickupFee: 22 }), { status: 200 }))
      .mockRejectedValueOnce(new Error('offline'))
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchDeliverySettings()).resolves.toMatchObject({ pickupFee: 22 })
    await expect(fetchDeliverySettings()).resolves.toEqual(DEFAULT_DELIVERY_SETTINGS)
  })
})
