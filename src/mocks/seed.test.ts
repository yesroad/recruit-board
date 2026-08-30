import { describe, expect, it } from 'vitest'

import { SEED_COUNT, createSeed } from '@/mocks/seed'
import { STAGES } from '@/types/candidate'

describe('createSeed', () => {
  it('시드가 고정되어 두 번 만들어도 완전히 같다', () => {
    expect(createSeed()).toEqual(createSeed())
  })

  it('1,000건을 만들고 id가 서로 겹치지 않는다', () => {
    const candidates = createSeed()

    expect(candidates).toHaveLength(SEED_COUNT)
    expect(new Set(candidates.map(({ id }) => id)).size).toBe(SEED_COUNT)
  })

  it('모든 카드가 유효한 단계를 갖는다', () => {
    expect(createSeed().every(({ stage }) => STAGES.includes(stage))).toBe(true)
  })
})
