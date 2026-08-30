import { useEffect, type RefObject } from 'react'

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onOutside: () => void,
) {
  useEffect(() => {
    // pointerdown - click 은 뗀 지점 기준이라 패널 안에서 드래그하다 밖에서 손을 떼면 오작동으로 닫힌다
    const handlePointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) onOutside()
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [ref, onOutside])
}
