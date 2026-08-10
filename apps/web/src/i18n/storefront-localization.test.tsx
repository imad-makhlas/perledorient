import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Footer } from '../components/layout/Footer'
import { CartProvider } from '../features/cart/cart-context'
import { HomePage } from '../pages/HomePage'
import { CataloguePage } from '../pages/CataloguePage'
import { I18nProvider } from './i18n'

function renderArabic(element: React.ReactNode) {
  localStorage.setItem('perle-d-orient-locale', 'ar')
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
  return render(<MemoryRouter><I18nProvider><CartProvider>{element}</CartProvider></I18nProvider></MemoryRouter>)
}

afterEach(() => vi.unstubAllGlobals())

describe('Arabic storefront copy', () => {
  it('translates the remaining homepage editorial copy', () => {
    renderArabic(<HomePage />)
    expect(screen.getByText('صُنعت بعناية. لترافقك دائماً.')).toBeInTheDocument()
    expect(screen.getByText('اختاري قطعتك.')).toBeInTheDocument()
    expect(screen.getByText('اكتشفي مجوهرات حرفية مستوحاة من دفء الشرق وتفاصيله وشاعريته. تُنجز كل قطعة من Casa de Perla ضمن مجموعات محدودة.')).toBeInTheDocument()
    expect(screen.queryByText(/Hand-finished|Find your piece|Made slowly/i)).not.toBeInTheDocument()
  })

  it('starts the catalogue with compact controls and no introductory heading', () => {
    renderArabic(<CataloguePage />)
    expect(screen.queryByRole('heading', { name: 'المجموعة' })).not.toBeInTheDocument()
    expect(screen.queryByText('مجوهرات حرفية مستوحاة من نفحة شرقية')).not.toBeInTheDocument()
    expect(screen.getByLabelText('10 قطع')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('البحث في المجموعة')).toBeInTheDocument()
  })

  it('translates the footer and uses the refined signature', () => {
    renderArabic(<Footer />)
    expect(screen.getByRole('heading', { name: 'المجوهرات' })).toBeInTheDocument()
    expect(screen.getByText('© 2026 Casa de Perla — إبداعات حرفية مستوحاة من الشرق. جميع الحقوق محفوظة.')).toBeInTheDocument()
    expect(screen.queryByText(/Handcrafted jewelry|The atelier|Our story/i)).not.toBeInTheDocument()
  })

  it('keeps the phone number clickable and contact details readable from left to right', () => {
    renderArabic(<Footer />)

    expect(screen.getByRole('region', { name: 'Coordonnées Casa de Perla' })).toHaveAttribute('dir', 'ltr')
    expect(screen.getByRole('link', { name: '+212 631-210654' })).toHaveAttribute('href', 'tel:+212631210654')
    expect(screen.getByText('+212 631-210654').closest('a')).toHaveAttribute('dir', 'ltr')
    expect(screen.getByText('@casadeperla.jewelry').closest('a')).toHaveAttribute('dir', 'ltr')
  })

})
