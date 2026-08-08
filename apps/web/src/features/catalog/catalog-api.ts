import { useEffect, useState } from 'react'
import { products as fallbackProducts } from '../../data/jewelry-products'
import type { Product } from './catalog'

export async function fetchCatalogProducts(locale: 'fr' | 'ar') {
  const response = await fetch(`/api/v1/products?locale=${locale}`)
  if (!response.ok) throw new Error('Unable to load catalogue')
  return response.json() as Promise<Product[]>
}

export function useCatalogProducts(locale: 'fr' | 'ar') {
  const [products, setProducts] = useState<Product[]>(fallbackProducts)
  useEffect(() => {
    let active = true
    fetchCatalogProducts(locale).then((data) => {
      if (active && data.length) setProducts(data)
    }).catch(() => undefined)
    return () => { active = false }
  }, [locale])
  return products
}
