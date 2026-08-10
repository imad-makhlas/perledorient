import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { CartProvider } from '../features/cart/cart-context'
import { I18nProvider } from '../i18n/i18n'
import { ProductPage } from './ProductPage'

afterEach(() => vi.unstubAllGlobals())

function renderProductPage() {
  return render(<MemoryRouter initialEntries={['/products/layali-necklace']}><I18nProvider><CartProvider><Routes>
    <Route path="/products/:slug" element={<ProductPage />} />
    <Route path="/checkout" element={<div>Checkout form</div>} />
  </Routes></CartProvider></I18nProvider></MemoryRouter>)
}

describe('Product page direct WhatsApp order', () => {
  it('keeps only the selected product and opens the checkout form', async () => {
    localStorage.setItem('codavenue-cart', JSON.stringify({ items: [{
      productId: 'old-product', variantId: 'old-variant', slug: 'old-product', name: 'Old product',
      variantName: 'Old finish', imageUrl: '/old.jpg', unitPrice: 100, quantity: 1, stockQuantity: 2,
    }] }))
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Offline catalogue')))

    renderProductPage()

    await userEvent.click(screen.getByRole('button', { name: 'Increase quantity' }))
    const mobileActions = screen.getByRole('region', { name: 'Actions d’achat sur mobile' })
    await userEvent.click(within(mobileActions).getByRole('button', { name: 'Commander via WhatsApp' }))

    expect(await screen.findByText('Checkout form')).toBeInTheDocument()
    await waitFor(() => expect(JSON.parse(localStorage.getItem('codavenue-cart') || '{}')).toMatchObject({
      items: [{ productId: 'jewel-1', variantId: 'jewel-variant-1-a', quantity: 2 }],
    }))
  })

  it('keeps the mobile summary compact and the complete description closed', () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Offline catalogue')))
    renderProductPage()

    expect(screen.getByRole('heading', { level: 1 })).toHaveClass('text-[1.8rem]', 'sm:text-5xl')
    expect(screen.getByText(/handcrafted piece shaped by oriental motifs/i)).toHaveClass('hidden', 'sm:block')
    expect(screen.getByText('Description').closest('details')).not.toHaveAttribute('open')

    const actions = screen.getByRole('region', { name: 'Actions d’achat sur mobile' })
    expect(within(actions).getAllByRole('button')).toHaveLength(2)
    expect(actions).not.toHaveTextContent('Layali Necklace')
    expect(actions).not.toHaveTextContent('MAD')
  })
})
