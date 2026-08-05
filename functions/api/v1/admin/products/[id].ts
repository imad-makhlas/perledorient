import { json, requireAdmin, updateAdminProduct, type PagesContext } from '../_shared'

export async function onRequestPatch({ request, env, params }: PagesContext) {
  const authError = requireAdmin(request, env)
  if (authError) return authError

  const id = Array.isArray(params.id) ? params.id[0] : params.id
  if (!id) return json({ error: 'Missing product id' }, { status: 400 })

  try {
    const product = await updateAdminProduct(env.DB, id, await request.json())
    if (!product) return json({ error: 'Product not found' }, { status: 404 })
    return json(product)
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Invalid product payload' }, { status: 400 })
  }
}
