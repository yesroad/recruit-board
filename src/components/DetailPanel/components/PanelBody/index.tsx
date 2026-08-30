import { StageBadge } from '@/components/StageBadge'
import { formatDateLong } from '@/lib/format'
import type { Candidate, Stage } from '@/types/candidate'

import { DetailField } from '../DetailField'

interface PanelBodyProps {
  candidate: Candidate
  stage: Stage
}

export function PanelBody({ candidate, stage }: PanelBodyProps) {
  return (
    <div className="flex flex-1 flex-col gap-4.5 overflow-y-auto p-4">
      <DetailField label="현재 단계">
        <StageBadge stage={stage} />
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
    </div>
  )
}
