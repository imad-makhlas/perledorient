import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { AdminOrder } from '../../features/admin/admin-orders'
import { OrderPrintTicket } from './OrderPrintTicket'

const order: AdminOrder = {
  orderNumber: 'PDO-2026-0007',
  customerName: 'Imad Makhlas',
  customerTelephone: '+212 631-210654',
  city: 'Casablanca',
  address: '12 rue des Orangers',
  notes: 'Emballage cadeau',
  subtotal: '980',
  deliveryFee: '0',
  total: '980',
  paymentMethod: 'CASH_ON_DELIVERY',
  status: 'CONFIRMED',
  createdAt: '2026-08-08T10:00:00.000Z',
  whatsappUrl: null,
  items: [
    { productName: 'Coffret Héritage', variantName: 'Or antique', sku: 'PDO-BIJ-2026-0012', quantity: 1, lineTotal: '980' },
  ],
}

afterEach(() => vi.unstubAllGlobals())

describe('OrderPrintTicket', () => {
  it('presents every detail needed to prepare the parcel', () => {
    render(<OrderPrintTicket order={order} onClose={() => undefined} />)

    expect(screen.getByRole('dialog', { name: 'Ticket de la commande PDO-2026-0007' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bon de préparation' })).toBeInTheDocument()
    expect(screen.getByText('Imad Makhlas')).toBeInTheDocument()
    expect(screen.getByText('12 rue des Orangers')).toBeInTheDocument()
    expect(screen.getByText('PDO-BIJ-2026-0012')).toBeInTheDocument()
    expect(screen.getByText('Emballage cadeau')).toBeInTheDocument()
    expect(screen.getByText('Paiement à la livraison')).toBeInTheDocument()
    expect(screen.getByText('Merci pour votre confiance.')).toBeInTheDocument()
  })

  it('prints and can be closed from the preview', async () => {
    const print = vi.fn()
    const onClose = vi.fn()
    vi.stubGlobal('print', print)
    render(<OrderPrintTicket order={order} onClose={onClose} />)

    await userEvent.click(screen.getByRole('button', { name: 'Imprimer maintenant' }))
    expect(print).toHaveBeenCalledOnce()

    await userEvent.click(screen.getByRole('button', { name: 'Fermer le ticket' }))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
