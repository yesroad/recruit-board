import { useCallback, useRef, useState, type KeyboardEvent } from 'react'

import type { Candidate } from '@/types/candidate'

export function useCandidateList(candidates: Candidate[]) {
  const [requestedId, setRequestedId] = useState<string | null>(null)
  const triggerMap = useRef(new Map<string, HTMLButtonElement>())
  const refCache = useRef(new Map<string, (el: HTMLButtonElement | null) => void>())

  // 필터/이동으로 요청한 카드가 목록에서 사라지면 첫 카드로 되돌린다 - effect 없이 렌더 중 파생한다.
  const activeId = candidates.some((candidate) => candidate.id === requestedId)
    ? requestedId
    : (candidates[0]?.id ?? null)

  const registerTrigger = useCallback((id: string, el: HTMLButtonElement | null) => {
    if (el) triggerMap.current.set(id, el)
    else triggerMap.current.delete(id)
  }, [])

  // id별로 같은 콜백 identity를 재사용한다 - 매 렌더 새 함수를 넘기면 CandidateCard의
  // memo가 매번 깨져 1,000장이 그대로 리렌더된다.
  const getTriggerRef = useCallback(
    (id: string) => {
      let fn = refCache.current.get(id)
      if (!fn) {
        fn = (el) => registerTrigger(id, el)
        refCache.current.set(id, fn)
      }
      return fn
    },
    [registerTrigger],
  )

  const moveTo = useCallback((id: string) => {
    setRequestedId(id)
    const el = triggerMap.current.get(id)
    el?.scrollIntoView({ block: 'nearest' })
    el?.focus()
  }, [])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const index = candidates.findIndex((candidate) => candidate.id === activeId)
      const target =
        event.key === 'ArrowDown' ? candidates[index + 1]
        : event.key === 'ArrowUp' ? candidates[index - 1]
        : event.key === 'Home' ? candidates[0]
        : event.key === 'End' ? candidates[candidates.length - 1]
        : undefined

      if (!target) return

      event.preventDefault()
      moveTo(target.id)
    },
    [candidates, activeId, moveTo],
  )

  return { activeId, getTriggerRef, handleKeyDown }
}
