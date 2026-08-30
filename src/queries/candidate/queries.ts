import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

import { candidateService } from '@/services/api/candidate'

export const CANDIDATE_QUERY_KEY = {
  LIST: 'getCandidateList',
  DETAIL: 'getCandidateDetail',
} as const

export const candidateQueries = {
  getList: () =>
    queryOptions({
      queryKey: [CANDIDATE_QUERY_KEY.LIST],
      queryFn: () => candidateService.getList(),
    }),

  getDetail: (id: string) =>
    queryOptions({
      queryKey: [CANDIDATE_QUERY_KEY.DETAIL, id],
      queryFn: () => candidateService.getDetail(id),
    }),
}

export function useGetCandidateList() {
  return useSuspenseQuery(candidateQueries.getList())
}

export function useGetCandidateDetail(id: string) {
  return useSuspenseQuery(candidateQueries.getDetail(id))
}
