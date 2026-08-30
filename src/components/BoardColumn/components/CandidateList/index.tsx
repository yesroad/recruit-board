import { CandidateCard } from '@/components/CandidateCard'
import type { Candidate, Stage } from '@/types/candidate'

interface CandidateListProps {
  candidates: Candidate[]
  pending: Record<string, Stage>
  onMove: (candidate: Candidate, toStage: Stage) => void
}

export function CandidateList({ candidates, pending, onMove }: CandidateListProps) {
  return (
    <ul role="list" className="flex min-h-0 flex-col gap-2 overflow-y-auto p-2.5">
      {candidates.map((candidate, index) => (
        <li key={candidate.id} data-index={index} data-candidate-id={candidate.id}>
          <CandidateCard candidate={candidate} pendingStage={pending[candidate.id]} onMove={onMove} />
        </li>
      ))}
    </ul>
  )
}
