import { useEffect, useRef } from 'react'

import { useClickOutside } from '@/hooks/useClickOutside'
import { useFocusTrap } from '@/hooks/useFocusTrap'

// 패널 껍데기(포커스·바깥 클릭·Esc·닫을 때 포커스 복귀)만 다룬다.
// 지원자 조회는 DetailPanelContent 안에서 useSuspenseQuery 로 한다 - 로딩·에러가
// 이 훅이 아니라 그 컴포넌트를 감싼 Suspense/ErrorBoundary 로 올라가야 패널 밖(보드)이
// 함께 무너지지 않는다.
export function useDetailPanel(candidateId: string, onClose: () => void) {
  const panelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    panelRef.current?.focus()
  }, [])

  useClickOutside(panelRef, onClose)
  useFocusTrap(panelRef)

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

  return { panelRef }
}
