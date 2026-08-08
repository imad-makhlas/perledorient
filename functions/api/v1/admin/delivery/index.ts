import { getDeliverySettings, json, requireAdmin, saveDeliverySettings, type PagesContext } from '../_shared'

export async function onRequestGet({ request, env }: PagesContext) {
  const authError = requireAdmin(request, env)
  if (authError) return authError
  return json(await getDeliverySettings(env.DB))
}

export async function onRequestPut({ request, env }: PagesContext) {
  const authError = requireAdmin(request, env)
  if (authError) return authError
  try { return json(await saveDeliverySettings(env.DB, await request.json())) }
  catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save delivery settings'
    if (message.includes('no such table')) return json({ error: 'Exécutez la migration 0006_create_delivery_settings.sql dans D1 avant l’enregistrement.' }, { status: 500 })
    return json({ error: message }, { status: 400 })
  }
}
