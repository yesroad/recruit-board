import type { Candidate, Stage } from '@/types/candidate'

export const SEED_COUNT = 1000

function mulberry32(seed: number): () => number {
  let state = seed

  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const FAMILY_NAMES = [
  '김', '이', '박', '최', '정', '강', '조', '윤', '장', '임',
  '한', '오', '서', '신', '권', '황', '안', '송', '류', '전',
]

const GIVEN_NAMES = [
  '민준', '서연', '도윤', '지우', '예준', '하윤', '시우', '서윤', '주원', '지민',
  '건우', '수아', '우진', '지아', '선우', '하은', '연우', '채원', '정우', '유진',
  '재윤', '소율', '민재', '다은', '준서', '지윤', '현우', '수빈', '지호', '예은',
]

export const ROLES = [
  '프론트엔드 개발자',
  '백엔드 개발자',
  '모바일 개발자',
  '데이터 엔지니어',
  '프로덕트 디자이너',
  '프로덕트 매니저',
  'QA 엔지니어',
  'DevOps 엔지니어',
] as const

const SOURCES = ['직접 지원', '헤드헌터', '사내 추천', '채용 플랫폼']

const STAGE_WEIGHTS: Array<[Stage, number]> = [
  ['screening', 0.42],
  ['interview', 0.24],
  ['offer', 0.12],
  ['hired', 0.1],
  ['rejected', 0.12],
]

function pickStage(roll: number): Stage {
  let cursor = 0

  for (const [stage, weight] of STAGE_WEIGHTS) {
    cursor += weight
    if (roll < cursor) return stage
  }

  return 'screening'
}

function pick<T>(random: () => number, items: readonly T[]): T {
  return items[Math.floor(random() * items.length)]
}

export function createSeed(count = SEED_COUNT): Candidate[] {
  const random = mulberry32(20260830)
  const baseTime = Date.UTC(2026, 7, 30)

  return Array.from({ length: count }, (_, index) => {
    const name = `${pick(random, FAMILY_NAMES)}${pick(random, GIVEN_NAMES)}`
    const daysAgo = Math.floor(random() * 180)

    return {
      id: `c-${String(index + 1).padStart(4, '0')}`,
      name,
      role: pick(random, ROLES),
      appliedAt: new Date(baseTime - daysAgo * 86_400_000).toISOString(),
      stage: pickStage(random()),
      email: `candidate${index + 1}@example.com`,
      phone: `010-${String(Math.floor(random() * 9000) + 1000)}-${String(
        Math.floor(random() * 9000) + 1000,
      )}`,
      experienceYears: Math.floor(random() * 15),
      source: pick(random, SOURCES),
      note: `${name} 지원자의 사전 검토 메모입니다.`,
    }
  })
}
