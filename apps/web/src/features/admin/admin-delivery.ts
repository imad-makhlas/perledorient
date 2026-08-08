import type { DeliverySettings } from '../checkout/delivery-pricing'
import { buildBasicAuthHeader, type AdminCredentials } from './admin-orders'

export async function fetchAdminDeliverySettings(credentials: AdminCredentials): Promise<DeliverySettings> {
  const response = await fetch('/api/v1/admin/delivery', { headers: { Authorization: buildBasicAuthHeader(credentials.email, credentials.password) } })
  if (!response.ok) throw new Error(response.status === 401 ? 'Identifiants administrateur incorrects' : 'Impossible de charger les tarifs de livraison')
  return response.json() as Promise<DeliverySettings>
}

export async function updateAdminDeliverySettings(credentials: AdminCredentials, settings: DeliverySettings): Promise<DeliverySettings> {
  const response = await fetch('/api/v1/admin/delivery', {
    method: 'PUT',
    headers: { Authorization: buildBasicAuthHeader(credentials.email, credentials.password), 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  })
  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { error?: string }
    throw new Error(body.error || 'Impossible d’enregistrer les tarifs de livraison')
  }
  return response.json() as Promise<DeliverySettings>
}
