import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { I18nProvider, useI18n } from './i18n'

function LocaleProbe() {
  const { locale, setLocale, t } = useI18n()
  return <><span>{locale}</span><span>{t('shop')}</span><button onClick={() => setLocale('ar')}>AR</button><button onClick={() => setLocale('fr')}>FR</button></>
}

describe('store locale', () => {
  it('defaults to French and applies LTR to the document', () => {
    localStorage.removeItem('perle-d-orient-locale')
    render(<I18nProvider><LocaleProbe /></I18nProvider>)
    expect(screen.getByText('fr')).toBeInTheDocument()
    expect(screen.getByText('Boutique')).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('lang', 'fr')
    expect(document.documentElement).toHaveAttribute('dir', 'ltr')
  })

  it('switches Arabic content and document direction together', async () => {
    render(<I18nProvider><LocaleProbe /></I18nProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'AR' }))
    expect(screen.getByText('ar')).toBeInTheDocument()
    expect(screen.getByText('المتجر')).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('lang', 'ar')
    expect(document.documentElement).toHaveAttribute('dir', 'rtl')
  })
})
