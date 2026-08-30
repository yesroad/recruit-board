interface ColumnEmptyProps {
  isFiltered: boolean
}

export function ColumnEmpty({ isFiltered }: ColumnEmptyProps) {
  if (isFiltered) {
    return <p className="text-center text-xs text-slate-400">필터에 맞는 지원자 없음</p>
  }

  return (
    <div className="flex flex-col items-center gap-1 text-center text-xs text-slate-400">
      <p className="font-semibold text-slate-500">이 단계에 지원자가 없습니다</p>
      <p>다른 단계에서 카드를 옮겨오세요</p>
    </div>
  )
}
