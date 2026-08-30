import { describe, expect, it } from 'vitest'

import { findCandidate, moveCandidate } from '@/mocks/db'
import { STAGES } from '@/types/candidate'

const FIRST_ID = 'c-0001'

describe('db', () => {
  it('localStorage를 비우면 시드 상태로 돌아간다', () => {
    const seeded = findCandidate(FIRST_ID)!.stage
    const moved = STAGES.find((stage) => stage !== seeded)!

    moveCandidate(FIRST_ID, moved)
    expect(findCandidate(FIRST_ID)?.stage).toBe(moved)

    localStorage.clear()

    expect(findCandidate(FIRST_ID)?.stage).toBe(seeded)
  })
})
