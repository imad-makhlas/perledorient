import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/i18n'
import { HomePage } from './HomePage'

afterEach(() => vi.unstubAllGlobals())

describe('homepage product showcase', () => {
  it('keeps the original vertical card design while using live product photos and links', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify([{
      id: 'real-1', slug: 'collier-reel', name: 'Collier Réel', brand: "Perle d'Orient", category: 'Necklaces',
      image: 'https://cdn.example.com/collier.jpg', images: ['https://cdn.example.com/collier.jpg'], price: 520,
      stock: 2, featured: true, isNew: false, shortDescription: '', description: '', variants: [], specifications: {},
    }]), { status: 200, headers: { 'Content-Type': 'application/json' } })))

    render(<MemoryRouter><I18nProvider><HomePage /></I18nProvider></MemoryRouter>)

    const image = await screen.findByRole('img', { name: 'Collier Réel' })
    expect(image).toHaveAttribute('src', 'https://cdn.example.com/collier.jpg')
    expect(image.closest('a')).toHaveAttribute('href', '/products/collier-reel')
    expect(image.closest('a')).toHaveClass('aspect-[4/5]')
    expect(screen.queryByRole('button', { name: /Commander Collier Réel/i })).not.toBeInTheDocument()
  })
})
