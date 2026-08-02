import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const app = readFileSync(join(process.cwd(), 'src', 'App.tsx'), 'utf8')

describe('App routing', () => {
  it('redirects an unknown URL to the storefront homepage', () => {
    expect(app).toMatch(/<Route path="\*" element=\{<Navigate to="\/" replace\s*\/>\}\s*\/>/)
  })
})
