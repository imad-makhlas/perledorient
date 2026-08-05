import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const app = readFileSync(join(process.cwd(), 'src', 'App.tsx'), 'utf8')

describe('App routing', () => {
  it('uses /admin for the product manager and redirects the legacy URL', () => {
    expect(app).toMatch(/<Route path="\/admin" element=\{<AdminDashboardPage\s*\/>\}/)
    expect(app).toMatch(/<Route path="\/admin\/products" element=\{<Navigate to="\/admin" replace\s*\/>\}/)
    expect(app).toMatch(/<Route path="\/admin\/orders" element=\{<Navigate to="\/admin" replace\s*\/>\}/)
  })

  it('redirects an unknown URL to the storefront homepage', () => {
    expect(app).toMatch(/<Route path="\*" element=\{<Navigate to="\/" replace\s*\/>\}\s*\/>/)
  })
})
