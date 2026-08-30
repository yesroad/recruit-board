import { StageBadge } from '@/components/StageBadge'
import { formatDateLong } from '@/lib/format'
import type { Candidate, Stage } from '@/types/candidate'

import { DetailField } from '../DetailField'

interface PanelBodyProps {
  isPending: boolean
  isError: boolean
  candidate?: Candidate
  stage?: Stage
  onRetry: () => void
}

export function PanelBody({ isPending, isError, candidate, stage, onRetry }: PanelBodyProps) {
  return (
    <div className="flex flex-1 flex-col gap-4.5 overflow-y-auto p-4">
      {isPending && <p className="text-sm text-slate-500">불러오는 중</p>}

      {isError && (
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
      )}

      {candidate && (
        <>
          <DetailField label="현재 단계">
            <StageBadge stage={stage!} />
          </DetailField>
          <DetailField label="지원일">{formatDateLong(candidate.appliedAt)}</DetailField>
          <DetailField label="경력">
            {candidate.experienceYears === 0 ? '신입' : `${candidate.experienceYears}년`}
          </DetailField>
          <DetailField label="지원 경로">{candidate.source}</DetailField>
          <DetailField label="연락처">
            <div>{candidate.email}</div>
            <div>{candidate.phone}</div>
          </DetailField>
          <DetailField label="메모">{candidate.note}</DetailField>
        </>
      )}
    </div>
  )
}
