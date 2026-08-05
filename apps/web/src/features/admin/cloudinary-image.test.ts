import { describe, expect, it } from 'vitest'
import {
  buildCloudinaryParameterString,
  extractManagedCloudinaryPublicId,
  optimizeCloudinaryImageUrl,
  signCloudinaryParameters,
  validateProductImage,
} from './cloudinary-image'

describe('Cloudinary product image helpers', () => {
  it('sorts and serializes only signable parameters', () => {
    expect(buildCloudinaryParameterString({
      timestamp: 1_753_000_000,
      public_id: 'perle-dorient/products/layali',
      empty: '',
      missing: undefined,
    })).toBe('public_id=perle-dorient/products/layali&timestamp=1753000000')
  })

  it('creates the SHA-1 signature expected by the Cloudinary upload API', async () => {
    await expect(signCloudinaryParameters({
      timestamp: 1_753_000_000,
      public_id: 'perle-dorient/products/layali',
    }, 'test-secret')).resolves.toBe('6659ca87e310c402b8617cde1d1bff4ec5411b99')
  })

  it('adds automatic quality, format, and a safe maximum width', () => {
    expect(optimizeCloudinaryImageUrl(
      'https://res.cloudinary.com/perle/image/upload/v1753000000/perle-dorient/products/layali.jpg',
    )).toBe(
      'https://res.cloudinary.com/perle/image/upload/f_auto,q_auto,c_limit,w_1600/v1753000000/perle-dorient/products/layali.jpg',
    )
  })

  it('extracts only public IDs managed by this shop and cloud', () => {
    const managed = 'https://res.cloudinary.com/perle/image/upload/f_auto,q_auto,c_limit,w_1600/v1753000000/perle-dorient/products/layali.jpg'
    expect(extractManagedCloudinaryPublicId(managed, 'perle')).toBe('perle-dorient/products/layali')
    expect(extractManagedCloudinaryPublicId(managed, 'another-cloud')).toBeNull()
    expect(extractManagedCloudinaryPublicId('/assets/products/layali.jpg', 'perle')).toBeNull()
    expect(extractManagedCloudinaryPublicId('https://example.com/layali.jpg', 'perle')).toBeNull()
  })

  it('accepts shop image formats and rejects unsafe or oversized files', () => {
    expect(() => validateProductImage({ type: 'image/jpeg', size: 2_000_000 })).not.toThrow()
    expect(() => validateProductImage({ type: 'image/svg+xml', size: 1_000 })).toThrow('format')
    expect(() => validateProductImage({ type: 'image/png', size: 10_000_001 })).toThrow('10 MB')
  })
})
