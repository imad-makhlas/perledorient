import { buildBasicAuthHeader, type AdminCredentials } from './admin-orders'

async function imageApiError(response: Response, fallback: string) {
  try {
    const body = await response.json() as { error?: string }
    return body.error || fallback
  } catch {
    return fallback
  }
}

function authorization(credentials: AdminCredentials) {
  return buildBasicAuthHeader(credentials.email, credentials.password)
}

export async function uploadAdminImage(credentials: AdminCredentials, file: File) {
  const body = new FormData()
  body.append('file', file)
  const response = await fetch('/api/v1/admin/images', {
    method: 'POST',
    headers: { Authorization: authorization(credentials) },
    body,
  })
  if (!response.ok) throw new Error(await imageApiError(response, 'Impossible d’envoyer cette photo'))
  const result = await response.json() as { imageUrl?: string }
  if (!result.imageUrl) throw new Error('Cloudinary n’a pas retourné l’adresse de la photo')
  return result.imageUrl
}

export async function deleteAdminImage(credentials: AdminCredentials, imageUrl: string) {
  if (!imageUrl) return
  const response = await fetch('/api/v1/admin/images', {
    method: 'DELETE',
    headers: {
      Authorization: authorization(credentials),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageUrl }),
  })
  if (!response.ok) throw new Error(await imageApiError(response, 'Impossible de supprimer cette photo'))
}
