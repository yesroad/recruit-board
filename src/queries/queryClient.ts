import { QueryClient } from '@tanstack/react-query'

import { QUERY_CONFIG } from '@/constants/query'

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: QUERY_CONFIG.REFETCH_ON_WINDOW_FOCUS,
        staleTime: QUERY_CONFIG.STALE_TIME,
        retry: QUERY_CONFIG.RETRY,
      },
    },
  })
}
