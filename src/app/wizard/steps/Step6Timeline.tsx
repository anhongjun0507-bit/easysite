'use client'

import { ChoiceCard } from '../components/ChoiceCard'
import { StepShell } from '../components/StepShell'
import type { Timeline, WizardAnswers, WizardState } from '../lib/state'

type Props = {
  state: WizardState
  onAnswer: (patch: Partial<WizardAnswers>) => void
}

const OPTIONS: Array<{ value: Timeline; title: string; desc: string }> = [
  { value: '2w', title: '2주 안에', desc: '빠르게 — 급행 처리 (가격 ×1.3)' },
  { value: '1m', title: '한 달 안에', desc: '가장 일반적인 일정' },
  { value: '2m', title: '두 달 안에', desc: '여유 있게 다듬어서' },
  { value: 'flex', title: '여유 있어요', desc: '급하지 않아요' },
]

export function Step6Timeline({ state, onAnswer }: Props) {
  const value = state.answers.timeline
  return (
    <StepShell
      question="언제까지 필요하세요?"
      helper={<>대략으로 골라주세요. 연락처만 남기면 끝나요.</>}
    >
      <div className="grid gap-2.5 sm:gap-3">
        {OPTIONS.map((opt, i) => (
          <ChoiceCard
            key={opt.value}
            selected={value === opt.value}
            prefix={i + 1}
            title={opt.title}
            description={opt.desc}
            onClick={() => onAnswer({ timeline: opt.value })}
          />
        ))}
      </div>
    </StepShell>
  )
}
