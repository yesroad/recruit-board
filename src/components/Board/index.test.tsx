import { QueryClient } from '@tanstack/react-query'
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
import type { Stage } from '@/types/candidate'

// 1,000건 시드는 이름이 겹친다(20×30 조합). aria-label이 이름 기반이라
// 겹치는 이름을 고르면 getByRole 이 여러 개를 찾아 실패한다 - 유일한 이름만 고른다.
function findUniqueTarget(stage: Stage) {
  const all = listCandidates()
  const counts = new Map<string, number>()
  all.forEach(({ name }) => counts.set(name, (counts.get(name) ?? 0) + 1))

  return all.find((candidate) => candidate.stage === stage && counts.get(candidate.name) === 1)!
}

function renderBoard(client: QueryClient = createQueryClient()) {
  return render(
    <QueryProvider client={client}>
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
    const target = findUniqueTarget('screening')
    renderBoard()
    await findColumns()

    await userEvent.click(
      screen.getByRole('button', { name: `${target.name}님을 면접(으)로 이동` }),
    )

    await waitFor(() => expect(findCandidate(target.id)?.stage).toBe('interview'))
  })

  it('이동에 실패하면 카드가 원래 컬럼으로 돌아가고 실패를 알린다', async () => {
    const target = findUniqueTarget('screening')
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

  it('이름을 입력하면 그 이름을 포함하는 지원자만 남는다', async () => {
    const all = listCandidates()
    const { name } = all[0]
    const expected = all.filter((candidate) => candidate.name.includes(name)).length
    renderBoard()
    await findColumns()

    await userEvent.type(screen.getByRole('searchbox', { name: '지원자 이름 검색' }), name)

    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(expected))
    expect(screen.getByText(/명 중/)).toHaveTextContent(
      `${all.length.toLocaleString()}명 중 ${expected.toLocaleString()}명`,
    )
  })

  it('직무 칩을 누르면 그 직무의 지원자만 남는다', async () => {
    const all = listCandidates()
    const { role } = all[0]
    const expected = all.filter((candidate) => candidate.role === role).length
    renderBoard()
    await findColumns()

    await userEvent.click(screen.getByRole('button', { name: role }))

    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(expected))
    expect(screen.getByRole('button', { name: role })).toHaveAttribute('aria-pressed', 'true')
  })

  it('이름과 직무를 함께 걸면 둘 다 만족하는 지원자만 남는다', async () => {
    const all = listCandidates()
    const { name, role } = all[0]
    const expected = all.filter(
      (candidate) => candidate.name.includes(name) && candidate.role === role,
    ).length
    renderBoard()
    await findColumns()

    await userEvent.type(screen.getByRole('searchbox', { name: '지원자 이름 검색' }), name)
    await userEvent.click(screen.getByRole('button', { name: role }))

    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(expected))
  })

  it('전체 칩을 누르면 직무 필터가 풀린다', async () => {
    const all = listCandidates()
    const { role } = all[0]
    renderBoard()
    await findColumns()
    await userEvent.click(screen.getByRole('button', { name: role }))
    await waitFor(() => expect(screen.getAllByRole('listitem').length).toBeLessThan(all.length))

    await userEvent.click(screen.getByRole('button', { name: '전체' }))

    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(all.length))
  })

  it('직무 선택지는 응답에 있는 직무로 채워진다', async () => {
    const expected = [...new Set(listCandidates().map(({ role }) => role))].sort((a, b) =>
      a.localeCompare(b, 'ko'),
    )
    renderBoard()
    await findColumns()

    const chips = within(screen.getByRole('group', { name: '직무 필터' })).getAllByRole('button')

    expect(chips.map((chip) => chip.textContent)).toEqual(['전체', ...expected])
  })

  it('카드의 상세 버튼을 누르면 패널이 열리고 상세 필드가 보인다', async () => {
    const target = findUniqueTarget('screening')
    renderBoard()
    await findColumns()

    await userEvent.click(screen.getByRole('button', { name: `${target.name}님 상세 보기` }))

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText(target.email)).toBeInTheDocument()
    expect(within(dialog).getByText(target.source)).toBeInTheDocument()
    expect(within(dialog).getByText(target.note)).toBeInTheDocument()
  })

  it('패널을 열면 포커스가 패널로 간다', async () => {
    const target = findUniqueTarget('screening')
    renderBoard()
    await findColumns()

    await userEvent.click(screen.getByRole('button', { name: `${target.name}님 상세 보기` }))

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveFocus()
  })

  it('Esc 를 누르면 패널이 닫히고 포커스가 원래 카드로 돌아온다', async () => {
    const target = findUniqueTarget('screening')
    renderBoard()
    await findColumns()
    const trigger = screen.getByRole('button', { name: `${target.name}님 상세 보기` })

    await userEvent.click(trigger)
    await screen.findByRole('dialog')
    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(trigger).toHaveFocus()
  })

  it('패널 밖을 클릭하면 닫히고, 안을 클릭하면 닫히지 않는다', async () => {
    const target = findUniqueTarget('screening')
    renderBoard()
    await findColumns()

    await userEvent.click(screen.getByRole('button', { name: `${target.name}님 상세 보기` }))
    const dialog = await screen.findByRole('dialog')

    await userEvent.click(within(dialog).getByText(target.name))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await userEvent.click(document.body)
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('패널에서 이동하면 카드가 옮겨가고, 닫을 때 옮겨간 자리의 카드로 포커스가 간다', async () => {
    const target = findUniqueTarget('screening')
    setConfig({ minDelay: 0, maxDelay: 0 })
    renderBoard()
    const [, interviewColumn] = await findColumns()

    await userEvent.click(screen.getByRole('button', { name: `${target.name}님 상세 보기` }))
    const dialog = await screen.findByRole('dialog')
    await userEvent.click(
      within(dialog).getByRole('button', { name: `${target.name}님을 면접(으)로 이동` }),
    )

    await waitFor(() => expect(findCandidate(target.id)?.stage).toBe('interview'))
    await waitFor(() =>
      expect(
        within(interviewColumn).getByRole('button', { name: `${target.name}님 상세 보기` }),
      ).toBeInTheDocument(),
    )

    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(
      within(interviewColumn).getByRole('button', { name: `${target.name}님 상세 보기` }),
    ).toHaveFocus()
  })

  it('상세 조회에 실패하면 에러와 재시도 버튼이 보인다', async () => {
    const target = findUniqueTarget('screening')
    renderBoard(new QueryClient({ defaultOptions: { queries: { retry: 0 } } }))
    await findColumns()

    setConfig({ fetchFailRate: 1 })
    await userEvent.click(screen.getByRole('button', { name: `${target.name}님 상세 보기` }))

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('alert')).toHaveTextContent('불러오지 못했습니다')
    expect(within(dialog).getByRole('button', { name: '다시 시도' })).toBeInTheDocument()
  })
})
