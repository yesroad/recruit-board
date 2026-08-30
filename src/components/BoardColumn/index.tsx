import type { Candidate, Stage } from '@/types/candidate'

import { CandidateList, ColumnHeader } from './components'

interface BoardColumnProps {
  stage: Stage
  candidates: Candidate[]
}

export function BoardColumn({ stage, candidates }: BoardColumnProps) {
  const titleId = `column-${stage}-title`

  return (
    <section
      aria-labelledby={titleId}
      data-stage={stage}
      className="flex min-h-0 w-65 shrink-0 flex-col rounded-[10px] border border-slate-200 bg-slate-100"
    >
      <ColumnHeader stage={stage} titleId={titleId} count={candidates.length} />
      <CandidateList candidates={candidates} />
    </section>
  )
}
