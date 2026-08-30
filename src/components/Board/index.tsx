import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'

import { DetailPanel } from '@/components/DetailPanel'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { SearchFilter } from '@/components/SearchFilter'
import { STAGES } from '@/types/candidate'

import { BoardColumn } from '../BoardColumn'

import { BoardEmptyFilter, BoardError, BoardSkeleton, MoveFeedback } from './components'
import { useBoard } from './useBoard'

export function Board() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} fallback={(retry) => <BoardError onRetry={retry} />}>
          <Suspense fallback={<BoardSkeleton />}>
            <BoardContent />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}

function BoardContent() {
  const {
    columns,
    pending,
    feedback,
    filter,
    selected,
    isFiltered,
    handleMove,
    openDetail,
    closeDetail,
    resetFilter,
  } = useBoard()

  const allFilteredOut = filter.total > 0 && filter.matched === 0

  return (
    <>
      <SearchFilter {...filter} />

      {allFilteredOut ? (
        <BoardEmptyFilter query={filter.query} onReset={resetFilter} />
      ) : (
        <div className="flex min-h-0 flex-1 gap-3 overflow-x-auto pb-2">
          {STAGES.map((stage) => (
            <BoardColumn
              key={stage}
              stage={stage}
              candidates={columns[stage]}
              pending={pending}
              onMove={handleMove}
              onSelect={openDetail}
              isFiltered={isFiltered}
            />
          ))}
        </div>
      )}

      {selected && (
        <DetailPanel
          candidateId={selected.id}
          pendingStage={pending[selected.id]}
          onMove={handleMove}
          onClose={closeDetail}
        />
      )}

      <MoveFeedback feedback={feedback} />
    </>
  )
}
