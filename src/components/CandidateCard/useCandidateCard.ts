import { adjacentStages } from '@/constants/candidate'
import { useMoveCandidateStage } from '@/queries/candidate/mutations'
import type { Candidate, Stage } from '@/types/candidate'

interface UseCandidateCardReturn {
  prev?: Stage
  next?: Stage
  canReject: boolean
  handleMove: (toStage: Stage) => void
}

export function useCandidateCard(candidate: Candidate): UseCandidateCardReturn {
  const { mutate } = useMoveCandidateStage()
  const { prev, next, canReject } = adjacentStages(candidate.stage)

  const handleMove = (toStage: Stage) => {
    mutate({ id: candidate.id, toStage })
  }

  return { prev, next, canReject, handleMove }
}
