interface DetailPanelErrorProps {
  titleId: string
  onClose: () => void
  onRetry: () => void
}

export function DetailPanelError({ titleId, onClose, onRetry }: DetailPanelErrorProps) {
  return (
    <>
      <div className="flex items-start gap-3 border-b border-slate-200 p-4">
        <div id={titleId} className="text-[17px] font-bold">
          지원자를 찾을 수 없습니다
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

      <div className="flex flex-1 flex-col gap-4.5 overflow-y-auto p-4">
        <div role="alert" className="flex flex-col items-start gap-2 text-sm text-danger">
          <p>지원자 정보를 불러오지 못했습니다</p>
          <button
            type="button"
            onClick={onRetry}
            className="h-8 rounded-md border border-danger px-3 text-xs text-danger hover:bg-danger hover:text-white"
          >
            다시 시도
          </button>
        </div>
      </div>
    </>
  )
}
