import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { CartProvider } from '../../features/cart/cart-context'
import { I18nProvider } from '../../i18n/i18n'
import { Header } from './Header'

describe('Header language selector', () => {
  it('shows both languages clearly and selects Arabic directly', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <I18nProvider>
          <CartProvider>
            <Header />
          </CartProvider>
        </I18nProvider>
      </MemoryRouter>,
    )

    const selector = screen.getByRole('group', { name: 'Choisir la langue' })
    const frenchButton = within(selector).getByRole('button', { name: 'Français' })
    const arabicButton = within(selector).getByRole('button', { name: 'العربية' })

    expect(frenchButton).toHaveAttribute('aria-pressed', 'true')
    expect(arabicButton).toHaveAttribute('aria-pressed', 'false')

    await user.click(arabicButton)

    expect(arabicButton).toHaveAttribute('aria-pressed', 'true')
    expect(document.documentElement).toHaveAttribute('dir', 'rtl')
  })
})
