import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DEFAULT_DELIVERY_SETTINGS } from '../../features/checkout/delivery-pricing'
import { DeliverySettingsEditor } from './DeliverySettingsEditor'

describe('DeliverySettingsEditor', () => {
  it('presents the four Silver delivery rates without advanced city configuration', () => {
    render(<DeliverySettingsEditor settings={DEFAULT_DELIVERY_SETTINGS} busy={false} onSave={vi.fn()} />)

    expect(screen.getByLabelText('Tarif ville de ramassage')).toHaveValue(20)
    expect(screen.getByLabelText('Grandes villes')).toHaveValue(35)
    expect(screen.getByLabelText('Régions Nord')).toHaveValue(40)
    expect(screen.getByLabelText('Régions Sud')).toHaveValue(45)
    expect(screen.queryByText('Répartition des villes')).not.toBeInTheDocument()
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0)
  })

  it('edits the Silver delivery rates while preserving the saved configuration', async () => {
    const onSave = vi.fn()
    render(<DeliverySettingsEditor settings={DEFAULT_DELIVERY_SETTINGS} busy={false} onSave={onSave} />)

    const pickup = screen.getByLabelText('Ville de ramassage')
    await userEvent.clear(pickup)
    await userEvent.type(pickup, 'Fès')
    await userEvent.clear(screen.getByLabelText('Livraison offerte dès'))
    await userEvent.type(screen.getByLabelText('Livraison offerte dès'), '2000')
    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer les tarifs' }))

    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ pickupCity: 'Fès', freeThreshold: 2000, pickupFee: 20, majorCityFee: 35, northRegionFee: 40, southRegionFee: 45 }))
  })
})
