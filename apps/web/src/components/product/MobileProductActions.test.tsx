import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MobileProductActions } from './MobileProductActions'

const labels = {
  regionLabel: 'Actions d’achat sur mobile',
  addLabel: 'Ajouter au panier',
  orderLabel: 'Commander via WhatsApp',
  compactOrderLabel: 'Commander',
}

describe('MobileProductActions', () => {
  it('shows exactly two purchase actions without repeating product metadata', async () => {
    const onAdd = vi.fn()
    const onOrder = vi.fn()
    render(<MobileProductActions {...labels} added={false} disabled={false} onAdd={onAdd} onOrder={onOrder} />)

    const region = screen.getByRole('region', { name: labels.regionLabel })
    expect(screen.getAllByRole('button')).toHaveLength(2)
    expect(region).not.toHaveTextContent('Layali Necklace')
    expect(region).not.toHaveTextContent('MAD')

    await userEvent.click(screen.getByRole('button', { name: labels.addLabel }))
    await userEvent.click(screen.getByRole('button', { name: labels.orderLabel }))
    expect(onAdd).toHaveBeenCalledOnce()
    expect(onOrder).toHaveBeenCalledOnce()
  })

  it('disables both actions when the selected variant is unavailable', () => {
    render(<MobileProductActions {...labels} added={false} disabled onAdd={() => undefined} onOrder={() => undefined} />)

    screen.getAllByRole('button').forEach((button) => expect(button).toBeDisabled())
  })
})
