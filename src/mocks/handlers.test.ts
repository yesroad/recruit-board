import { describe, expect, it } from 'vitest'

import { setConfig } from '@/mocks/config'
import { findCandidate } from '@/mocks/db'
import { SEED_COUNT } from '@/mocks/seed'

const FIRST_ID = 'c-0001'

function move(id: string, toStage: unknown) {
  return fetch(`/api/candidates/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ toStage }),
  })
}

describe('GET /api/candidates', () => {
  it('전체 목록을 돌려준다', async () => {
    const response = await fetch('/api/candidates')

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toHaveLength(SEED_COUNT)
  })

  it('fetchFailRate가 1이면 500을 돌려준다', async () => {
    setConfig({ fetchFailRate: 1 })

    expect((await fetch('/api/candidates')).status).toBe(500)
  })
})

describe('GET /api/candidates/:id', () => {
  it('지원자 상세를 돌려준다', async () => {
    const response = await fetch(`/api/candidates/${FIRST_ID}`)

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({ id: FIRST_ID })
  })

  it('없는 id면 404를 돌려준다', async () => {
    expect((await fetch('/api/candidates/c-9999')).status).toBe(404)
  })
})

describe('PATCH /api/candidates/:id', () => {
  it('단계를 옮기고 저장한다', async () => {
    const response = await move(FIRST_ID, 'interview')

    expect(response.status).toBe(200)
    expect(findCandidate(FIRST_ID)?.stage).toBe('interview')
  })

  it('알 수 없는 단계는 400을 돌려준다', async () => {
    expect((await move(FIRST_ID, 'unknown')).status).toBe(400)
  })

  it('없는 id는 404를 돌려준다', async () => {
    expect((await move('c-9999', 'interview')).status).toBe(404)
  })

  it('실패해도 저장소를 건드리지 않는다', async () => {
    const before = findCandidate(FIRST_ID)?.stage
    setConfig({ moveFailRate: 1 })

    expect((await move(FIRST_ID, 'hired')).status).toBe(500)
    expect(findCandidate(FIRST_ID)?.stage).toBe(before)
  })

  it('조회 실패율과 이동 실패율이 따로 논다', async () => {
    setConfig({ fetchFailRate: 0, moveFailRate: 1 })

    expect((await fetch('/api/candidates')).status).toBe(200)
    expect((await move(FIRST_ID, 'hired')).status).toBe(500)
  })
})
