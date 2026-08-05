const CLOUDINARY_HOST = 'res.cloudinary.com'
const SHOP_IMAGE_PREFIX = 'perle-dorient/products/'
const PRODUCT_IMAGE_TRANSFORMATION = 'f_auto,q_auto,c_limit,w_1600'
const MAX_PRODUCT_IMAGE_BYTES = 10_000_000
const acceptedProductImageTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/heic',
  'image/heif',
])

type SignableValue = string | number | boolean | undefined | null

export function buildCloudinaryParameterString(parameters: Record<string, SignableValue>) {
  return Object.entries(parameters)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${String(value)}`)
    .join('&')
}

export async function signCloudinaryParameters(parameters: Record<string, SignableValue>, apiSecret: string) {
  const payload = `${buildCloudinaryParameterString(parameters)}${apiSecret}`
  const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(payload))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function optimizeCloudinaryImageUrl(secureUrl: string) {
  const marker = '/image/upload/'
  return secureUrl.includes(marker)
    ? secureUrl.replace(marker, `${marker}${PRODUCT_IMAGE_TRANSFORMATION}/`)
    : secureUrl
}

export function extractManagedCloudinaryPublicId(imageUrl: string, cloudName: string) {
  try {
    const url = new URL(imageUrl)
    const parts = url.pathname.split('/').filter(Boolean)
    if (url.protocol !== 'https:' || url.hostname !== CLOUDINARY_HOST || parts[0] !== cloudName || parts[1] !== 'image' || parts[2] !== 'upload') return null
    const versionIndex = parts.findIndex((part, index) => index > 2 && /^v\d+$/.test(part))
    if (versionIndex < 0) return null
    const publicIdParts = parts.slice(versionIndex + 1)
    if (publicIdParts.length === 0) return null
    publicIdParts[publicIdParts.length - 1] = publicIdParts.at(-1)!.replace(/\.[^.]+$/, '')
    const publicId = publicIdParts.join('/')
    return publicId.startsWith(SHOP_IMAGE_PREFIX) ? publicId : null
  } catch {
    return null
  }
}

export function validateProductImage(file: { type: string; size: number }) {
  if (!acceptedProductImageTypes.has(file.type)) throw new Error('Ce format d’image n’est pas accepté. Utilisez JPG, PNG, WebP, AVIF ou HEIC.')
  if (file.size > MAX_PRODUCT_IMAGE_BYTES) throw new Error('La photo ne doit pas dépasser 10 MB.')
}

export function createProductImagePublicId() {
  return `${SHOP_IMAGE_PREFIX}${crypto.randomUUID()}`
}
