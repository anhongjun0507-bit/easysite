'use client'

import { useState } from 'react'
import { StepShell } from '../components/StepShell'
import { StickyFooter } from '../components/StickyFooter'
import type { WizardAnswers, WizardState } from '../lib/state'

type Props = {
  state: WizardState
  onAnswer: (patch: Partial<WizardAnswers>) => void
}

const SUGGESTIONS = ['카페', '학원', '병원·클리닉', '쇼핑몰', '식당']

const inputBox =
  'w-full rounded-xl border-2 border-gray-300 bg-white px-4 text-base text-gray-900 shadow-sm placeholder:text-gray-500 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30'

export function Step5Business({ state, onAnswer }: Props) {
  const [name, setName] = useState(state.answers.businessName ?? '')
  const [industry, setIndustry] = useState(state.answers.industry ?? '')
  const [tagline, setTagline] = useState(state.answers.tagline ?? '')

  const submit = () =>
    onAnswer({
      businessName: name.trim() || undefined,
      industry: industry.trim() || undefined,
      tagline: tagline.trim() || undefined,
    })

  return (
    <>
      <StepShell
        question="상호랑 업종을 알려주세요"
        helper={<>AI가 카피·시안 초안 만들 때 써요. 잘 모르겠으면 전체 건너뛰셔도 돼요.</>}
      >
        <div className="space-y-5">
          <div>
            <label htmlFor="biz-name" className="block text-sm font-semibold text-gray-900">
              상호 (회사·가게 이름)
            </label>
            <input
              id="biz-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 손맛한식당"
              autoComplete="organization"
              maxLength={80}
              className={`${inputBox} mt-2`}
              style={{ height: 52 }}
            />
          </div>

          <div>
            <label htmlFor="biz-industry" className="block text-sm font-semibold text-gray-900">
              업종
            </label>
            <input
              id="biz-industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="예: 카페 (직접 입력해도 돼요)"
              maxLength={80}
              className={`${inputBox} mt-2`}
              style={{ height: 52 }}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setIndustry(s)}
                  className="inline-flex h-10 items-center rounded-full border border-gray-300 bg-white px-3.5 text-sm font-medium text-gray-700 transition hover:border-indigo-400 hover:text-indigo-700"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="biz-tagline" className="block text-sm font-semibold text-gray-900">
              한 줄 소개{' '}
              <span className="ml-1 text-xs font-normal text-gray-500">(선택)</span>
            </label>
            <textarea
              id="biz-tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="예: 30년 손맛, 그대로 차려드립니다"
              maxLength={200}
              rows={2}
              className={`${inputBox} mt-2 py-3 leading-relaxed`}
            />
            <p className="mt-1.5 text-xs text-gray-500">
              비워두시면 AI가 업종·상호 기반으로 초안을 만들어드려요.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onAnswer({})}
            className="inline-flex h-11 items-center text-sm font-medium text-gray-500 underline-offset-4 transition hover:text-gray-700 hover:underline"
          >
            전체 건너뛰기
          </button>
        </div>
      </StepShell>
      <StickyFooter>
        <button
          type="button"
          onClick={submit}
          className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-6 text-base font-semibold text-white transition hover:bg-indigo-700"
          style={{ height: 52 }}
        >
          다음
        </button>
      </StickyFooter>
    </>
  )
}
