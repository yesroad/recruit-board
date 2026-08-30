import { STAGE_LABELS } from '@/constants/candidate'
import type { Stage } from '@/types/candidate'

interface MoveButtonsProps {
  name: string
  prev?: Stage
  next?: Stage
  canReject: boolean
  onMove: (toStage: Stage) => void
}

const BUTTON_CLASS =
  'flex h-8 flex-1 items-center justify-center gap-1 rounded-md border border-slate-200 bg-slate-100 text-xs text-slate-500 transition hover:border-accent hover:bg-accent hover:text-white'

export function MoveButtons({ name, prev, next, canReject, onMove }: MoveButtonsProps) {
  // "면접 →" 만으로는 어느 카드의 버튼인지 알 수 없다
  const label = (target: Stage) => `${name}님을 ${STAGE_LABELS[target]}(으)로 이동`

  return (
    <div className="mt-2.5 flex gap-1.5 border-t border-slate-200 pt-2.5">
      {prev && (
        <button
          type="button"
          className={BUTTON_CLASS}
          aria-label={label(prev)}
          onClick={() => onMove(prev)}
        >
          ← {STAGE_LABELS[prev]}
        </button>
      )}
      {next && (
        <button
          type="button"
          className={BUTTON_CLASS}
          aria-label={label(next)}
          onClick={() => onMove(next)}
        >
          {STAGE_LABELS[next]} →
        </button>
      )}
      {canReject && (
        <button
          type="button"
          className={BUTTON_CLASS}
          aria-label={label('rejected')}
          onClick={() => onMove('rejected')}
        >
          {STAGE_LABELS.rejected}
        </button>
      )}
    </div>
  )
}
