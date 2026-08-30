import { HttpResponse, delay, http } from 'msw'

import { isStage } from '@/types/candidate'
import { config, randomDelay, shouldFail } from '@/mocks/config'
import { findCandidate, listCandidates, moveCandidate } from '@/mocks/db'

type MoveBody = { toStage?: unknown }

function serverError() {
  return HttpResponse.json(
    { message: '일시적인 오류가 발생했습니다. 다시 시도해 주세요.' },
    { status: 500 },
  )
}

export const handlers = [
  // GET - /api/candidates 지원자 목록
  http.get('/api/candidates', async () => {
    await delay(randomDelay())
    if (shouldFail(config.fetchFailRate)) return serverError()

    return HttpResponse.json(listCandidates())
  }),

  // GET - /api/candidates/:id 지원자 상세
  http.get('/api/candidates/:id', async ({ params }) => {
    await delay(randomDelay())
    if (shouldFail(config.fetchFailRate)) return serverError()

    const candidate = findCandidate(params.id as string)
    if (!candidate) {
      return HttpResponse.json({ message: '지원자를 찾을 수 없습니다.' }, { status: 404 })
    }

    return HttpResponse.json(candidate)
  }),

  // PATCH - /api/candidates/:id 단계 이동
  http.patch('/api/candidates/:id', async ({ params, request }) => {
    await delay(randomDelay())

    const { toStage } = (await request.json()) as MoveBody
    if (!isStage(toStage)) {
      return HttpResponse.json({ message: '알 수 없는 단계입니다.' }, { status: 400 })
    }

    const id = params.id as string
    if (!findCandidate(id)) {
      return HttpResponse.json({ message: '지원자를 찾을 수 없습니다.' }, { status: 404 })
    }

    if (shouldFail(config.moveFailRate)) return serverError()

    return HttpResponse.json(moveCandidate(id, toStage))
  }),
]
