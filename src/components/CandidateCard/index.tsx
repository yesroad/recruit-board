import { memo } from 'react'

import { MoveButtons } from '@/components/MoveButtons'
import { StageBadge } from '@/components/StageBadge'
import { formatDate } from '@/lib/format'
import type { Candidate, Stage } from '@/types/candidate'

import { useCandidateCard } from './useCandidateCard'

interface CandidateCardProps {
  candidate: Candidate
  pendingStage?: Stage
  onMove: (candidate: Candidate, toStage: Stage) => void
  onSelect: (candidate: Candidate) => void
  isActive?: boolean
  triggerRef?: (el: HTMLButtonElement | null) => void
}

export const CandidateCard = memo(function CandidateCard({
  candidate,
  pendingStage,
  onMove,
  onSelect,
  isActive = true,
  triggerRef,
}: CandidateCardProps) {
  const { name, role, stage, appliedAt } = candidate
  const { prev, next, canReject, isMoving } = useCandidateCard(candidate, pendingStage)
  const tabIndex = isActive ? 0 : -1

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

      <button
        ref={triggerRef}
        type="button"
        tabIndex={tabIndex}
        data-detail-trigger
        aria-label={`${name}님 상세 보기`}
        onClick={() => onSelect(candidate)}
        className={`block w-full text-left ${isMoving ? 'opacity-55' : ''}`}
      >
        <span className="block truncate text-sm font-semibold">{name}</span>
        <span className="block truncate text-xs text-slate-500">{role}</span>

        <span className="mt-2.5 flex items-center gap-1.5">
          <StageBadge stage={pendingStage ?? stage} />
          <time dateTime={appliedAt} className="ml-auto text-[11px] tabular-nums text-slate-500">
            {formatDate(appliedAt)}
          </time>
        </span>
      </button>

      <MoveButtons
        name={name}
        prev={prev}
        next={next}
        canReject={canReject}
        onMove={(toStage) => onMove(candidate, toStage)}
        tabIndex={tabIndex}
      />
    </article>
  )
})
