import { DetailPanel } from '@/components/DetailPanel'
import { SearchFilter } from '@/components/SearchFilter'
import { STAGES } from '@/types/candidate'

import { BoardColumn } from '../BoardColumn'

import { MoveFeedback } from './components'
import { useBoard } from './useBoard'

export function Board() {
  const {
    columns,
    pending,
    feedback,
    filter,
    selected,
    isPending,
    isError,
    handleMove,
    openDetail,
    closeDetail,
  } = useBoard()

  if (isPending) return <p className="p-6 text-sm text-slate-500">불러오는 중</p>
  if (isError)
    return (
      <p role="alert" className="p-6 text-sm text-danger">
        목록을 불러오지 못했습니다
      </p>
    )

  return (
    <>
      <SearchFilter {...filter} />

      <div className="flex min-h-0 flex-1 gap-3 overflow-x-auto pb-2">
        {STAGES.map((stage) => (
          <BoardColumn
            key={stage}
            stage={stage}
            candidates={columns[stage]}
            pending={pending}
            onMove={handleMove}
            onSelect={openDetail}
          />
        ))}
      </div>

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
