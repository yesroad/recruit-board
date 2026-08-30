import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { CandidateCard } from '@/components'
import { STAGE_LABELS } from '@/constants/candidate'
import { findCandidate, listCandidates } from '@/mocks/db'
import { createSeed } from '@/mocks/seed'
import QueryProvider from '@/providers/queryProvider'
import { createQueryClient } from '@/queries/queryClient'
import type { Candidate } from '@/types/candidate'

function renderCard(candidate: Candidate) {
  return render(
    <QueryProvider client={createQueryClient()}>
      <CandidateCard candidate={candidate} />
    </QueryProvider>,
  )
}

describe('CandidateCard', () => {
  it('이름·직무·지원일·현재 단계를 모두 보여준다', () => {
    const candidate = createSeed(1)[0]

    renderCard(candidate)

    expect(screen.getByText(candidate.name)).toBeInTheDocument()
    expect(screen.getByText(candidate.role)).toBeInTheDocument()
    expect(screen.getByText(STAGE_LABELS[candidate.stage])).toBeInTheDocument()
    expect(screen.getByRole('time')).toHaveAttribute('datetime', candidate.appliedAt)
  })

  it('이동 버튼을 누르면 서버 저장소의 단계가 바뀐다', async () => {
    const candidate = listCandidates().find(({ stage }) => stage === 'screening')!

    renderCard(candidate)
    await userEvent.click(
      screen.getByRole('button', { name: new RegExp(STAGE_LABELS.interview) }),
    )

    await waitFor(() => expect(findCandidate(candidate.id)?.stage).toBe('interview'))
  })
})
