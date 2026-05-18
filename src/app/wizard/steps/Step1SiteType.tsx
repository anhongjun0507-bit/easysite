'use client'

import { useEffect } from 'react'
import { ChoiceCard } from '../components/ChoiceCard'
import { StepShell } from '../components/StepShell'
import type { SiteType, WizardState } from '../lib/state'

type Props = {
  state: WizardState
  onAnswer: (siteType: SiteType) => void
}

const OPTIONS: Array<{ value: SiteType; title: string; desc: string }> = [
  { value: 'company', title: '회사·가게 소개', desc: '브랜드·연락처·오시는 길 같은 기본 정보' },
  { value: 'shop', title: '쇼핑몰', desc: '상품 진열, 장바구니, 결제까지' },
  { value: 'reservation', title: '예약·회원제', desc: '예약 받기, 회원가입, 멤버 전용 페이지' },
  { value: 'landing', title: '랜딩페이지', desc: '한 페이지로 이벤트·캠페인 알리기' },
  { value: 'other', title: '기타', desc: '나중에 카톡으로 자세히 알려주실 거예요' },
]

export function Step1SiteType({ state, onAnswer }: Props) {
  const value = state.answers.siteType

  // Hidden 키보드 단축키 — 1/2/3/4/5
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const n = Number(e.key)
      if (Number.isInteger(n) && n >= 1 && n <= OPTIONS.length) {
        e.preventDefault()
        onAnswer(OPTIONS[n - 1].value)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onAnswer])

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
            onClick={() => onAnswer(opt.value)}
          />
        ))}
      </div>
    </StepShell>
  )
}
