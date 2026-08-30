import { formatDate } from '@/lib/format'
import type { Candidate, Stage } from '@/types/candidate'

import { MoveButtons, StageBadge } from './components'
import { useCandidateCard } from './useCandidateCard'

interface CandidateCardProps {
  candidate: Candidate
  pendingStage?: Stage
  onMove: (candidate: Candidate, toStage: Stage) => void
}

export function CandidateCard({ candidate, pendingStage, onMove }: CandidateCardProps) {
  const { name, role, stage, appliedAt } = candidate
  const { prev, next, canReject, isMoving } = useCandidateCard(candidate, pendingStage)

  return (
    <article
      data-moving={isMoving || undefined}
      className={`relative rounded-lg border bg-white p-3 shadow-xs transition ${
        isMoving ? 'border-dashed border-accent' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {isMoving && (
        <span className="absolute top-2.5 right-2.5 rounded-full border border-accent bg-slate-100 px-1.5 text-[10px] font-bold text-accent">
          이동 중
        </span>
      )}
      <div className={isMoving ? 'opacity-55' : undefined}>
        <p className="truncate text-sm font-semibold">{name}</p>
        <p className="truncate text-xs text-slate-500">{role}</p>

        <div className="mt-2.5 flex items-center gap-1.5">
          <StageBadge stage={pendingStage ?? stage} />
          <time dateTime={appliedAt} className="ml-auto text-[11px] tabular-nums text-slate-500">
            {formatDate(appliedAt)}
          </time>
        </div>
      </div>

      <MoveButtons name={name} prev={prev} next={next} canReject={canReject} onMove={(toStage) => onMove(candidate, toStage)} />
    </article>
  )
}
