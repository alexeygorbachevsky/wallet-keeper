import { vi, beforeEach, afterEach } from 'vitest'

beforeEach(() => {
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  }

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    configurable: true,
  })
})

afterEach(() => {
  vi.clearAllMocks()
  vi.resetAllMocks()
})