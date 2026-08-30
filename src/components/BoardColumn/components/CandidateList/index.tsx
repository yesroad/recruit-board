import { CandidateCard } from '@/components/CandidateCard'
import type { Candidate, Stage } from '@/types/candidate'

import { ColumnEmpty } from '../ColumnEmpty'

import { useCandidateList } from './useCandidateList'

interface CandidateListProps {
  candidates: Candidate[]
  pending: Record<string, Stage>
  onMove: (candidate: Candidate, toStage: Stage) => void
  onSelect: (candidate: Candidate) => void
  isFiltered: boolean
}

export function CandidateList({
  candidates,
  pending,
  onMove,
  onSelect,
  isFiltered,
}: CandidateListProps) {
  const { activeId, getTriggerRef, handleKeyDown } = useCandidateList(candidates)

  if (candidates.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center p-2.5">
        <ColumnEmpty isFiltered={isFiltered} />
      </div>
    )
  }

  return (
    <ul
      role="list"
      onKeyDown={handleKeyDown}
      className="flex min-h-0 flex-col gap-2 overflow-y-auto p-2.5"
    >
      {candidates.map((candidate, index) => (
        <li key={candidate.id} data-index={index} data-candidate-id={candidate.id}>
          <CandidateCard
            candidate={candidate}
            pendingStage={pending[candidate.id]}
            onMove={onMove}
            onSelect={onSelect}
            isActive={candidate.id === activeId}
            triggerRef={getTriggerRef(candidate.id)}
          />
        </li>
      ))}
    </ul>
  )
}
