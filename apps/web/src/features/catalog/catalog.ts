export type ProductVariant = {
  id: string
  name: string
  sku: string
  options: Record<string, string>
  price: number
  stock: number
  image?: string
}

export type ProductSummary = {
  id: string
  slug: string
  name: string
  brand: string
  category: string
  material?: string
  dimensions?: string
  image: string
  price: number
  comparisonPrice?: number
  stock: number
  featured: boolean
  isNew: boolean
}

export type Product = ProductSummary & {
  shortDescription: string
  description: string
  images: string[]
  variants: ProductVariant[]
  specifications: Record<string, string>
}

export type CatalogFilters = {
  search?: string
  category?: string
  brand?: string
  inStockOnly?: boolean
  sort?: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'
}

export function filterProducts(products: ProductSummary[], filters: CatalogFilters): ProductSummary[] {
  const query = filters.search?.trim().toLocaleLowerCase() ?? ''
  const filtered = products.filter((product) => {
    const matchesSearch = !query || `${product.name} ${product.brand} ${product.category} ${product.material ?? ''}`.toLocaleLowerCase().includes(query)
    const matchesCategory = !filters.category || product.category === filters.category
    const matchesBrand = !filters.brand || product.brand === filters.brand
    const matchesAvailability = !filters.inStockOnly || product.stock > 0
    return matchesSearch && matchesCategory && matchesBrand && matchesAvailability
  })

  return [...filtered].sort((left, right) => {
    switch (filters.sort) {
      case 'newest': return Number(right.isNew) - Number(left.isNew)
      case 'price-asc': return left.price - right.price
      case 'price-desc': return right.price - left.price
      case 'name-asc': return left.name.localeCompare(right.name)
      case 'name-desc': return right.name.localeCompare(left.name)
      default: return Number(right.featured) - Number(left.featured)
    }
  })
}

export const stockLabel = (stock: number) => stock <= 0 ? 'out' : stock <= 5 ? 'low' : 'in'
