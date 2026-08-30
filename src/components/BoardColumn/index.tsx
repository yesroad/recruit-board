import { memo } from 'react'

import type { Candidate, Stage } from '@/types/candidate'

import { CandidateList, ColumnHeader } from './components'

interface BoardColumnProps {
  stage: Stage
  candidates: Candidate[]
  pending: Record<string, Stage>
  onMove: (candidate: Candidate, toStage: Stage) => void
}

// 입력 한 번이 카드 1,000개 재조정으로 번지지 않도록 여기서 끊는다.
export const BoardColumn = memo(function BoardColumn({
  stage,
  candidates,
  pending,
  onMove,
}: BoardColumnProps) {
  const titleId = `column-${stage}-title`

  return (
    <section
      aria-labelledby={titleId}
      data-stage={stage}
      className="flex min-h-0 w-65 shrink-0 flex-col rounded-[10px] border border-slate-200 bg-slate-100"
    >
      <ColumnHeader stage={stage} titleId={titleId} count={candidates.length} />
      <CandidateList candidates={candidates} pending={pending} onMove={onMove} />
    </section>
  )
})
