interface BoardEmptyFilterProps {
  query: string
  onReset: () => void
}

export function BoardEmptyFilter({ query, onReset }: BoardEmptyFilterProps) {
  const title = query.trim()
    ? `'${query}'와 일치하는 지원자가 없습니다`
    : '조건에 맞는 지원자가 없습니다'

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="text-xs">이름 철자나 직무 필터를 확인해 보세요</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-1 h-9 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"
      >
        필터 초기화
      </button>
    </div>
  )
}
