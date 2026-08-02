export function isHeaderLinkActive(currentPath: string, currentSearch: string, target: string) {
  const [targetPath, targetQuery = ''] = target.split('?')
  if (currentPath !== targetPath) return false
  if (targetPath !== '/catalogue') return true
  const currentCategory = new URLSearchParams(currentSearch).get('category')
  const targetCategory = new URLSearchParams(targetQuery).get('category')
  return currentCategory === targetCategory
}
