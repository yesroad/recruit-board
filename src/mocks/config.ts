export type MockConfig = {
  minDelay: number
  maxDelay: number
  fetchFailRate: number
  moveFailRate: number
}

const DEFAULTS: MockConfig = {
  minDelay: 200,
  maxDelay: 800,
  fetchFailRate: 0.15,
  moveFailRate: 0.15,
}

function numberParam(params: URLSearchParams, key: string): number | undefined {
  const raw = params.get(key)
  if (raw === null) return undefined

  const value = Number(raw)
  return Number.isFinite(value) ? value : undefined
}

function fromSearchParams(search: string): Partial<MockConfig> {
  const params = new URLSearchParams(search)
  const override: Partial<MockConfig> = {}

  const delay = numberParam(params, 'delay')
  if (delay !== undefined) {
    override.minDelay = delay
    override.maxDelay = delay
  }

  const fetchFailRate = numberParam(params, 'fetchFailRate')
  if (fetchFailRate !== undefined) override.fetchFailRate = fetchFailRate

  const moveFailRate = numberParam(params, 'moveFailRate')
  if (moveFailRate !== undefined) override.moveFailRate = moveFailRate

  return override
}

export const config: MockConfig = {
  ...DEFAULTS,
  ...fromSearchParams(location.search),
}

export function setConfig(override: Partial<MockConfig>): void {
  Object.assign(config, override)
}

export function resetConfig(): void {
  Object.assign(config, DEFAULTS)
}

export function randomDelay(): number {
  const { minDelay, maxDelay } = config
  return minDelay + Math.random() * (maxDelay - minDelay)
}

export function shouldFail(rate: number): boolean {
  return Math.random() < rate
}
