import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { AdminProduct } from '../../features/admin/admin-products'
import { ProductEditor } from './ProductEditor'

const product: AdminProduct = {
  id: 'variant-1', productId: 'product-1', slug: 'layali-necklace', nameEn: 'Layali Necklace', nameFr: 'Collier Layali',
  descriptionEn: 'Handmade necklace', descriptionFr: 'Collier artisanal', category: 'Necklaces', material: 'Brass', dimensions: '45 cm',
  variantName: 'Antique gold', sku: 'PDO-001-A', price: 520, comparisonPrice: 650, stock: 3, active: true, featured: true,
  imageUrl: 'https://res.cloudinary.com/perle/image/upload/v1/perle-dorient/products/old.jpg',
}

describe('ProductEditor image workflow', () => {
  it('shows an automatic yearly SKU instead of an editable field for a new product', () => {
    render(<ProductEditor
      product={null}
      busy={false}
      onClose={vi.fn()}
      onSave={vi.fn()}
      onUploadImage={vi.fn()}
      onDeleteImage={vi.fn()}
    />)

    expect(screen.queryByRole('textbox', { name: 'Référence SKU' })).not.toBeInTheDocument()
    expect(screen.getByText(`PDO-BIJ-${new Date().getFullYear()}-0001`)).toBeInTheDocument()
  })

  it('uploads a selected photo and submits the replacement without deleting the old image early', async () => {
    const onSave = vi.fn()
    const onDeleteImage = vi.fn().mockResolvedValue(undefined)
    render(<ProductEditor
      product={product}
      busy={false}
      onClose={vi.fn()}
      onSave={onSave}
      onUploadImage={vi.fn().mockResolvedValue('https://res.cloudinary.com/perle/image/upload/v2/perle-dorient/products/new.jpg')}
      onDeleteImage={onDeleteImage}
    />)

    fireEvent.change(screen.getByLabelText('Choisir une photo'), {
      target: { files: [new File(['image'], 'new.jpg', { type: 'image/jpeg' })] },
    })
    await screen.findByAltText('Aperçu de la nouvelle photo')
    await userEvent.click(screen.getByRole('button', { name: 'Enregistrer' }))

    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
      imageUrl: 'https://res.cloudinary.com/perle/image/upload/v2/perle-dorient/products/new.jpg',
    }), product.imageUrl)
    expect(onDeleteImage).not.toHaveBeenCalled()
  })

  it('cleans up a newly uploaded image when the editor is cancelled', async () => {
    const onClose = vi.fn()
    const onDeleteImage = vi.fn().mockResolvedValue(undefined)
    render(<ProductEditor
      product={null}
      busy={false}
      onClose={onClose}
      onSave={vi.fn()}
      onUploadImage={vi.fn().mockResolvedValue('https://res.cloudinary.com/perle/image/upload/v2/perle-dorient/products/new.jpg')}
      onDeleteImage={onDeleteImage}
    />)

    fireEvent.change(screen.getByLabelText('Choisir une photo'), {
      target: { files: [new File(['image'], 'new.jpg', { type: 'image/jpeg' })] },
    })
    await screen.findByAltText('Aperçu de la nouvelle photo')
    await userEvent.click(screen.getByRole('button', { name: 'Annuler' }))

    await waitFor(() => expect(onDeleteImage).toHaveBeenCalledWith('https://res.cloudinary.com/perle/image/upload/v2/perle-dorient/products/new.jpg'))
    expect(onClose).toHaveBeenCalled()
  })
})
