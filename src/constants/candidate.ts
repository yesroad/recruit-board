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
