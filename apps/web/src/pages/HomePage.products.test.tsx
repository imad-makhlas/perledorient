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
    const hero = screen.getByTestId('home-hero')
    const heroImage = within(hero).getByRole('img', { name: 'Collection de bijoux artisanaux Casa de Perla' })
    expect(hero).not.toHaveClass('hidden')
    expect(heroImage.closest('a')).toHaveAttribute('href', '/catalogue')
    expect(heroImage).toHaveAttribute('src', 'https://cdn.example.com/collier.jpg')
    expect(hero.firstElementChild).toHaveClass('block')
    expect(hero.firstElementChild).not.toHaveClass('container-shell')
    expect(heroImage).toHaveClass('h-[220px]', 'sm:h-[340px]', 'lg:h-[460px]')
    expect(heroImage).not.toHaveClass('rounded-[6px]', 'border', 'shadow-[0_18px_50px_rgba(47,42,44,.09)]')
    expect(within(hero).queryByRole('heading')).not.toBeInTheDocument()
    expect(within(hero).queryByText('Créés lentement. Portés longtemps.')).not.toBeInTheDocument()
    expect(mobileProducts).toHaveClass('grid', 'grid-cols-2', 'gap-3', 'sm:hidden')
    const mobileImage = within(mobileProducts).getByRole('img', { name: 'Collier Réel' })
    const mobileLink = mobileImage.closest('a')
    expect(mobileLink).toHaveAttribute('href', '/products/collier-reel')
    expect(mobileLink).toHaveClass('aspect-[4/5]', 'w-full')
    expect(within(mobileProducts).queryByRole('button', { name: /Commander Collier Réel/i })).not.toBeInTheDocument()
    expect(within(mobileProducts).queryByText(/520.*MAD/)).not.toBeInTheDocument()
    expect(desktopProducts).toHaveClass('hidden', 'sm:grid', 'lg:grid-cols-4')
    expect(screen.getByRole('heading', { name: 'Trouvez votre pièce.' })).toHaveClass('text-3xl', 'sm:text-4xl')
    const image = within(desktopProducts).getByRole('img', { name: 'Collier Réel' })
    expect(image).toHaveAttribute('src', 'https://cdn.example.com/collier.jpg')
    expect(image.closest('a')).toHaveAttribute('href', '/products/collier-reel')
  })
})
