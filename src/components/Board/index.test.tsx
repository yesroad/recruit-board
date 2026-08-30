import { render, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Board } from '@/components'
import { STAGE_LABELS } from '@/constants/candidate'
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

    for (const column of columns) {
      const stage = column.getAttribute('data-stage')
      const expected = seed.filter((candidate) => candidate.stage === stage)

      expect(within(column).getAllByRole('listitem')).toHaveLength(expected.length)
      expect(within(column).getByText(expected[0].name)).toBeInTheDocument()
    }
  })
})
