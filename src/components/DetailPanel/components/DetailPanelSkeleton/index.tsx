import { SkeletonBar } from '@/components/SkeletonBar'

interface DetailPanelSkeletonProps {
  titleId: string
  onClose: () => void
}

export function DetailPanelSkeleton({ titleId, onClose }: DetailPanelSkeletonProps) {
  return (
    <>
      <div className="flex items-start gap-3 border-b border-slate-200 p-4">
        <div className="flex-1">
          <p id={titleId} className="sr-only">
            지원자 정보를 불러오는 중입니다
          </p>
          <SkeletonBar className="mb-1.5 h-4.5 w-2/3" />
          <SkeletonBar className="h-3.5 w-1/3" />
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

      <div aria-hidden className="flex flex-1 flex-col gap-4.5 overflow-y-auto p-4">
        <SkeletonBar className="h-10 w-full" />
        <SkeletonBar className="h-10 w-full" />
        <SkeletonBar className="h-10 w-full" />
        <SkeletonBar className="h-16 w-full" />
      </div>
    </>
  )
}
