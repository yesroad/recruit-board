import type { Candidate } from '@/types/candidate'

interface PanelHeaderProps {
  titleId: string
  candidate?: Candidate
  isPending: boolean
  onClose: () => void
}

export function PanelHeader({ titleId, candidate, isPending, onClose }: PanelHeaderProps) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-200 p-4">
      <div>
        <div id={titleId} className="text-[17px] font-bold">
          {isPending ? '불러오는 중' : (candidate?.name ?? '지원자를 찾을 수 없습니다')}
        </div>
        {candidate && <div className="mt-0.5 text-[13px] text-slate-500">{candidate.role}</div>}
      </div>
      <button
        type="button"
        aria-label="상세 닫기"
        onClick={onClose}
        className="ml-auto flex size-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      >
        ✕
      </button>
    </div>
  )
}
