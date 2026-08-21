import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { products } from '../../data/jewelry-products'
import { CartProvider } from '../../features/cart/cart-context'
import { I18nProvider } from '../../i18n/i18n'
import { ProductCard } from './ProductCard'

describe('ProductCard compact catalogue layout', () => {
  it('lets the square image meet the outer card border while padding only the content', () => {
    render(<MemoryRouter><I18nProvider><CartProvider><ProductCard product={products[0]} /></CartProvider></I18nProvider></MemoryRouter>)

    const imageLink = screen.getByRole('img', { name: 'Layali Necklace' }).closest('a')
    expect(imageLink).not.toBeNull()
    expect(imageLink).toHaveClass('aspect-square')
    expect(imageLink).not.toHaveClass('aspect-[4/5]')
    expect(imageLink).not.toHaveClass('rounded-[6px]')
    expect(imageLink?.parentElement).toHaveClass('p-0', 'overflow-hidden')
    expect(imageLink?.parentElement).toHaveClass('rounded-[6px]')
    expect(imageLink?.nextElementSibling).toHaveClass('px-4')
    const productTitle = screen.getByRole('heading', { name: 'Layali Necklace' })
    expect(productTitle).toHaveClass('line-clamp-2')
    expect(productTitle).not.toHaveClass('min-h-[2.32em]')
    expect(productTitle.parentElement?.nextElementSibling).toHaveClass('mt-2')
    const orderButton = screen.getByRole('button', { name: 'Commander Layali Necklace via WhatsApp' })
    expect(orderButton).toHaveClass('rounded-[6px]')
    expect(orderButton).toHaveClass('product-order-button')
    expect(orderButton).not.toHaveClass('bg-[#2F2A2C]')
  })
})
