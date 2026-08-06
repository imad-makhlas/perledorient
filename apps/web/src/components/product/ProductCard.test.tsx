import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { products } from '../../data/jewelry-products'
import { CartProvider } from '../../features/cart/cart-context'
import { I18nProvider } from '../../i18n/i18n'
import { ProductCard } from './ProductCard'

describe('ProductCard compact catalogue layout', () => {
  it('places the square image inside a padded rounded card frame', () => {
    render(<MemoryRouter><I18nProvider><CartProvider><ProductCard product={products[0]} /></CartProvider></I18nProvider></MemoryRouter>)

    const imageLink = screen.getByRole('img', { name: 'Layali Necklace' }).closest('a')
    expect(imageLink).not.toBeNull()
    expect(imageLink).toHaveClass('aspect-square')
    expect(imageLink).not.toHaveClass('aspect-[4/5]')
    expect(imageLink).toHaveClass('rounded-[16px]')
    expect(imageLink?.parentElement).toHaveClass('p-2.5')
  })
})
