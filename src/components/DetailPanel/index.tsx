import { MoveButtons } from '@/components/MoveButtons'
import { adjacentStages } from '@/constants/candidate'
import type { Candidate, Stage } from '@/types/candidate'

import { PanelBody, PanelHeader } from './components'
import { useDetailPanel } from './useDetailPanel'

interface DetailPanelProps {
  candidateId: string
  pendingStage?: Stage
  onMove: (candidate: Candidate, toStage: Stage) => void
  onClose: () => void
}

const TITLE_ID = 'detail-panel-title'

export function DetailPanel({ candidateId, pendingStage, onMove, onClose }: DetailPanelProps) {
  const { candidate, isPending, isError, refetch, panelRef } = useDetailPanel(candidateId, onClose)

  const stage = pendingStage ?? candidate?.stage
  const { prev, next, canReject } = stage ? adjacentStages(stage) : { canReject: false }

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
        <PanelHeader titleId={TITLE_ID} candidate={candidate} isPending={isPending} onClose={onClose} />
        <PanelBody
          isPending={isPending}
          isError={isError}
          candidate={candidate}
          stage={stage}
          onRetry={() => refetch()}
        />

        {candidate && (
          <div className="px-3.5 pb-3.5">
            <MoveButtons
              name={candidate.name}
              prev={prev}
              next={next}
              canReject={canReject}
              onMove={(toStage) => onMove(candidate, toStage)}
            />
          </div>
        )}
      </aside>
    </div>
  )
}
