export type LogoTone = 'dark' | 'light'

export const BRAND_NAME = 'Casa de Perla'
export const BRAND_DOMAIN = 'casadeperla.com'
export const BRAND_ORIGIN = `https://${BRAND_DOMAIN}`
export const DEFAULT_ADMIN_EMAIL = 'atelier@gmail.com'

export function getBrandLabel(markOnly: boolean) {
  return markOnly ? `${BRAND_NAME} house and pearl mark` : BRAND_NAME
}

export function getLogoToneClass(tone: LogoTone) {
  return tone === 'light' ? 'text-white' : 'text-[#2f2a2c]'
}
