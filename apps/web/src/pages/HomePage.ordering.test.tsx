import { render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { I18nProvider } from '../i18n/i18n'
import { CartProvider } from '../features/cart/cart-context'
import { HomePage } from './HomePage'

afterEach(() => vi.unstubAllGlobals())

describe('homepage premium structure', () => {
  it('does not show an explanatory ordering section', () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    render(<MemoryRouter><I18nProvider><CartProvider><HomePage /></CartProvider></I18nProvider></MemoryRouter>)

    expect(screen.queryByRole('heading', { name: 'Comment commander ?' })).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Comment commander')).not.toBeInTheDocument()
    expect(screen.queryByText('Choisissez votre bijou')).not.toBeInTheDocument()
    expect(screen.getByTestId('home-hero')).not.toHaveClass('hidden')
  })

  it('places an elegant four-part service signature at the end of the homepage', () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    render(<MemoryRouter><I18nProvider><CartProvider><HomePage /></CartProvider></I18nProvider></MemoryRouter>)

    const assurances = screen.getByRole('region', { name: 'Informations de confiance' })

    expect(screen.getByRole('main').lastElementChild).toBe(assurances)
    expect(assurances).toHaveClass('bg-white', 'border-accent/45')
    expect(within(assurances).getByRole('heading', { name: 'Les engagements de la Maison' })).toBeInTheDocument()
    expect(within(assurances).getAllByRole('listitem')).toHaveLength(4)
    expect(within(assurances).getAllByTestId('assurance-index').map((item) => item.textContent)).toEqual(['01', '02', '03', '04'])
    expect(within(assurances).getByText('Paiement à la livraison')).toBeInTheDocument()
    expect(within(assurances).getByText('Virement bancaire')).toBeInTheDocument()
    expect(within(assurances).getByText('Livraison au Maroc')).toBeInTheDocument()
    expect(within(assurances).getByText('Confirmation WhatsApp')).toBeInTheDocument()
    expect(within(assurances).getByText('Réglez simplement à la réception')).toBeInTheDocument()
    expect(within(assurances).getByText('Une alternative sécurisée sur demande')).toBeInTheDocument()
    expect(within(assurances).getByText('Délais communiqués avant confirmation')).toBeInTheDocument()
    expect(within(assurances).getByText('Stock et livraison vérifiés avec vous')).toBeInTheDocument()
  })
})
