export type CartVariant = {
  productId: string
  variantId: string
  slug: string
  name: string
  variantName: string
  imageUrl: string
  unitPrice: number
  stockQuantity: number
}

export type CartItem = CartVariant & { quantity: number }
export type CartState = { items: CartItem[] }

type CartAction =
  | { type: 'item/added'; payload: { variant: CartVariant; quantity: number } }
  | { type: 'quantity/updated'; payload: { variantId: string; quantity: number } }
  | { type: 'item/removed'; payload: { variantId: string } }
  | { type: 'cart/cleared' }

export const initialCartState: CartState = { items: [] }

export const addCartItem = (variant: CartVariant, quantity = 1): CartAction => ({
  type: 'item/added',
  payload: { variant, quantity },
})

export const updateCartQuantity = (variantId: string, quantity: number): CartAction => ({
  type: 'quantity/updated',
  payload: { variantId, quantity },
})

export const removeCartItem = (variantId: string): CartAction => ({
  type: 'item/removed',
  payload: { variantId },
})

export const clearCart = (): CartAction => ({ type: 'cart/cleared' })

export function cartReducer(state: CartState, action: CartAction): CartState {
  if (action.type === 'cart/cleared') return initialCartState

  if (action.type === 'item/removed') {
    return { items: state.items.filter((item) => item.variantId !== action.payload.variantId) }
  }

  if (action.type === 'quantity/updated') {
    if (action.payload.quantity <= 0) {
      return { items: state.items.filter((item) => item.variantId !== action.payload.variantId) }
    }

    return {
      items: state.items.map((item) =>
        item.variantId === action.payload.variantId
          ? { ...item, quantity: Math.min(action.payload.quantity, item.stockQuantity) }
          : item,
      ),
    }
  }

  const { variant, quantity } = action.payload
  const existing = state.items.find((item) => item.variantId === variant.variantId)
  if (!existing) {
    return {
      items: [...state.items, { ...variant, quantity: Math.min(Math.max(quantity, 1), variant.stockQuantity) }],
    }
  }

  return {
    items: state.items.map((item) =>
      item.variantId === variant.variantId
        ? { ...item, quantity: Math.min(item.quantity + quantity, item.stockQuantity) }
        : item,
    ),
  }
}

export const getCartCount = (state: CartState) =>
  state.items.reduce((total, item) => total + item.quantity, 0)

export const getCartSubtotal = (state: CartState) =>
  state.items.reduce((total, item) => total + item.unitPrice * item.quantity, 0)
