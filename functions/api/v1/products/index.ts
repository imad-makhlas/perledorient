import { catalogProductFromRow, type AdminProductRow } from '../../../../apps/web/src/features/admin/admin-product-record'
import { json, productColumns, type PagesContext } from '../admin/_shared'

export async function onRequestGet({ request, env }: PagesContext) {
  const locale = new URL(request.url).searchParams.get('locale') === 'fr' ? 'fr' : 'en'
  const result = await env.DB.prepare(`SELECT ${productColumns} FROM admin_products WHERE active = 1 ORDER BY featured DESC, created_at DESC`).all<AdminProductRow>()
  return json((result.results || []).map((row) => catalogProductFromRow(row, locale)))
}
