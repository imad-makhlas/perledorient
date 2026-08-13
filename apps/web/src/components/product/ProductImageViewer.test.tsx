import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ProductImageViewer } from './ProductImageViewer'

describe('ProductImageViewer', () => {
  it('opens the product photo in a large dialog after a click', async () => {
    render(<ProductImageViewer
      images={['/jewel.jpg', '/jewel-detail.jpg', '/jewel-worn.jpg']}
      alt="Collier Layali"
      openLabel="Agrandir la photo du bijou"
      closeLabel="Fermer la photo agrandie"
      dialogLabel="Photo agrandie : Collier Layali"
      enlargedAlt="Collier Layali — vue agrandie"
      hint="Agrandir"
    />)

    expect(screen.queryByRole('dialog', { name: 'Photo agrandie : Collier Layali' })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Agrandir la photo du bijou' }))

    const dialog = screen.getByRole('dialog', { name: 'Photo agrandie : Collier Layali' })
    expect(within(dialog).getByRole('img', { name: 'Collier Layali — vue agrandie' })).toBeInTheDocument()
    expect(within(dialog).getByText('1 / 3')).toBeInTheDocument()

    await userEvent.click(within(dialog).getByRole('button', { name: 'Image suivante' }))
    expect(within(dialog).getByRole('img', { name: 'Collier Layali — vue agrandie' })).toHaveAttribute('src', '/jewel-detail.jpg')
    expect(within(dialog).getByText('2 / 3')).toBeInTheDocument()
  })

  it('closes the enlarged photo with the close button and Escape', async () => {
    render(<ProductImageViewer
      images={['/jewel.jpg', '/jewel-detail.jpg']}
      alt="Collier Layali"
      openLabel="Agrandir la photo du bijou"
      closeLabel="Fermer la photo agrandie"
      dialogLabel="Photo agrandie : Collier Layali"
      enlargedAlt="Collier Layali — vue agrandie"
      hint="Agrandir"
    />)
    const openButton = screen.getByRole('button', { name: 'Agrandir la photo du bijou' })

    await userEvent.click(openButton)
    await userEvent.click(screen.getByRole('button', { name: 'Fermer la photo agrandie' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await userEvent.click(openButton)
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('offers scrollable slides, thumbnails, and gallery navigation outside the zoom', async () => {
    render(<ProductImageViewer
      images={['/jewel.jpg', '/jewel-detail.jpg', '/jewel-worn.jpg']}
      alt="Collier Layali"
      openLabel="Agrandir la photo du bijou"
      closeLabel="Fermer la photo agrandie"
      dialogLabel="Photo agrandie : Collier Layali"
      enlargedAlt="Collier Layali — vue agrandie"
      hint="Agrandir"
    />)

    expect(screen.getByRole('region', { name: 'Galerie photo : Collier Layali' })).toHaveClass('overflow-x-auto', 'snap-x')
    expect(screen.getAllByRole('button', { name: /Afficher la photo/ })).toHaveLength(3)
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Image suivante' }))
    expect(screen.getByText('2 / 3')).toBeInTheDocument()
  })
})
