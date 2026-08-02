import { createContext, useContext, useEffect, useMemo, useReducer, type Dispatch, type PropsWithChildren } from 'react'
import { cartReducer, getCartCount, getCartSubtotal, initialCartState, type CartState } from './cart'

const CartContext = createContext<{ state: CartState; dispatch: Dispatch<Parameters<typeof cartReducer>[1]>; count: number; subtotal: number } | null>(null)

export function CartProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState, (fallback) => {
    try { return JSON.parse(localStorage.getItem('codavenue-cart') ?? '') as CartState } catch { return fallback }
  })
  useEffect(() => localStorage.setItem('codavenue-cart', JSON.stringify(state)), [state])
  const value = useMemo(() => ({ state, dispatch, count: getCartCount(state), subtotal: getCartSubtotal(state) }), [state])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const value = useContext(CartContext)
  if (!value) throw new Error('useCart must be used within CartProvider')
  return value
}
