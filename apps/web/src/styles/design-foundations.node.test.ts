import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const styles = readFileSync(new URL('../index.css', import.meta.url), 'utf8')
const tailwind = readFileSync(new URL('../../tailwind.config.js', import.meta.url), 'utf8')

test('defines the shared Casa de Perla visual foundations', () => {
  assert.match(styles, /--color-ink:\s*#2F2A2C/)
  assert.match(styles, /--color-soft:\s*#FBF8F4/)
  assert.match(styles, /--radius-control:\s*6px/)
  assert.match(styles, /--radius-surface:\s*6px/)
  assert.match(styles, /--shadow-soft:\s*0 12px 36px rgba\(47,42,44,\.08\)/)
  assert.match(tailwind, /soft:\s*'0 12px 36px rgba\(47, 42, 44, 0\.08\)'/)
})

test('shared controls consume the premium radii and warm neutral palette', () => {
  assert.match(styles, /\.button-primary[^}]*border-radius:\s*var\(--radius-control\)/s)
  assert.match(styles, /\.button-primary[^}]*background:\s*var\(--color-ink\)/s)
  assert.match(styles, /\.button-secondary[^}]*border-radius:\s*var\(--radius-control\)/s)
  assert.match(styles, /\.field[^}]*border-radius:\s*var\(--radius-control\)/s)
  assert.match(styles, /\.luxe-surface[^}]*border-radius:\s*var\(--radius-surface\)/s)
})

test('keeps every non-circular interface surface on the six-pixel radius', () => {
  const sourceRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
  const forbiddenRadius = /\brounded-(?:lg|xl|2xl|3xl)\b|rounded-\[(?:10|16|20|22|24|28)px\]/
  const offenders: string[] = []

  const inspect = (directory: string) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) {
        inspect(path)
      } else if (entry.name.endsWith('.tsx') && !entry.name.includes('.test.')) {
        if (forbiddenRadius.test(readFileSync(path, 'utf8'))) offenders.push(path)
      }
    }
  }

  inspect(sourceRoot)
  assert.deepEqual(offenders, [])
})
