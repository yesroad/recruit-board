import { adjacentStages } from '@/constants/candidate'
import type { Candidate, Stage } from '@/types/candidate'

interface UseCandidateCardReturn {
  prev?: Stage
  next?: Stage
  canReject: boolean
  isMoving: boolean
}

export function useCandidateCard(
  candidate: Candidate,
  pendingStage?: Stage,
): UseCandidateCardReturn {
  // 화면에 보이는 단계 기준으로 버튼을 만든다. 이동 중에도 다음 이동을 받을 수 있어야 한다.
  const { prev, next, canReject } = adjacentStages(pendingStage ?? candidate.stage)

  return { prev, next, canReject, isMoving: pendingStage !== undefined }
}
