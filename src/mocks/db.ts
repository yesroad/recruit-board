import type { Candidate, Stage } from '@/types/candidate'
import { createSeed } from '@/mocks/seed'

const STORAGE_KEY = 'recruit-board/candidates'

function persist(candidates: Candidate[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates))
}

function load(): Candidate[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) return JSON.parse(stored) as Candidate[]

  const seeded = createSeed()
  persist(seeded)

  return seeded
}

export function listCandidates(): Candidate[] {
  return load()
}

export function findCandidate(id: string): Candidate | undefined {
  return load().find((candidate) => candidate.id === id)
}

export function moveCandidate(id: string, toStage: Stage): Candidate | undefined {
  const candidates = load()
  const index = candidates.findIndex((candidate) => candidate.id === id)
  if (index === -1) return undefined

  const moved = { ...candidates[index], stage: toStage }
  candidates[index] = moved
  persist(candidates)

  return moved
}

export function resetDb(): void {
  persist(createSeed())
}
