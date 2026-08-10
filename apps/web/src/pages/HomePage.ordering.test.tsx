import { render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/i18n'
import { CartProvider } from '../features/cart/cart-context'
import { HomePage } from './HomePage'

afterEach(() => vi.unstubAllGlobals())

describe('homepage ordering guide', () => {
  it('explains the WhatsApp order journey in three clear steps without an atelier image', () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    render(<MemoryRouter><I18nProvider><CartProvider><HomePage /></CartProvider></I18nProvider></MemoryRouter>)

    expect(screen.getByRole('heading', { name: 'Comment commander ?' })).toBeInTheDocument()
    expect(screen.getByText('Choisissez votre bijou')).toBeInTheDocument()
    expect(screen.getByText('Renseignez la livraison')).toBeInTheDocument()
    expect(screen.getByText('Confirmez sur WhatsApp')).toBeInTheDocument()
    expect(screen.getByText('Votre commande, préparée personnellement en quelques étapes.')).toBeInTheDocument()
    const guide = screen.getByLabelText('Comment commander')
    expect(guide).toHaveClass('bg-[#F3EFE7]')
    expect(guide).toHaveClass('hidden', 'sm:block')
    expect(screen.getByTestId('home-hero')).toHaveClass('hidden', 'sm:block')
    expect(within(guide).getByText('01')).toBeInTheDocument()
    expect(within(guide).getByText('02')).toBeInTheDocument()
    expect(within(guide).getByText('03')).toBeInTheDocument()
    const cards = within(guide).getAllByRole('listitem')
    expect(cards).toHaveLength(3)
    cards.forEach((card) => {
      expect(card).toHaveAttribute('data-order-step')
      expect(card).not.toHaveClass('bg-white', 'rounded-[22px]')
    })
  })
})
