import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ProductImageViewer } from './ProductImageViewer'

describe('ProductImageViewer', () => {
  it('opens the product photo in a large dialog after a click', async () => {
    render(<ProductImageViewer
      src="/jewel.jpg"
      alt="Collier Layali"
      openLabel="Agrandir la photo du bijou"
      closeLabel="Fermer la photo agrandie"
      dialogLabel="Photo agrandie : Collier Layali"
      enlargedAlt="Collier Layali — vue agrandie"
      hint="Agrandir"
    />)

    expect(screen.queryByRole('dialog', { name: 'Photo agrandie : Collier Layali' })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Agrandir la photo du bijou' }))

    expect(screen.getByRole('dialog', { name: 'Photo agrandie : Collier Layali' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Collier Layali — vue agrandie' })).toBeInTheDocument()
  })

  it('closes the enlarged photo with the close button and Escape', async () => {
    render(<ProductImageViewer
      src="/jewel.jpg"
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
})
