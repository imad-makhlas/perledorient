import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CatalogSortMenu } from './CatalogSortMenu'

const options = [
  ['featured', 'Nos favoris'],
  ['newest', 'Nouveautés'],
] as const

describe('CatalogSortMenu', () => {
  it('opens, selects an option, and closes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<CatalogSortMenu label="Classer par" value="featured" options={options} onChange={onChange} />)

    const trigger = screen.getByRole('button', { name: /classer par/i })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    await user.click(screen.getByRole('option', { name: 'Nouveautés' }))
    expect(onChange).toHaveBeenCalledWith('newest')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes when Escape is pressed', async () => {
    const user = userEvent.setup()
    render(<CatalogSortMenu label="Classer par" value="featured" options={options} onChange={() => undefined} />)

    const trigger = screen.getByRole('button', { name: /classer par/i })
    await user.click(trigger)
    await user.keyboard('{Escape}')

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveFocus()
  })

  it('marks the current choice as selected', async () => {
    const user = userEvent.setup()
    render(<CatalogSortMenu label="Classer par" value="featured" options={options} onChange={() => undefined} />)

    await user.click(screen.getByRole('button', { name: /classer par/i }))

    expect(screen.getByRole('option', { name: 'Nos favoris' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('option', { name: 'Nouveautés' })).toHaveAttribute('aria-selected', 'false')
  })
})
