export const STAGES = [
  'screening',
  'interview',
  'offer',
  'hired',
  'rejected',
] as const

export type Stage = (typeof STAGES)[number]

export function isStage(value: unknown): value is Stage {
  return STAGES.includes(value as Stage)
}

export type Candidate = {
  id: string
  name: string
  role: string
  appliedAt: string
  stage: Stage
  email: string
  phone: string
  experienceYears: number
  source: string
  note: string
}
