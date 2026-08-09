import { afterEach, describe, expect, it, vi } from 'vitest'
import { onRequestDelete, onRequestPost } from '../../../../../functions/api/v1/admin/images/index'

const env = {
  DB: {} as never,
  ADMIN_EMAIL: 'atelier@gmail.com',
  ADMIN_PASSWORD: 'secret',
  CLOUDINARY_CLOUD_NAME: 'perle',
  CLOUDINARY_API_KEY: 'key',
  CLOUDINARY_API_SECRET: 'cloud-secret',
}
const authorization = `Basic ${btoa('atelier@gmail.com:secret')}`

afterEach(() => vi.unstubAllGlobals())

describe('Cloudinary admin image endpoint', () => {
  it('rejects unauthenticated uploads before contacting Cloudinary', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const response = await onRequestPost({ request: new Request('https://shop.test/api/v1/admin/images', { method: 'POST' }), env, params: {} })
    expect(response.status).toBe(401)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('uploads a validated image and returns its optimized delivery URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      secure_url: 'https://res.cloudinary.com/perle/image/upload/v1753000000/perle-dorient/products/asset.jpg',
      public_id: 'perle-dorient/products/asset',
    }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
    vi.stubGlobal('fetch', fetchMock)
    const body = new FormData()
    body.append('file', new File(['image'], 'asset.jpg', { type: 'image/jpeg' }))

    const request = {
      headers: new Headers({ Authorization: authorization }),
      formData: async () => body,
    } as Request
    const response = await onRequestPost({ request, env, params: {} })
    expect(response.status).toBe(201)
    await expect(response.json()).resolves.toMatchObject({
      imageUrl: 'https://res.cloudinary.com/perle/image/upload/f_auto,q_auto,c_limit,w_1600/v1753000000/perle-dorient/products/asset.jpg',
      publicId: 'perle-dorient/products/asset',
    })
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('ignores deletion requests for images not managed by the shop', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const response = await onRequestDelete({ request: new Request('https://shop.test/api/v1/admin/images', {
      method: 'DELETE',
      headers: { Authorization: authorization, 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: '/assets/products/legacy.jpg' }),
    }), env, params: {} })
    expect(response.status).toBe(204)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
