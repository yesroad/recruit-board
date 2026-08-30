export interface SearchFilterProps {
  query: string
  role: string
  roles: string[]
  total: number
  matched: number
  onQueryChange: (value: string) => void
  onRoleChange: (value: string) => void
}

const CHIP = 'h-10 rounded-full border px-3.5 text-[13px] transition'
const CHIP_ON = 'border-accent bg-accent font-semibold text-white'
const CHIP_OFF = 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900'

export function SearchFilter({
  query,
  role,
  roles,
  total,
  matched,
  onQueryChange,
  onRoleChange,
}: SearchFilterProps) {
  return (
    <div
      role="search"
      className="flex flex-wrap items-center gap-3 rounded-[10px] border border-slate-200 bg-white px-4 py-3"
    >
      <div className="relative min-w-55 flex-1">
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="pointer-events-none absolute top-3 left-3 size-4 text-slate-400"
        >
          <circle cx="9" cy="9" r="5.5" />
          <path d="m13 13 4 4" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          aria-label="지원자 이름 검색"
          placeholder="지원자 이름 검색"
          autoComplete="off"
          className="h-10 w-full rounded-[10px] border border-slate-200 bg-slate-50 pr-3 pl-9 text-sm"
        />
      </div>

      <div role="group" aria-label="직무 필터" className="flex flex-wrap gap-1.5">
        {['', ...roles].map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={role === value}
            onClick={() => onRoleChange(value)}
            className={`${CHIP} ${role === value ? CHIP_ON : CHIP_OFF}`}
          >
            {value || '전체'}
          </button>
        ))}
      </div>

      {/* role="status" 는 MoveFeedback 이 쓴다. 한 화면에 둘이면 알림 출처가 섞인다 */}
      <p
        aria-live="polite"
        aria-atomic="true"
        className="ml-auto text-[13px] whitespace-nowrap text-slate-500"
      >
        {total.toLocaleString()}명 중{' '}
        <strong className="font-semibold text-slate-900">{matched.toLocaleString()}명</strong>
      </p>
    </div>
  )
}
