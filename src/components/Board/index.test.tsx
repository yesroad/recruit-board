import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Board } from '@/components'
import { STAGE_LABELS } from '@/constants/candidate'
import { setConfig } from '@/mocks/config'
import { findCandidate, listCandidates } from '@/mocks/db'
import { createSeed } from '@/mocks/seed'
import QueryProvider from '@/providers/queryProvider'
import { createQueryClient } from '@/queries/queryClient'
import { STAGES } from '@/types/candidate'

function renderBoard() {
  return render(
    <QueryProvider client={createQueryClient()}>
      <Board />
    </QueryProvider>,
  )
}

async function findColumns() {
  return waitFor(() => {
    const columns = screen.getAllByRole('region')
    expect(columns).toHaveLength(STAGES.length)
    return columns
  })
}

describe('Board', () => {
  it('5개 컬럼을 단계 순서대로 렌더한다', async () => {
    renderBoard()

    const headings = await screen.findAllByRole('heading', { level: 2 })

    expect(headings.map((heading) => heading.textContent)).toEqual(
      STAGES.map((stage) => STAGE_LABELS[stage]),
    )
  })

  it('지원자를 자기 단계 컬럼에 넣는다', async () => {
    const seed = createSeed()
    await renderBoard()
    const columns = await findColumns()

    STAGES.forEach((stage, index) => {
      const expected = seed.filter((candidate) => candidate.stage === stage)

      expect(within(columns[index]).getAllByRole('listitem')).toHaveLength(expected.length)
    })
  })

  it('이동에 성공하면 저장소에 남는다', async () => {
    const target = listCandidates().find(({ stage }) => stage === 'screening')!
    renderBoard()
    await findColumns()

    await userEvent.click(
      screen.getByRole('button', { name: `${target.name}님을 면접(으)로 이동` }),
    )

    await waitFor(() => expect(findCandidate(target.id)?.stage).toBe('interview'))
  })

  it('이동에 실패하면 카드가 원래 컬럼으로 돌아가고 실패를 알린다', async () => {
    const target = listCandidates().find(({ stage }) => stage === 'screening')!
    setConfig({ moveFailRate: 1, minDelay: 50, maxDelay: 50 })
    renderBoard()
    const [screening, interview] = await findColumns()
    const countIn = (column: HTMLElement) => within(column).getAllByRole('listitem').length
    const before = { screening: countIn(screening), interview: countIn(interview) }

    await userEvent.click(
      screen.getByRole('button', { name: `${target.name}님을 면접(으)로 이동` }),
    )

    expect(countIn(screening)).toBe(before.screening - 1)
    expect(countIn(interview)).toBe(before.interview + 1)

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('실패'))
    expect(countIn(screening)).toBe(before.screening)
    expect(countIn(interview)).toBe(before.interview)
    expect(findCandidate(target.id)?.stage).toBe('screening')
  })

  it('두 카드를 겹쳐 옮겨도 각 결과가 따로 정리된다', async () => {
    const [first, second] = listCandidates().filter(({ stage }) => stage === 'screening')
    setConfig({ minDelay: 60, maxDelay: 60 })
    renderBoard()
    const [screening] = await findColumns()
    const before = within(screening).getAllByRole('listitem').length

    await userEvent.click(
      screen.getByRole('button', { name: `${first.name}님을 면접(으)로 이동` }),
    )
    await userEvent.click(
      screen.getByRole('button', { name: `${second.name}님을 면접(으)로 이동` }),
    )

    await waitFor(() =>
      expect(within(screening).getAllByRole('listitem')).toHaveLength(before - 2),
    )
    expect(findCandidate(first.id)?.stage).toBe('interview')
    expect(findCandidate(second.id)?.stage).toBe('interview')
  })
})
