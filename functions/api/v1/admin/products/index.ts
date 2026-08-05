import { createAdminProduct, json, listAdminProducts, requireAdmin, type PagesContext } from '../_shared'

export async function onRequestGet({ request, env }: PagesContext) {
  const authError = requireAdmin(request, env)
  if (authError) return authError

  return json(await listAdminProducts(env.DB))
}

export async function onRequestPost({ request, env }: PagesContext) {
  const authError = requireAdmin(request, env)
  if (authError) return authError
  try {
    const created = await createAdminProduct(env.DB, await request.json())
    return json(created, { status: 201 })
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Unable to create product' }, { status: 400 })
  }
}
