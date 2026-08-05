import '@testing-library/jest-dom/vitest'

afterEach(() => {
  if (typeof localStorage !== 'undefined') localStorage.clear()
})
