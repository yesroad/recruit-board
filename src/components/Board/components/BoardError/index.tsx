interface BoardErrorProps {
  onRetry: () => void
}

export function BoardError({ onRetry }: BoardErrorProps) {
  return (
    <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-sm text-danger">
      <p>목록을 불러오지 못했습니다</p>
      <p className="text-xs text-slate-500">네트워크 상태를 확인하고 다시 시도해 주세요</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-1 h-9 rounded-md bg-accent px-4 text-sm font-semibold text-white"
      >
        다시 시도
      </button>
    </div>
  )
}
