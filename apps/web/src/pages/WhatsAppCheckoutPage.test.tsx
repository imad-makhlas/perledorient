import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { CartProvider } from '../features/cart/cart-context'
import { I18nProvider } from '../i18n/i18n'
import { WhatsAppCheckoutPage } from './WhatsAppCheckoutPage'

afterEach(() => vi.unstubAllGlobals())

describe('WhatsApp checkout', () => {
  it('combines the selected international calling code with the national number', async () => {
    localStorage.setItem('codavenue-cart', JSON.stringify({ items: [{
      productId: 'product-1', variantId: 'variant-1', slug: 'layali', name: 'Layali Necklace', variantName: 'Gold',
      imageUrl: '/layali.jpg', unitPrice: 520, quantity: 1, stockQuantity: 1,
    }] }))
    const fetchMock = vi.fn().mockImplementation((url: string) => Promise.resolve(new Response(JSON.stringify(url.includes('/delivery') ? {} : {
      orderNumber: 'PDO-1', total: 555, deliveryFee: 35, whatsappUrl: 'https://wa.me/212631210654',
    }), { status: url.includes('/delivery') ? 200 : 201, headers: { 'Content-Type': 'application/json' } })))
    vi.stubGlobal('fetch', fetchMock)
    vi.stubGlobal('open', vi.fn())

    render(<MemoryRouter initialEntries={['/checkout']}><I18nProvider><CartProvider><Routes>
      <Route path="/checkout" element={<WhatsAppCheckoutPage />} />
      <Route path="/" element={<div>Accueil Casa de Perla</div>} />
    </Routes></CartProvider></I18nProvider></MemoryRouter>)

    expect(screen.getByText('Vos coordonnées')).toBeInTheDocument()
    expect(screen.getByText('Informations de livraison')).toBeInTheDocument()
    await userEvent.type(screen.getByLabelText('Prénom'), 'Sara')
    await userEvent.type(screen.getByLabelText('Nom'), 'Amrani')
    await userEvent.selectOptions(screen.getByLabelText('Country code'), 'FR')
    await userEvent.type(screen.getByLabelText('Téléphone'), '612345678')
    await userEvent.type(screen.getByLabelText('Adresse de livraison'), '12 rue des Fleurs')
    await userEvent.click(screen.getByRole('button', { name: 'Continuer sur WhatsApp' }))

    await screen.findByText('Accueil Casa de Perla')
    const orderCall = fetchMock.mock.calls.find(([url]) => String(url).includes('/orders'))
    const request = JSON.parse(String(orderCall?.[1]?.body))
    expect(request.customer.telephone).toBe('+33612345678')
    expect(request.locale).toBe('fr')
  }, 15_000)

  it('clears only this browser cart after its order is created', async () => {
    localStorage.setItem('codavenue-cart', JSON.stringify({ items: [{
      productId: 'product-1', variantId: 'variant-1', slug: 'layali', name: 'Layali Necklace', variantName: 'Gold',
      imageUrl: '/layali.jpg', unitPrice: 520, quantity: 1, stockQuantity: 1,
    }] }))
    vi.stubGlobal('fetch', vi.fn().mockImplementation((url: string) => Promise.resolve(new Response(JSON.stringify(url.includes('/delivery') ? {} : {
      orderNumber: 'PDO-1', total: 555, deliveryFee: 35, whatsappUrl: 'https://wa.me/212600000000',
    }), { status: url.includes('/delivery') ? 200 : 201, headers: { 'Content-Type': 'application/json' } }))))
    vi.stubGlobal('open', vi.fn())

    render(<MemoryRouter initialEntries={['/checkout']}><I18nProvider><CartProvider><Routes>
      <Route path="/checkout" element={<WhatsAppCheckoutPage />} />
      <Route path="/" element={<div>Accueil Casa de Perla</div>} />
    </Routes></CartProvider></I18nProvider></MemoryRouter>)

    await userEvent.type(screen.getByLabelText('Prénom'), 'Sara')
    await userEvent.type(screen.getByLabelText('Nom'), 'Amrani')
    await userEvent.type(screen.getByLabelText('Téléphone'), '+212612345678')
    await userEvent.type(screen.getByLabelText('Adresse de livraison'), '12 rue des Fleurs')
    await userEvent.click(screen.getByRole('button', { name: 'Continuer sur WhatsApp' }))

    await screen.findByText('Accueil Casa de Perla')
    await waitFor(() => expect(JSON.parse(localStorage.getItem('codavenue-cart') || '{}')).toEqual({ items: [] }))
  }, 15_000)
})
