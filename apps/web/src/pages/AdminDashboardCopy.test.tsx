import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AdminDashboardPage } from './AdminDashboardPage'

afterEach(() => vi.unstubAllGlobals())

async function signIn() {
  await userEvent.type(screen.getByLabelText('Adresse administrateur'), 'atelier@perledorient.com')
  await userEvent.type(screen.getByLabelText('Mot de passe'), 'secret')
  await userEvent.click(screen.getByRole('button', { name: /Ouvrir/ }))
}

describe('Admin dashboard French copy', () => {
  it('shows clean French catalogue copy and translated category labels', async () => {
    vi.stubGlobal('scrollTo', vi.fn())
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify([{
        id: 'row-1', productId: 'gift-1', slug: 'coffret-heritage', nameFr: 'Coffret Héritage', nameAr: 'علبة التراث',
        descriptionFr: '', descriptionAr: '', category: 'Gift Sets', material: 'Laiton', dimensions: '',
        variantName: 'Or antique', sku: 'PDO-BIJ-2026-0001', price: 980, comparisonPrice: null, stock: 16,
        active: true, featured: false, imageUrl: '', imageUrls: [],
      }]), { status: 200, headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } })))

    render(<AdminDashboardPage />)
    await signIn()
    await screen.findByRole('heading', { name: 'Vue d’ensemble' })
    await userEvent.click(screen.getByRole('button', { name: /^Catalogue/ }))

    expect(screen.getByText('Gestion des pièces')).toBeInTheDocument()
    expect(screen.getByText('1 bijou enregistré')).toBeInTheDocument()
    expect(screen.getByText('Publié')).toBeInTheDocument()
    expect(screen.getByText('Coffrets cadeaux')).toBeInTheDocument()
    expect(screen.queryByText('Gift Sets')).not.toBeInTheDocument()
  })
})
