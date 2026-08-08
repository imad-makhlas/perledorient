import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DEFAULT_DELIVERY_SETTINGS } from '../../features/checkout/delivery-pricing'
import { DeliverySettingsEditor } from './DeliverySettingsEditor'

describe('DeliverySettingsEditor', () => {
  it('edits the Silver delivery rates and submits normalized city lists', async () => {
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
