import { CandidateCard } from '@/components/CandidateCard'
import type { Candidate } from '@/types/candidate'

interface CandidateListProps {
  candidates: Candidate[]
}

export function CandidateList({ candidates }: CandidateListProps) {
  return (
    <ul role="list" className="flex min-h-0 flex-col gap-2 overflow-y-auto p-2.5">
      {candidates.map((candidate, index) => (
        <li key={candidate.id} data-index={index} data-candidate-id={candidate.id}>
          <CandidateCard candidate={candidate} />
        </li>
      ))}
    </ul>
  )
}
