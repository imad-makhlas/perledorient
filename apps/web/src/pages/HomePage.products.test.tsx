import { render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/i18n'
import { CartProvider } from '../features/cart/cart-context'
import { HomePage } from './HomePage'

afterEach(() => vi.unstubAllGlobals())

describe('homepage product showcase', () => {
  it('keeps the original vertical card design while using live product photos and links', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify([{
      id: 'real-1', slug: 'collier-reel', name: 'Collier Réel', brand: 'Casa de Perla', category: 'Necklaces',
      image: 'https://cdn.example.com/collier.jpg', images: ['https://cdn.example.com/collier.jpg'], price: 520,
      stock: 2, featured: true, isNew: false, shortDescription: '', description: '',
      variants: [{ id: 'variant-real-1', name: 'Doré', sku: 'CDP-REAL-1', price: 520, stock: 2, image: 'https://cdn.example.com/collier.jpg' }], specifications: {},
    }]), { status: 200, headers: { 'Content-Type': 'application/json' } })))

    render(<MemoryRouter><I18nProvider><CartProvider><HomePage /></CartProvider></I18nProvider></MemoryRouter>)

    const mobileProducts = await screen.findByTestId('mobile-home-products')
    const desktopProducts = screen.getByTestId('desktop-home-products')
    const mobileBanner = screen.getByTestId('mobile-home-banner')
    expect(mobileBanner).toHaveClass('sm:hidden')
    expect(within(mobileBanner).getByRole('img', { name: 'Collection de bijoux artisanaux Casa de Perla' })).toBeInTheDocument()
    expect(within(mobileBanner).getByText('Créés lentement. Portés longtemps.')).toBeInTheDocument()
    expect(mobileProducts).toHaveClass('grid', 'grid-cols-2', 'gap-3', 'sm:hidden')
    const mobileImage = within(mobileProducts).getByRole('img', { name: 'Collier Réel' })
    const mobileLink = mobileImage.closest('a')
    expect(mobileLink).toHaveAttribute('href', '/products/collier-reel')
    expect(mobileLink).toHaveClass('aspect-[4/5]', 'w-full')
    expect(within(mobileProducts).queryByRole('button', { name: /Commander Collier Réel/i })).not.toBeInTheDocument()
    expect(within(mobileProducts).queryByText(/520.*MAD/)).not.toBeInTheDocument()
    expect(desktopProducts).toHaveClass('hidden', 'sm:grid')
    const image = within(desktopProducts).getByRole('img', { name: 'Collier Réel' })
    expect(image).toHaveAttribute('src', 'https://cdn.example.com/collier.jpg')
    expect(image.closest('a')).toHaveAttribute('href', '/products/collier-reel')
  })
})
