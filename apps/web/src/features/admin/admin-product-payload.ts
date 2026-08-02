export type EditableProductPayload = {
  productName: string
  variantName: string
  price: number
  stock: number
  active: boolean
  imageUrl: string
}

export function productUpdatePayload(product: EditableProductPayload): EditableProductPayload {
  return { ...product, productName: product.productName.trim(), variantName: product.variantName.trim(), imageUrl: product.imageUrl.trim() }
}
