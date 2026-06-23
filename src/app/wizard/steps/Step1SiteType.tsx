'use client'

import { useState } from 'react'
import { ChoiceCard } from '../components/ChoiceCard'
import { StepShell } from '../components/StepShell'
import { StickyFooter } from '../components/StickyFooter'
import type { SiteType, WizardAnswers, WizardState } from '../lib/state'

type Props = {
  state: WizardState
  onAnswer: (patch: Partial<WizardAnswers>) => void
}

const OPTIONS: Array<{ value: Exclude<SiteType, 'other'>; title: string; desc: string }> = [
  { value: 'company', title: '회사·가게 소개', desc: '브랜드·연락처·오시는 길 같은 기본 정보' },
  { value: 'shop', title: '쇼핑몰', desc: '상품 진열, 장바구니, 결제까지' },
  { value: 'reservation', title: '예약·회원제', desc: '예약 받기, 회원가입, 멤버 전용 페이지' },
  { value: 'landing', title: '랜딩페이지', desc: '한 페이지로 이벤트·캠페인 알리기' },
  { value: 'app', title: '앱 개발', desc: 'iOS·안드로이드 모바일 앱' },
]

const inputBox =
  'w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-base text-gray-900 shadow-sm placeholder:text-gray-500 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30'

export function Step1SiteType({ state, onAnswer }: Props) {
  const value = state.answers.siteType
  const [etcMode, setEtcMode] = useState(value === 'other')
  const [etc, setEtc] = useState(state.answers.siteTypeEtc ?? '')

  if (etcMode) {
    return (
      <>
        <StepShell
          question="어떤 걸 만들까요?"
          helper={<>위 보기에 없으면 어떤 사이트인지 한 줄로 적어주세요.</>}
        >
          <textarea
            value={etc}
            onChange={(e) => setEtc(e.target.value)}
            placeholder="예: 예약이랑 쇼핑몰을 합친 형태요"
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
            onClick={() => onAnswer({ siteType: 'other', siteTypeEtc: etc.trim() || undefined })}
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
      question="어떤 사이트가 필요하세요?"
      helper={<>가장 가까운 걸 골라주세요. 정확하지 않아도 OK — 나중에 바꿀 수 있어요.</>}
    >
      <div className="grid gap-2.5 sm:gap-3">
        {OPTIONS.map((opt, i) => (
          <ChoiceCard
            key={opt.value}
            selected={value === opt.value}
            prefix={i + 1}
            title={opt.title}
            description={opt.desc}
            onClick={() => onAnswer({ siteType: opt.value, siteTypeEtc: undefined })}
          />
        ))}
        <ChoiceCard
          selected={value === 'other'}
          prefix="?"
          title="기타 (직접 입력)"
          description="위에 없으면 직접 적어주세요"
          variant="muted"
          onClick={() => setEtcMode(true)}
        />
      </div>
    </StepShell>
  )
}
