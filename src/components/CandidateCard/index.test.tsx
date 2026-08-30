import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CandidateCard } from '@/components'
import { STAGE_LABELS } from '@/constants/candidate'
import { createSeed } from '@/mocks/seed'

describe('CandidateCard', () => {
  it('이름·직무·지원일·현재 단계를 모두 보여준다', () => {
    const candidate = createSeed(1)[0]

    render(<CandidateCard candidate={candidate} onMove={() => {}} />)

    expect(screen.getByText(candidate.name)).toBeInTheDocument()
    expect(screen.getByText(candidate.role)).toBeInTheDocument()
    expect(screen.getByText(STAGE_LABELS[candidate.stage])).toBeInTheDocument()
    expect(screen.getByRole('time')).toHaveAttribute('datetime', candidate.appliedAt)
  })
})
