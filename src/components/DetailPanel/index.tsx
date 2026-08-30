import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'

import { MoveButtons } from '@/components/MoveButtons'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { adjacentStages } from '@/constants/candidate'
import { useGetCandidateDetail } from '@/queries/candidate/queries'
import type { Candidate, Stage } from '@/types/candidate'

import { DetailPanelError, DetailPanelSkeleton, PanelBody, PanelHeader } from './components'
import { useDetailPanel } from './useDetailPanel'

interface DetailPanelProps {
  candidateId: string
  pendingStage?: Stage
  onMove: (candidate: Candidate, toStage: Stage) => void
  onClose: () => void
}

const TITLE_ID = 'detail-panel-title'

export function DetailPanel({ candidateId, pendingStage, onMove, onClose }: DetailPanelProps) {
  const { panelRef } = useDetailPanel(candidateId, onClose)

  return (
    <div className="fixed inset-0 z-10 flex justify-end">
      <div aria-hidden className="flex-1 bg-slate-900/30" />

      <aside
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={TITLE_ID}
        className="flex w-85 flex-col border-l border-slate-200 bg-white"
      >
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              fallback={(retry) => (
                <DetailPanelError titleId={TITLE_ID} onClose={onClose} onRetry={retry} />
              )}
            >
              <Suspense fallback={<DetailPanelSkeleton titleId={TITLE_ID} onClose={onClose} />}>
                <DetailPanelContent
                  candidateId={candidateId}
                  pendingStage={pendingStage}
                  onMove={onMove}
                  onClose={onClose}
                />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </aside>
    </div>
  )
}

function DetailPanelContent({
  candidateId,
  pendingStage,
  onMove,
  onClose,
}: {
  candidateId: string
  pendingStage?: Stage
  onMove: (candidate: Candidate, toStage: Stage) => void
  onClose: () => void
}) {
  const { data: candidate } = useGetCandidateDetail(candidateId)
  const stage = pendingStage ?? candidate.stage
  const { prev, next, canReject } = adjacentStages(stage)

  return (
    <>
      <PanelHeader titleId={TITLE_ID} candidate={candidate} onClose={onClose} />
      <PanelBody candidate={candidate} stage={stage} />

      <div className="px-3.5 pb-3.5">
        <MoveButtons
          name={candidate.name}
          prev={prev}
          next={next}
          canReject={canReject}
          onMove={(toStage) => onMove(candidate, toStage)}
        />
      </div>
    </>
  )
}
