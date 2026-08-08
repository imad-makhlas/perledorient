import type { AdminProduct, EditableAdminProduct } from './admin-products'

export function productUpdatePayload(product: AdminProduct | EditableAdminProduct): EditableAdminProduct {
  return {
    slug: product.slug,
    nameFr: product.nameFr,
    nameAr: product.nameAr,
    descriptionFr: product.descriptionFr,
    descriptionAr: product.descriptionAr,
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
    imageUrls: product.imageUrls,
  }
}
