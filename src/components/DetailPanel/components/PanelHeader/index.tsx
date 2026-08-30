import type { Candidate } from '@/types/candidate'

interface PanelHeaderProps {
  titleId: string
  candidate: Candidate
  onClose: () => void
}

export function PanelHeader({ titleId, candidate, onClose }: PanelHeaderProps) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-200 p-4">
      <div>
        <div id={titleId} className="text-[17px] font-bold">
          {candidate.name}
        </div>
        <div className="mt-0.5 text-[13px] text-slate-500">{candidate.role}</div>
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
