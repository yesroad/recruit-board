import { STAGE_BADGE_CLASS, STAGE_LABELS } from '@/constants/candidate'
import { formatDate } from '@/lib/format'
import type { Candidate } from '@/types/candidate'

interface CandidateCardProps {
  candidate: Candidate
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  const { name, role, stage, appliedAt } = candidate

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs transition hover:border-slate-300 hover:shadow-md">
      <p className="truncate text-sm font-semibold">{name}</p>
      <p className="truncate text-xs text-slate-500">{role}</p>

      <div className="mt-2.5 flex items-center gap-1.5">
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STAGE_BADGE_CLASS[stage]}`}
        >
          {STAGE_LABELS[stage]}
        </span>
        <time
          dateTime={appliedAt}
          className="ml-auto text-[11px] tabular-nums text-slate-500"
        >
          {formatDate(appliedAt)}
        </time>
      </div>
    </article>
  )
}
