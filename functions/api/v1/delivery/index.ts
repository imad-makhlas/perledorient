import { getDeliverySettings, json, type PagesContext } from '../admin/_shared'

export async function onRequestGet({ env }: PagesContext) {
  return json(await getDeliverySettings(env.DB))
}
