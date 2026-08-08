import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import type { Country } from 'react-phone-number-input'
import { describe, expect, it, vi } from 'vitest'
import { InternationalPhoneField } from './InternationalPhoneField'

function PhoneFieldHarness() {
  const [country, setCountry] = useState<Country>('MA')
  return <InternationalPhoneField country={country} value="" locale="fr" label="Téléphone" onCountryChange={setCountry} onChange={vi.fn()} />
}

describe('InternationalPhoneField', () => {
  it('shows a compact calling-code control that updates with the selected country', async () => {
    render(<PhoneFieldHarness />)

    expect(screen.getByText('+212')).toBeInTheDocument()
    await userEvent.selectOptions(screen.getByLabelText('Country code'), 'FR')
    expect(screen.getByText('+33')).toBeInTheDocument()
  })
})
