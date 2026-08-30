import { useMemo } from 'react'

import { useGetCandidateList } from '@/queries/candidate/queries'
import type { Candidate, Stage } from '@/types/candidate'

interface UseBoardReturn {
  columns: Record<Stage, Candidate[]>
  isPending: boolean
  isError: boolean
}

function groupByStage(candidates: Candidate[]): Record<Stage, Candidate[]> {
  const grouped: Record<Stage, Candidate[]> = {
    screening: [],
    interview: [],
    offer: [],
    hired: [],
    rejected: [],
  }

  for (const candidate of candidates) {
    grouped[candidate.stage].push(candidate)
  }

  return grouped
}

export function useBoard(): UseBoardReturn {
  const { data, isPending, isError } = useGetCandidateList()

  const columns = useMemo(() => groupByStage(data ?? []), [data])

  return { columns, isPending, isError }
}
