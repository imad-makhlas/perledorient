import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AdminLogin } from './AdminLogin'

describe('AdminLogin', () => {
  it('does not reveal the administrator email before sign-in', () => {
    render(<AdminLogin onLogin={vi.fn()} message="" busy={false} />)

    expect(screen.getByRole('textbox', { name: 'Adresse administrateur' })).toHaveValue('')
  })
})
