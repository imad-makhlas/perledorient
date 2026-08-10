import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { DeliveryCityField } from './DeliveryCityField'

function CityFieldHarness() {
  const [city, setCity] = useState('Fès')

  return <DeliveryCityField
    value={city}
    country="MA"
    locale="fr"
    label="Ville"
    cities={['Casablanca', 'Fès', 'Ifrane', 'Rabat']}
    onChange={setCity}
  />
}

describe('DeliveryCityField', () => {
  it('opens a polished searchable city menu and selects one result', async () => {
    const user = userEvent.setup()
    render(<CityFieldHarness />)

    const city = screen.getByRole('combobox', { name: 'Ville' })
    expect(city).toHaveAttribute('aria-expanded', 'false')

    await user.click(city)
    expect(city).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('listbox', { name: 'Villes disponibles' })).toBeInTheDocument()

    await user.clear(city)
    await user.type(city, 'Casa')
    expect(screen.getByRole('option', { name: 'Casablanca' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Ifrane' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('option', { name: 'Casablanca' }))
    expect(city).toHaveValue('Casablanca')
    expect(city).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})
