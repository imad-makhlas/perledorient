export function isMobileNavigationLinkActive(pathname: string, target: string) {
  if (target === '/') return pathname === '/'
  if (target === '/catalogue') return pathname === '/catalogue' || pathname.startsWith('/products/')
  return pathname === target
}
