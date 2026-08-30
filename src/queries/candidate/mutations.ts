import { useMutation, useQueryClient } from '@tanstack/react-query'

import { candidateService } from '@/services/api/candidate'
import type { Candidate } from '@/types/candidate'

import { CANDIDATE_QUERY_KEY } from './queries'

// invalidate 로 재조회하면 그 재조회에도 15% 실패가 걸려 이동만 성공하고 목록이 error 가 된다.
export function useMoveCandidateStage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: candidateService.moveStage,
    onSuccess: (moved) => {
      queryClient.setQueryData<Candidate[]>([CANDIDATE_QUERY_KEY.LIST], (previous) =>
        previous?.map((candidate) => (candidate.id === moved.id ? moved : candidate)),
      )
      queryClient.setQueryData<Candidate>([CANDIDATE_QUERY_KEY.DETAIL, moved.id], moved)
    },
  })
}
