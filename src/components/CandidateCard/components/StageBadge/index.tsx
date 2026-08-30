import { STAGE_BADGE_CLASS, STAGE_LABELS } from '@/constants/candidate'
import type { Stage } from '@/types/candidate'

interface StageBadgeProps {
  stage: Stage
}

export function StageBadge({ stage }: StageBadgeProps) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STAGE_BADGE_CLASS[stage]}`}
    >
      {STAGE_LABELS[stage]}
    </span>
  )
}
