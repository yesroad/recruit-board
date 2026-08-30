import type { ReactNode } from 'react'

interface DetailFieldProps {
  label: string
  children: ReactNode
}

export function DetailField({ label, children }: DetailFieldProps) {
  return (
    <div>
      <div className="mb-1.5 text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
        {label}
      </div>
      <div className="text-sm text-slate-900">{children}</div>
    </div>
  )
}
