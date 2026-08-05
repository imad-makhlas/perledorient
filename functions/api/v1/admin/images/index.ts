import {
  createProductImagePublicId,
  extractManagedCloudinaryPublicId,
  optimizeCloudinaryImageUrl,
  signCloudinaryParameters,
  validateProductImage,
} from '../../../../../apps/web/src/features/admin/cloudinary-image'
import { json, requireAdmin, type PagesContext, type PagesEnv } from '../_shared'

type CloudinaryResponse = {
  secure_url?: string
  public_id?: string
  result?: string
  error?: { message?: string }
}

function cloudinaryConfiguration(env: PagesEnv) {
  const cloudName = env.CLOUDINARY_CLOUD_NAME?.trim()
  const apiKey = env.CLOUDINARY_API_KEY?.trim()
  const apiSecret = env.CLOUDINARY_API_SECRET?.trim()
  return cloudName && apiKey && apiSecret ? { cloudName, apiKey, apiSecret } : null
}

async function readCloudinaryResponse(response: Response) {
  try {
    return await response.json() as CloudinaryResponse
  } catch {
    return {} as CloudinaryResponse
  }
}

export async function onRequestPost({ request, env }: PagesContext) {
  const authError = requireAdmin(request, env)
  if (authError) return authError
  const configuration = cloudinaryConfiguration(env)
  if (!configuration) return json({ error: 'Cloudinary is not configured' }, { status: 500 })

  try {
    const requestBody = await request.formData()
    const file = requestBody.get('file')
    if (!(file instanceof File)) return json({ error: 'Choisissez une photo à envoyer' }, { status: 400 })
    validateProductImage(file)

    const timestamp = Math.floor(Date.now() / 1000)
    const publicId = createProductImagePublicId()
    const signature = await signCloudinaryParameters({ public_id: publicId, timestamp }, configuration.apiSecret)
    const uploadBody = new FormData()
    uploadBody.append('file', file)
    uploadBody.append('api_key', configuration.apiKey)
    uploadBody.append('timestamp', String(timestamp))
    uploadBody.append('public_id', publicId)
    uploadBody.append('signature', signature)

    const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(configuration.cloudName)}/image/upload`, {
      method: 'POST',
      body: uploadBody,
    })
    const result = await readCloudinaryResponse(response)
    if (!response.ok || !result.secure_url || !result.public_id) {
      return json({ error: result.error?.message || 'Cloudinary a refusé cette photo' }, { status: 502 })
    }
    return json({ imageUrl: optimizeCloudinaryImageUrl(result.secure_url), publicId: result.public_id }, { status: 201 })
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Impossible d’envoyer cette photo' }, { status: 400 })
  }
}

export async function onRequestDelete({ request, env }: PagesContext) {
  const authError = requireAdmin(request, env)
  if (authError) return authError
  const configuration = cloudinaryConfiguration(env)
  if (!configuration) return json({ error: 'Cloudinary is not configured' }, { status: 500 })

  try {
    const { imageUrl } = await request.json() as { imageUrl?: string }
    const publicId = extractManagedCloudinaryPublicId(imageUrl || '', configuration.cloudName)
    if (!publicId) return new Response(null, { status: 204 })
    const timestamp = Math.floor(Date.now() / 1000)
    const parameters = { invalidate: true, public_id: publicId, timestamp }
    const signature = await signCloudinaryParameters(parameters, configuration.apiSecret)
    const destroyBody = new FormData()
    destroyBody.append('api_key', configuration.apiKey)
    destroyBody.append('timestamp', String(timestamp))
    destroyBody.append('public_id', publicId)
    destroyBody.append('invalidate', 'true')
    destroyBody.append('signature', signature)

    const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(configuration.cloudName)}/image/destroy`, {
      method: 'POST',
      body: destroyBody,
    })
    const result = await readCloudinaryResponse(response)
    if (!response.ok || !['ok', 'not found'].includes(result.result || '')) {
      return json({ error: result.error?.message || 'Cloudinary n’a pas supprimé cette photo' }, { status: 502 })
    }
    return new Response(null, { status: 204 })
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Impossible de supprimer cette photo' }, { status: 400 })
  }
}
