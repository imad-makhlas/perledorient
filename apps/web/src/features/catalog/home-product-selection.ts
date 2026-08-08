import type { Product } from './catalog'

export function selectHomeProducts(products: Product[], limit = 5) {
  return [...products]
    .sort((left, right) => Number(right.featured) - Number(left.featured))
    .slice(0, limit)
}
