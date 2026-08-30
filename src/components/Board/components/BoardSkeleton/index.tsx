import { SkeletonBar } from '@/components/SkeletonBar'
import { STAGES } from '@/types/candidate'

function SkeletonCard() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <SkeletonBar className="mb-2 h-3.5 w-2/3" />
      <SkeletonBar className="h-3 w-4/5" />
      <div className="mt-2.5 flex items-center gap-1.5">
        <SkeletonBar className="h-[18px] w-13 rounded-full" />
        <SkeletonBar className="ml-auto h-[18px] w-17" />
      </div>
    </div>
  )
}

export function BoardSkeleton() {
  return (
    <div aria-hidden className="flex min-h-0 flex-1 gap-3 overflow-x-auto pb-2">
      <p role="status" className="sr-only">
        지원자 목록을 불러오는 중입니다
      </p>
      {STAGES.map((stage) => (
        <div
          key={stage}
          className="flex min-h-0 w-65 shrink-0 flex-col gap-2 rounded-[10px] border border-slate-200 bg-slate-100 p-2.5"
        >
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ))}
    </div>
  )
}
