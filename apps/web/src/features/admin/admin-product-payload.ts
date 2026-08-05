import type { AdminProduct, EditableAdminProduct } from './admin-products'

export function productUpdatePayload(product: AdminProduct | EditableAdminProduct): EditableAdminProduct {
  return {
    slug: product.slug,
    nameEn: product.nameEn,
    nameFr: product.nameFr,
    descriptionEn: product.descriptionEn,
    descriptionFr: product.descriptionFr,
    category: product.category,
    material: product.material,
    dimensions: product.dimensions,
    variantName: product.variantName,
    sku: product.sku,
    price: product.price,
    comparisonPrice: product.comparisonPrice,
    stock: product.stock,
    active: product.active,
    featured: product.featured,
    imageUrl: product.imageUrl,
  }
}
