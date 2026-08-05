import { afterEach, describe, expect, it, vi } from 'vitest'
import { deleteAdminImage, uploadAdminImage } from './admin-images'

const credentials = { email: 'atelier@perledorient.com', password: 'secret' }

afterEach(() => vi.unstubAllGlobals())

describe('admin image API client', () => {
  it('uploads the selected file through the authenticated Cloudflare endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      imageUrl: 'https://res.cloudinary.com/perle/image/upload/f_auto,q_auto,c_limit,w_1600/v1/perle-dorient/products/layali.jpg',
    }), { status: 201, headers: { 'Content-Type': 'application/json' } }))
    vi.stubGlobal('fetch', fetchMock)
    const file = new File(['image'], 'layali.jpg', { type: 'image/jpeg' })

    await expect(uploadAdminImage(credentials, file)).resolves.toContain('res.cloudinary.com')
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/v1/admin/images')
    expect(init.method).toBe('POST')
    expect(init.headers.Authorization).toMatch(/^Basic /)
    expect(init.body).toBeInstanceOf(FormData)
    expect(init.body.get('file')).toBe(file)
  })

  it('requests cleanup of an image URL and surfaces API errors', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: 'Cloudinary unavailable' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(deleteAdminImage(credentials, 'https://res.cloudinary.com/perle/image/upload/v1/perle-dorient/products/layali.jpg')).rejects.toThrow('Cloudinary unavailable')
    expect(fetchMock).toHaveBeenCalledWith('/api/v1/admin/images', expect.objectContaining({
      method: 'DELETE',
      body: JSON.stringify({ imageUrl: 'https://res.cloudinary.com/perle/image/upload/v1/perle-dorient/products/layali.jpg' }),
    }))
  })
})
