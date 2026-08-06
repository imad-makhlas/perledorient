import { deleteAdminOrder, json, requireAdmin, type PagesContext } from '../_shared'

export async function onRequestDelete({ request, env, params }: PagesContext) {
  const authError = requireAdmin(request, env)
  if (authError) return authError
  const orderNumber = Array.isArray(params.orderNumber) ? params.orderNumber[0] : params.orderNumber
  if (!orderNumber) return json({ error: 'Order not found' }, { status: 404 })
  const deleted = await deleteAdminOrder(env.DB, orderNumber)
  return deleted ? json({ orderNumber, deleted: true }) : json({ error: 'Order not found or not cancelled' }, { status: 404 })
}
