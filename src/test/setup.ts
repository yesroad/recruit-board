import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest'

import { setConfig } from '@/mocks/config'
import { resetDb } from '@/mocks/db'
import { server } from '@/mocks/server'

const TEST_BASELINE = {
  minDelay: 0,
  maxDelay: 0,
  fetchFailRate: 0,
  moveFailRate: 0,
}

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

beforeEach(() => {
  setConfig(TEST_BASELINE)
})

afterEach(() => {
  cleanup()
  server.resetHandlers()
  localStorage.clear()
  resetDb()
})

afterAll(() => server.close())
