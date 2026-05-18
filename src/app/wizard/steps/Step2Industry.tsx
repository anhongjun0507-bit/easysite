'use client'

import { useState } from 'react'
import { StepShell } from '../components/StepShell'
import { StickyFooter } from '../components/StickyFooter'
import type { WizardState } from '../lib/state'

type Props = {
  state: WizardState
  onAnswer: (industry: string) => void
  onSkip: () => void
}

const SUGGESTIONS = ['카페', '학원', '병원·클리닉', '쇼핑몰', '식당']

export function Step2Industry({ state, onAnswer, onSkip }: Props) {
  const [value, setValue] = useState(state.answers.industry ?? '')
  const trimmed = value.trim()

  return (
    <>
      <StepShell
        question="어떤 업종이세요?"
        helper={<>한 단어로만 적어주셔도 돼요. 예) 카페, 학원, 병원 등.</>}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="예: 카페"
          autoComplete="off"
          maxLength={80}
          className="h-14 w-full rounded-xl border-2 border-gray-300 bg-white px-4 text-lg font-medium text-gray-900 shadow-sm placeholder:font-normal placeholder:text-gray-500 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setValue(s)}
              className="inline-flex h-10 items-center rounded-full border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:border-indigo-400 hover:text-indigo-700"
            >
              {s}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onSkip}
          className="mt-6 inline-flex h-11 items-center text-sm font-medium text-gray-500 underline-offset-4 transition hover:text-gray-700 hover:underline"
        >
          잘 모르겠어요, 다음으로
        </button>
      </StepShell>
      <StickyFooter>
        <button
          type="button"
          onClick={() => onAnswer(trimmed)}
          disabled={!trimmed}
          className="inline-flex h-13 w-full items-center justify-center rounded-xl bg-indigo-600 px-6 text-base font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ height: 52 }}
        >
          다음
        </button>
      </StickyFooter>
    </>
  )
}
