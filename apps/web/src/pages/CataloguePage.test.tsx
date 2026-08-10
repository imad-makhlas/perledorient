import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider } from '../features/cart/cart-context'
import { I18nProvider } from '../i18n/i18n'
import { CataloguePage } from './CataloguePage'

afterEach(() => vi.unstubAllGlobals())

describe('Catalogue compact filters', () => {
  it('keeps only the requested categories and sorting on one row', () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    render(<MemoryRouter><I18nProvider><CartProvider><CataloguePage /></CartProvider></I18nProvider></MemoryRouter>)

    expect(screen.getByRole('button', { name: 'Tous les bijoux' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Colliers' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bracelets' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: "Boucles d'oreilles" })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Bagues' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Coffrets cadeaux' })).not.toBeInTheDocument()
    expect(screen.queryByText('Disponibles')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Classer par.*Nos favoris/i })).toBeInTheDocument()

    const filterRow = screen.getByRole('button', { name: 'Tous les bijoux' }).closest('.catalog-filter-row')
    expect(filterRow).toHaveClass('catalog-filter-row-compact')
  })
})
