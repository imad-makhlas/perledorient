import { json, listAdminProducts, requireAdmin, type PagesContext } from '../_shared'

export async function onRequestGet({ request, env }: PagesContext) {
  const authError = requireAdmin(request, env)
  if (authError) return authError

  return json(await listAdminProducts(env.DB))
}
