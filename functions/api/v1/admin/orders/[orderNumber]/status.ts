import { json, requireAdmin, updateAdminOrderStatus, type PagesContext } from '../../_shared'

export async function onRequestPatch({ request, env, params }: PagesContext) {
  const authError = requireAdmin(request, env)
  if (authError) return authError
  const orderNumber = Array.isArray(params.orderNumber) ? params.orderNumber[0] : params.orderNumber
  if (!orderNumber) return json({ error: 'Order not found' }, { status: 404 })
  try {
    const body = await request.json() as { status?: string }
    const order = await updateAdminOrderStatus(env.DB, orderNumber, body.status || '')
    return order ? json(order) : json({ error: 'Order not found' }, { status: 404 })
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Unable to update order' }, { status: 400 })
  }
}
