import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { I18nProvider } from '../../i18n/i18n'
import { Footer } from './Footer'

describe('Footer', () => {
  it('uses an editorial brand signature instead of a boxed corporate contact card', () => {
    const { container } = render(<MemoryRouter><I18nProvider><Footer /></I18nProvider></MemoryRouter>)

    const footer = container.querySelector('footer')
    const contact = screen.getByRole('region', { name: 'Coordonnées Casa de Perla' })
    const signature = screen.getByText(/© 2026 Casa de Perla/)

    expect(footer).toHaveClass('bg-white', 'text-ink', 'border-accent/60')
    expect(footer).not.toHaveClass('bg-[#2F2A2C]', 'text-white')
    expect(screen.getByLabelText('Casa de Perla').firstElementChild).toHaveClass('text-[#2f2a2c]')
    expect(screen.getByRole('heading', { name: 'L’art du bijou, en petites séries.' })).toBeInTheDocument()
    expect(contact).toHaveClass('bg-white', 'text-ink', 'md:border-l')
    expect(contact).not.toHaveClass('rounded-[8px]', 'shadow-[0_16px_40px_rgba(47,42,44,0.08)]', 'ring-1')
    expect(signature).toHaveClass('bg-white', 'text-muted', 'border-accent/30')
  })
})
