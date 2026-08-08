import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ProductImageMagnifier } from './ProductImageMagnifier'

describe('ProductImageMagnifier', () => {
  it('keeps the product image inline and toggles the magnifier on click', async () => {
    render(<ProductImageMagnifier src="/jewel.jpg" alt="Collier Layali" label="Examiner les détails" />)

    const imageControl = screen.getByRole('button', { name: 'Examiner les détails' })
    expect(imageControl).toHaveAttribute('aria-pressed', 'false')
    expect(screen.queryByTestId('product-image-lens')).not.toBeInTheDocument()

    await userEvent.click(imageControl)

    expect(imageControl).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('product-image-lens')).toBeInTheDocument()

    await userEvent.click(imageControl)
    expect(imageControl).toHaveAttribute('aria-pressed', 'false')
    expect(screen.queryByTestId('product-image-lens')).not.toBeInTheDocument()
  })

  it('moves the magnified detail with the pointer', async () => {
    render(<ProductImageMagnifier src="/jewel.jpg" alt="Collier Layali" label="Examiner les détails" />)
    const imageControl = screen.getByRole('button', { name: 'Examiner les détails' })
    Object.defineProperty(imageControl, 'getBoundingClientRect', {
      value: () => ({ left: 10, top: 20, width: 200, height: 100, right: 210, bottom: 120, x: 10, y: 20, toJSON: () => ({}) }),
    })

    await userEvent.click(imageControl)
    fireEvent.mouseMove(imageControl, { clientX: 160, clientY: 45 })

    expect(screen.getByTestId('product-image-lens')).toHaveStyle({
      backgroundPosition: '75% 25%',
    })
  })

  it('lets a mobile customer move the magnifier by touch', async () => {
    render(<ProductImageMagnifier src="/jewel.jpg" alt="Collier Layali" label="Examiner les détails" />)
    const imageControl = screen.getByRole('button', { name: 'Examiner les détails' })
    Object.defineProperty(imageControl, 'getBoundingClientRect', {
      value: () => ({ left: 10, top: 20, width: 200, height: 100, right: 210, bottom: 120, x: 10, y: 20, toJSON: () => ({}) }),
    })

    await userEvent.click(imageControl)
    fireEvent.touchMove(imageControl, { touches: [{ clientX: 60, clientY: 95 }] })

    expect(screen.getByTestId('product-image-lens')).toHaveStyle({
      backgroundPosition: '25% 75%',
    })
  })
})
