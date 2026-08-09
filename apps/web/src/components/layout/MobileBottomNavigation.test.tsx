import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { I18nProvider } from '../../i18n/i18n'
import { MobileBottomNavigation } from './MobileBottomNavigation'

describe('MobileBottomNavigation', () => {
  it('identifies the current destination clearly for mobile visitors', () => {
    render(
      <MemoryRouter initialEntries={['/catalogue']}>
        <I18nProvider>
          <MobileBottomNavigation />
        </I18nProvider>
      </MemoryRouter>,
    )

    const currentLink = screen.getByRole('link', { name: 'Catalogue, page actuelle' })
    expect(currentLink).toHaveAttribute('aria-current', 'page')
    expect(screen.getAllByRole('link')).toHaveLength(4)
  })
})
