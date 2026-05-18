'use client'

import { useState } from 'react'
import { StepShell } from '../components/StepShell'
import { StickyFooter } from '../components/StickyFooter'
import type { WizardState } from '../lib/state'

type Props = {
  state: WizardState
  onAnswer: (data: { businessName: string; tagline: string }) => void
  onSkip: () => void
}

export function Step3Business({ state, onAnswer, onSkip }: Props) {
  const [name, setName] = useState(state.answers.businessName ?? '')
  const [tagline, setTagline] = useState(state.answers.tagline ?? '')
  const nameTrim = name.trim()
  const taglineTrim = tagline.trim()
  const canNext = nameTrim.length > 0

  return (
    <>
      <StepShell
        question={
          <>
            상호랑 <br className="sm:hidden" />한 줄 소개를 알려주세요
          </>
        }
        helper={
          <>
            한 줄 소개가 어려우시면 비워두셔도 OK — 나중에 AI가 초안을
            만들어드려요.
          </>
        }
      >
        <div className="space-y-5">
          <div>
            <label
              htmlFor="biz-name"
              className="block text-sm font-semibold text-gray-900"
            >
              상호 (회사·가게 이름)
            </label>
            <input
              id="biz-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 손맛한식당"
              autoComplete="organization"
              maxLength={80}
              className="mt-2 h-13 w-full rounded-xl border-2 border-gray-300 bg-white px-4 text-base font-medium text-gray-900 shadow-sm placeholder:font-normal placeholder:text-gray-500 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              style={{ height: 52 }}
            />
          </div>

          <div>
            <label
              htmlFor="biz-tagline"
              className="block text-sm font-semibold text-gray-900"
            >
              한 줄 소개{' '}
              <span className="ml-1 text-xs font-normal text-gray-500">
                (선택)
              </span>
            </label>
            <textarea
              id="biz-tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="예: 30년 손맛, 그대로 차려드립니다"
              maxLength={200}
              rows={3}
              className="mt-2 w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-base text-gray-900 shadow-sm placeholder:text-gray-500 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
            <p className="mt-1.5 text-xs text-gray-500">
              비워두시면 AI가 업종·상호 기반으로 초안을 만들어드려요.
            </p>
          </div>

          <button
            type="button"
            onClick={onSkip}
            className="inline-flex h-11 items-center text-sm font-medium text-gray-500 underline-offset-4 transition hover:text-gray-700 hover:underline"
          >
            잘 모르겠어요, 다음으로
          </button>
        </div>
      </StepShell>
      <StickyFooter>
        <button
          type="button"
          onClick={() => onAnswer({ businessName: nameTrim, tagline: taglineTrim })}
          disabled={!canNext}
          className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-6 text-base font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          style={{ height: 52 }}
        >
          다음
        </button>
      </StickyFooter>
    </>
  )
}
