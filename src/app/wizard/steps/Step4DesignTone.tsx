'use client'

import { useState } from 'react'
import { ChoiceCard } from '../components/ChoiceCard'
import { StepShell } from '../components/StepShell'
import { StickyFooter } from '../components/StickyFooter'
import type { DesignTone, WizardAnswers, WizardState } from '../lib/state'

type Props = {
  state: WizardState
  onAnswer: (patch: Partial<WizardAnswers>) => void
}

const OPTIONS: Array<{ value: Exclude<DesignTone, 'other'>; title: string; desc: string }> = [
  { value: 'modern', title: '모던·심플', desc: '요즘 회사 사이트 같은 깔끔한 느낌' },
  { value: 'luxury', title: '럭셔리', desc: '고급, 차분한 색감' },
  { value: 'friendly', title: '친근', desc: '따뜻하고 부드러운 분위기' },
  { value: 'auto', title: '알아서 추천해주세요', desc: '업종에 맞게 저희가 골라드릴게요' },
]

const inputBox =
  'w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-base text-gray-900 shadow-sm placeholder:text-gray-500 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30'

export function Step4DesignTone({ state, onAnswer }: Props) {
  const value = state.answers.designTone
  const [etcMode, setEtcMode] = useState(value === 'other')
  const [etc, setEtc] = useState(state.answers.designToneEtc ?? '')

  if (etcMode) {
    return (
      <>
        <StepShell
          question="디자인은 어떤 톤이 좋으세요?"
          helper={<>원하는 분위기·참고 사이트를 자유롭게 적어주세요.</>}
        >
          <textarea
            value={etc}
            onChange={(e) => setEtc(e.target.value)}
            placeholder="예: 애플 사이트처럼 여백 많고 미니멀하게"
            maxLength={120}
            rows={3}
            className={`${inputBox} resize-none leading-relaxed`}
          />
          <button
            type="button"
            onClick={() => setEtcMode(false)}
            className="mt-4 inline-flex h-11 items-center text-sm font-medium text-gray-500 transition hover:text-gray-700"
          >
            ← 다시 고르기
          </button>
        </StepShell>
        <StickyFooter>
          <button
            type="button"
            onClick={() => onAnswer({ designTone: 'other', designToneEtc: etc.trim() || undefined })}
            className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-6 text-base font-semibold text-white transition hover:bg-indigo-700"
            style={{ height: 52 }}
          >
            다음
          </button>
        </StickyFooter>
      </>
    )
  }

  return (
    <StepShell
      question="디자인은 어떤 톤이 좋으세요?"
      helper={<>잘 모르시겠으면 “알아서” 골라주세요. 시안 만들 때 다시 확인해드려요. (가격엔 영향 없어요)</>}
    >
      <div className="grid gap-2.5 sm:gap-3">
        {OPTIONS.map((opt, i) => (
          <ChoiceCard
            key={opt.value}
            selected={value === opt.value}
            prefix={opt.value === 'auto' ? '?' : i + 1}
            title={opt.title}
            description={opt.desc}
            variant={opt.value === 'auto' ? 'muted' : 'default'}
            onClick={() => onAnswer({ designTone: opt.value, designToneEtc: undefined })}
          />
        ))}
        <ChoiceCard
          selected={value === 'other'}
          prefix="?"
          title="기타 (직접 입력)"
          description="원하는 분위기를 직접 적을게요"
          variant="muted"
          onClick={() => setEtcMode(true)}
        />
      </div>
    </StepShell>
  )
}
