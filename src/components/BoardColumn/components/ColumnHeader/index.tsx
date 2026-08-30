import { STAGE_DOT_CLASS, STAGE_LABELS } from '@/constants/candidate'
import type { Stage } from '@/types/candidate'

interface ColumnHeaderProps {
  stage: Stage
  titleId: string
  count: number
}

export function ColumnHeader({ stage, titleId, count }: ColumnHeaderProps) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-200 px-3.5 py-3">
      <span aria-hidden className={`size-2 shrink-0 rounded-full ${STAGE_DOT_CLASS[stage]}`} />
      <h2 id={titleId} className="text-[13px] font-semibold">
        {STAGE_LABELS[stage]}
      </h2>
      <span className="ml-auto rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-500">
        {count.toLocaleString()}
        <span className="sr-only">명</span>
      </span>
    </div>
  )
}
