'use client'

import { useState } from 'react'
import { StepShell } from '../components/StepShell'
import { StickyFooter } from '../components/StickyFooter'
import type { Budget, Timeline, WizardState } from '../lib/state'

type Props = {
  state: WizardState
  onAnswer: (data: { timeline: Timeline; budget: Budget }) => void
}

const TIMELINE_OPTIONS: Array<{ value: Timeline; label: string; hint?: string }> = [
  { value: '2w', label: '2주 안에', hint: '빠르게' },
  { value: '1m', label: '한 달 안에' },
  { value: '2m', label: '두 달 안에' },
  { value: 'flex', label: '여유 있어요' },
]

const BUDGET_OPTIONS: Array<{ value: Budget; label: string }> = [
  { value: 'lt200', label: '200만 원 미만' },
  { value: '200-500', label: '200 ~ 500만 원' },
  { value: '500-1000', label: '500 ~ 1,000만 원' },
  { value: '1000+', label: '1,000만 원 이상' },
  { value: 'unsure', label: '잘 모르겠어요' },
]

export function Step8Timeline({ state, onAnswer }: Props) {
  const [timeline, setTimeline] = useState<Timeline | undefined>(state.answers.timeline)
  const [budget, setBudget] = useState<Budget | undefined>(state.answers.budget)
  const canNext = Boolean(timeline) && Boolean(budget)

  return (
    <>
      <StepShell
        question="언제까지·얼마 예산이세요?"
        helper={<>대략으로 골라주세요. 정확한 견적은 답변 보고 잡아드릴게요.</>}
      >
        <Section title="언제까지 필요하세요?">
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            {TIMELINE_OPTIONS.map((opt) => (
              <PillButton
                key={opt.value}
                selected={timeline === opt.value}
                onClick={() => setTimeline(opt.value)}
              >
                <span>{opt.label}</span>
                {opt.hint && (
                  <span className="ml-1.5 text-xs font-normal text-indigo-500">
                    {opt.hint}
                  </span>
                )}
              </PillButton>
            ))}
          </div>
        </Section>

        <Section title="예산은 어느 정도세요?">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-2.5">
            {BUDGET_OPTIONS.map((opt) => (
              <PillButton
                key={opt.value}
                selected={budget === opt.value}
                muted={opt.value === 'unsure'}
                onClick={() => setBudget(opt.value)}
              >
                {opt.label}
              </PillButton>
            ))}
          </div>
        </Section>
      </StepShell>
      <StickyFooter>
        <button
          type="button"
          onClick={() => {
            if (timeline && budget) onAnswer({ timeline, budget })
          }}
          disabled={!canNext}
          className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-6 text-base font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ height: 52 }}
        >
          다음 — 연락처만 남기면 끝
        </button>
      </StickyFooter>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8 last:mb-0">
      <h2 className="mb-3 text-base font-semibold text-gray-900 sm:text-lg">
        {title}
      </h2>
      {children}
    </div>
  )
}

function PillButton({
  selected,
  muted = false,
  onClick,
  children,
}: {
  selected: boolean
  muted?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  const base =
    'inline-flex items-center justify-center rounded-xl border-2 px-4 text-sm font-semibold transition sm:text-base'
  const stateClasses = selected
    ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
    : muted
      ? 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
      : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300'
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${stateClasses}`}
      style={{ height: 52 }}
    >
      {children}
    </button>
  )
}
