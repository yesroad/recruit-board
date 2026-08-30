interface SkeletonBarProps {
  className: string
}

export function SkeletonBar({ className }: SkeletonBarProps) {
  return (
    <span className={`relative block overflow-hidden rounded bg-slate-200 ${className}`}>
      <span className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
    </span>
  )
}
