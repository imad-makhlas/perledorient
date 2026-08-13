import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { AdminProduct } from '../../features/admin/admin-products'
import { ProductEditor } from './ProductEditor'

const product: AdminProduct = {
  id: 'variant-1', productId: 'product-1', slug: 'layali-necklace', nameEn: 'Layali Necklace', nameFr: 'Collier Layali',
  nameAr: 'قلادة ليالي', descriptionEn: 'Handmade necklace', descriptionFr: 'Collier artisanal', descriptionAr: 'قلادة مصنوعة يدوياً', category: 'Necklaces', material: 'Brass', dimensions: '45 cm',
  variantName: 'Antique gold', sku: 'PDO-001-A', price: 520, comparisonPrice: 650, stock: 3, active: true, featured: true,
  imageUrl: 'https://res.cloudinary.com/perle/image/upload/v1/perle-dorient/products/old.jpg',
  imageUrls: ['https://res.cloudinary.com/perle/image/upload/v1/perle-dorient/products/old.jpg'],
}

describe('ProductEditor image workflow', () => {
  it('does not expose material or dimensions in the product form', () => {
    render(<ProductEditor
      product={product}
      suggestedSku={`CDP-BIJ-${new Date().getFullYear()}-0008`}
      busy={false}
      onClose={vi.fn()}
      onSave={vi.fn()}
      onUploadImage={vi.fn()}
      onDeleteImage={vi.fn()}
    />)

    expect(screen.queryByRole('textbox', { name: 'Matière' })).not.toBeInTheDocument()
    expect(screen.queryByRole('textbox', { name: 'Taille / dimensions' })).not.toBeInTheDocument()
  })

  it('explains that several products can be featured together', () => {
    render(<ProductEditor
      product={product}
      suggestedSku={`CDP-BIJ-${new Date().getFullYear()}-0008`}
      busy={false}
      onClose={vi.fn()}
      onSave={vi.fn()}
      onUploadImage={vi.fn()}
      onDeleteImage={vi.fn()}
    />)

    expect(screen.getByText(/plusieurs bijoux peuvent être mis en avant/i)).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /Mettre en avant/i })).toBeChecked()
  })

  it('shows French category labels while keeping technical category values', () => {
    render(<ProductEditor
      product={null}
      suggestedSku={`CDP-BIJ-${new Date().getFullYear()}-0008`}
      busy={false}
      onClose={vi.fn()}
      onSave={vi.fn()}
      onUploadImage={vi.fn()}
      onDeleteImage={vi.fn()}
    />)

    const category = screen.getByRole('combobox', { name: 'Catégorie' })
    expect(category).toHaveValue('Necklaces')
    expect(screen.getByRole('option', { name: 'Colliers' })).toHaveValue('Necklaces')
    expect(screen.getByRole('option', { name: "Boucles d'oreilles" })).toHaveValue('Earrings')
    expect(screen.getByRole('option', { name: 'Coffrets cadeaux' })).toHaveValue('Gift Sets')
  })

  it('shows an automatic yearly SKU instead of an editable field for a new product', () => {
    render(<ProductEditor
      product={null}
      suggestedSku={`CDP-BIJ-${new Date().getFullYear()}-0008`}
      busy={false}
      onClose={vi.fn()}
      onSave={vi.fn()}
      onUploadImage={vi.fn()}
      onDeleteImage={vi.fn()}
    />)

    expect(screen.queryByRole('textbox', { name: 'Référence SKU' })).not.toBeInTheDocument()
    expect(screen.getByText(`CDP-BIJ-${new Date().getFullYear()}-0008`)).toBeInTheDocument()
  })

  it('adds a selected photo without deleting the existing image early', async () => {
    const onSave = vi.fn()
    const onDeleteImage = vi.fn().mockResolvedValue(undefined)
    render(<ProductEditor
      product={product}
      suggestedSku={`CDP-BIJ-${new Date().getFullYear()}-0008`}
      busy={false}
      onClose={vi.fn()}
      onSave={onSave}
      onUploadImage={vi.fn().mockResolvedValue('https://res.cloudinary.com/perle/image/upload/v2/perle-dorient/products/new.jpg')}
      onDeleteImage={onDeleteImage}
    />)

    fireEvent.change(screen.getByLabelText('Choisir des photos'), {
      target: { files: [new File(['image'], 'new.jpg', { type: 'image/jpeg' })] },
    })
    await screen.findByAltText('Photo 2 du bijou')
    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
      imageUrl: product.imageUrl,
      imageUrls: [product.imageUrl, 'https://res.cloudinary.com/perle/image/upload/v2/perle-dorient/products/new.jpg'],
    }), [])
    expect(onDeleteImage).not.toHaveBeenCalled()
  })

  it('cleans up a newly uploaded image when the editor is cancelled', async () => {
    const onClose = vi.fn()
    const onDeleteImage = vi.fn().mockResolvedValue(undefined)
    render(<ProductEditor
      product={null}
      suggestedSku={`CDP-BIJ-${new Date().getFullYear()}-0008`}
      busy={false}
      onClose={onClose}
      onSave={vi.fn()}
      onUploadImage={vi.fn().mockResolvedValue('https://res.cloudinary.com/perle/image/upload/v2/perle-dorient/products/new.jpg')}
      onDeleteImage={onDeleteImage}
    />)

    fireEvent.change(screen.getByLabelText('Choisir des photos'), {
      target: { files: [new File(['image'], 'new.jpg', { type: 'image/jpeg' })] },
    })
    await screen.findByAltText('Photo 1 du bijou')
    await userEvent.click(screen.getByRole('button', { name: 'Annuler' }))

    await waitFor(() => expect(onDeleteImage).toHaveBeenCalledWith('https://res.cloudinary.com/perle/image/upload/v2/perle-dorient/products/new.jpg'))
    expect(onClose).toHaveBeenCalled()
  })
})
