import '@testing-library/jest-dom'

// Provide a localStorage implementation for test environments that don't have one
const storage: Record<string, string> = {}
const localStorageMock: Storage = {
  get length() { return Object.keys(storage).length },
  key: (i) => Object.keys(storage)[i] ?? null,
  getItem: (k) => storage[k] ?? null,
  setItem: (k, v) => { storage[k] = String(v) },
  removeItem: (k) => { delete storage[k] },
  clear: () => { Object.keys(storage).forEach((k) => delete storage[k]) },
}
Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  configurable: true,
  writable: true,
})
