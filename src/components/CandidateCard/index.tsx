import { formatDate } from '@/lib/format'
import type { Candidate } from '@/types/candidate'

import { MoveButtons, StageBadge } from './components'
import { useCandidateCard } from './useCandidateCard'

interface CandidateCardProps {
  candidate: Candidate
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  const { name, role, stage, appliedAt } = candidate
  const { prev, next, canReject, handleMove } = useCandidateCard(candidate)

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs transition hover:border-slate-300 hover:shadow-md">
      <p className="truncate text-sm font-semibold">{name}</p>
      <p className="truncate text-xs text-slate-500">{role}</p>

      <div className="mt-2.5 flex items-center gap-1.5">
        <StageBadge stage={stage} />
        <time dateTime={appliedAt} className="ml-auto text-[11px] tabular-nums text-slate-500">
          {formatDate(appliedAt)}
        </time>
      </div>

      <MoveButtons name={name} prev={prev} next={next} canReject={canReject} onMove={handleMove} />
    </article>
  )
}
