export type LogoTone = 'dark' | 'light'

export function getBrandLabel(markOnly: boolean) {
  return markOnly ? "Perle d'Orient arch and pearl mark" : "Perle d'Orient"
}

export function getLogoToneClass(tone: LogoTone) {
  return tone === 'light' ? 'text-white' : 'text-burgundy'
}
