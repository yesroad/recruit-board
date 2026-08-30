import { STAGE_DOT_CLASS, STAGE_LABELS } from '@/constants/candidate'
import type { Candidate, Stage } from '@/types/candidate'

interface BoardColumnProps {
  stage: Stage
  candidates: Candidate[]
}

export function BoardColumn({ stage, candidates }: BoardColumnProps) {
  const label = STAGE_LABELS[stage]

  return (
    <section
      aria-labelledby={`column-${stage}-title`}
      data-stage={stage}
      className="flex min-h-0 w-65 shrink-0 flex-col rounded-[10px] border border-slate-200 bg-slate-100"
    >
      <div className="flex items-center gap-2 border-b border-slate-200 px-3.5 py-3">
        <span aria-hidden className={`size-2 shrink-0 rounded-full ${STAGE_DOT_CLASS[stage]}`} />
        <h2 id={`column-${stage}-title`} className="text-[13px] font-semibold">
          {label}
        </h2>
        <span className="ml-auto rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-500">
          {candidates.length.toLocaleString()}
          <span className="sr-only">명</span>
        </span>
      </div>

      <ul role="list" className="flex min-h-0 flex-col gap-2 overflow-y-auto p-2.5">
        {candidates.map((candidate, index) => (
          <li
            key={candidate.id}
            data-index={index}
            data-candidate-id={candidate.id}
            className="truncate rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            {candidate.name}
          </li>
        ))}
      </ul>
    </section>
  )
}
