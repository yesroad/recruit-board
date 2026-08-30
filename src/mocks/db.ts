import type { Candidate, Stage } from '@/types/candidate'
import { createSeed } from '@/mocks/seed'

const STORAGE_KEY = 'recruit-board/candidates'

let cache: Candidate[] | null = null

function persist(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
}

function load(): Candidate[] {
  if (cache) return cache

  const stored = localStorage.getItem(STORAGE_KEY)
  cache = stored ? (JSON.parse(stored) as Candidate[]) : createSeed()
  if (!stored) persist()

  return cache
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
  persist()

  return moved
}

export function resetDb(): void {
  cache = createSeed()
  persist()
}
