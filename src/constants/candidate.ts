import type { Stage } from '@/types/candidate'

export const STAGE_LABELS: Record<Stage, string> = {
  screening: '서류검토',
  interview: '면접',
  offer: '처우협의',
  hired: '최종합격',
  rejected: '불합격',
}

// Tailwind는 소스를 정적 스캔한다. `bg-stage-${stage}`는 클래스가 생성되지 않는다.
export const STAGE_DOT_CLASS: Record<Stage, string> = {
  screening: 'bg-stage-screening',
  interview: 'bg-stage-interview',
  offer: 'bg-stage-offer',
  hired: 'bg-stage-hired',
  rejected: 'bg-stage-rejected',
}

export const STAGE_BADGE_CLASS: Record<Stage, string> = {
  screening: 'bg-stage-screening-soft text-stage-screening-strong',
  interview: 'bg-stage-interview-soft text-stage-interview-strong',
  offer: 'bg-stage-offer-soft text-stage-offer-strong',
  hired: 'bg-stage-hired-soft text-stage-hired-strong',
  rejected: 'bg-stage-rejected-soft text-stage-rejected-strong',
}

// STAGES 는 컬럼 나열 순서다. 실제 파이프라인은 아래 4단계이고 불합격은 어디서든 빠지는 분기다.
const PIPELINE = ['screening', 'interview', 'offer', 'hired'] as const satisfies Stage[]

export function adjacentStages(stage: Stage): {
  prev?: Stage
  next?: Stage
  canReject: boolean
} {
  if (stage === 'rejected') return { prev: 'screening', canReject: false }

  const index = PIPELINE.indexOf(stage as (typeof PIPELINE)[number])

  return { prev: PIPELINE[index - 1], next: PIPELINE[index + 1], canReject: true }
}
