import { afterEach, describe, expect, it, vi } from 'vitest'

import { randomDelay, resetConfig, setConfig } from '@/mocks/config'

async function loadConfigWith(search: string) {
  vi.resetModules()
  vi.stubGlobal('location', { search })

  return (await import('@/mocks/config')).config
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('config', () => {
  it('기본값은 지연 200~800ms · 실패율 15%다', async () => {
    await expect(loadConfigWith('')).resolves.toEqual({
      minDelay: 200,
      maxDelay: 800,
      fetchFailRate: 0.15,
      moveFailRate: 0.15,
    })
  })

  it('URL 파라미터가 기본값을 덮어쓴다', async () => {
    await expect(
      loadConfigWith('?delay=0&fetchFailRate=0&moveFailRate=1'),
    ).resolves.toEqual({
      minDelay: 0,
      maxDelay: 0,
      fetchFailRate: 0,
      moveFailRate: 1,
    })
  })
})

describe('randomDelay', () => {
  it('기본 설정에서 200~800ms 범위를 벗어나지 않는다', () => {
    resetConfig()

    const samples = Array.from({ length: 500 }, randomDelay)

    expect(Math.min(...samples)).toBeGreaterThanOrEqual(200)
    expect(Math.max(...samples)).toBeLessThanOrEqual(800)
  })

  it('설정한 지연을 그대로 따른다', () => {
    setConfig({ minDelay: 50, maxDelay: 50 })

    expect(randomDelay()).toBe(50)
  })
})
