import { QueryClientProvider } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import type { ReactNode } from 'react'

import { createQueryClient } from '@/queries/queryClient'

// client 는 테스트용. 기본 retry 가 붙이는 1초 지연 때문에 에러 상태 테스트가 waitFor 를 넘긴다.
export default function QueryProvider({
  children,
  client,
}: {
  children: ReactNode
  client?: QueryClient
}) {
  const [fallbackClient] = useState(createQueryClient)
  const queryClient = client ?? fallbackClient

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
