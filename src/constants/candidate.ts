import type { Stage } from '@/types/candidate'

export const STAGE_LABELS: Record<Stage, string> = {
  screening: '서류검토',
  interview: '면접',
  offer: '처우협의',
  hired: '최종합격',
  rejected: '불합격',
}
