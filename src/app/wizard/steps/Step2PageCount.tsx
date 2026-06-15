'use client'

import { ChoiceCard } from '../components/ChoiceCard'
import { StepShell } from '../components/StepShell'
import type { PageCount, WizardAnswers, WizardState } from '../lib/state'

type Props = {
  state: WizardState
  onAnswer: (patch: Partial<WizardAnswers>) => void
}

const OPTIONS: Array<{ value: Exclude<PageCount, 'unsure'>; title: string; desc: string }> = [
  { value: 'small', title: '5개 이내', desc: '보통 사이즈 — 회사 소개·연락처·서비스 정도' },
  { value: 'medium', title: '5 ~ 10개', desc: '메뉴·갤러리·블로그까지 넉넉히' },
  { value: 'large', title: '10개 넘게', desc: '큰 사이트 — 상품 카테고리·다국어 등' },
]

export function Step2PageCount({ state, onAnswer }: Props) {
  const value = state.answers.pageCount
  return (
    <StepShell
      question="몇 개 정도 페이지가 필요할까요?"
      helper={<>회사 소개·메뉴·연락처 같은 거 다 합쳐서요.</>}
    >
      <div className="grid gap-2.5 sm:gap-3">
        {OPTIONS.map((opt, i) => (
          <ChoiceCard
            key={opt.value}
            selected={value === opt.value}
            prefix={i + 1}
            title={opt.title}
            description={opt.desc}
            onClick={() => onAnswer({ pageCount: opt.value })}
          />
        ))}
        <ChoiceCard
          selected={value === 'unsure'}
          prefix="?"
          title="잘 모르겠어요"
          description="기본 사이즈로 가정하고 견적 잡아드릴게요"
          variant="muted"
          onClick={() => onAnswer({ pageCount: 'unsure' })}
        />
      </div>
    </StepShell>
  )
}
