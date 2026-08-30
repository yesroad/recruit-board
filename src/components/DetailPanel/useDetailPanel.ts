import { useEffect, useRef } from 'react'

import { useClickOutside } from '@/hooks/useClickOutside'
import { useGetCandidateDetail } from '@/queries/candidate/queries'

export function useDetailPanel(candidateId: string, onClose: () => void) {
  const { data, isPending, isError, refetch } = useGetCandidateDetail(candidateId)
  const panelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    panelRef.current?.focus()
  }, [])

  useClickOutside(panelRef, onClose)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  useEffect(
    () => () => {
      // 이동한 카드의 <li> 는 다른 컬럼으로 옮겨가며 DOM 이 재생성된다 - 저장해둔 노드가 아니라
      // id로 다시 찾아야 detached 노드에 focus() 를 호출해 조용히 실패하는 일이 없다
      document
        .querySelector<HTMLElement>(`[data-candidate-id="${candidateId}"] [data-detail-trigger]`)
        ?.focus()
    },
    [candidateId],
  )

  return { candidate: data, isPending, isError, refetch, panelRef }
}
