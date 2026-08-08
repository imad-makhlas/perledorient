import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AdminDashboardPage } from './AdminDashboardPage'

afterEach(() => vi.unstubAllGlobals())

describe('Admin dashboard mobile entry', () => {
  it('returns to the top after a successful login', async () => {
    const scrollTo = vi.fn()
    vi.stubGlobal('scrollTo', scrollTo)
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } })))

    render(<AdminDashboardPage />)
    await userEvent.type(screen.getByLabelText('Adresse administrateur'), 'atelier@perledorient.com')
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'secret')
    await userEvent.click(screen.getByRole('button', { name: /Ouvrir/ }))

    await screen.findByRole('heading', { name: /Vue d/ })
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' })
  })

  it('organizes each order into clear customer, product, and action sections', async () => {
    vi.stubGlobal('scrollTo', vi.fn())
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify([{
        orderNumber: 'PDO-2026-0001', customerName: 'Imad Makhlas', customerTelephone: '+212652603417',
        city: 'Casablanca', address: 'Fès trik Mouzzer', notes: '', subtotal: '520', deliveryFee: '0', total: '520',
        paymentMethod: 'WHATSAPP', status: 'PENDING_CONFIRMATION', createdAt: '2026-08-07T10:00:00.000Z',
        whatsappUrl: 'https://wa.me/212631210654',
        items: [{ productName: 'Collier Layali', variantName: 'Or antique', sku: 'PDO-BIJ-2026-0001', quantity: 1, lineTotal: '520' }],
      }]), { status: 200, headers: { 'Content-Type': 'application/json' } })))

    render(<AdminDashboardPage />)
    await userEvent.type(screen.getByLabelText('Adresse administrateur'), 'atelier@perledorient.com')
    await userEvent.type(screen.getByLabelText('Mot de passe'), 'secret')
    await userEvent.click(screen.getByRole('button', { name: /Ouvrir/ }))
    await screen.findByRole('heading', { name: /Vue d/ })
    await userEvent.click(screen.getByRole('button', { name: /^Commandes/ }))

    expect(screen.getByRole('group', { name: 'Coordonnées client' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Articles de la commande' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Actions de la commande' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Commande n° PDO-2026-0001' })).toBeInTheDocument()
    expect(screen.getByText('Réf. produit : PDO-BIJ-2026-0001')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Contacter sur WhatsApp/ })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Imprimer le ticket' }))
    expect(screen.getByRole('dialog', { name: 'Ticket de la commande PDO-2026-0001' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Supprimer' })).toBeInTheDocument()
  })
})
