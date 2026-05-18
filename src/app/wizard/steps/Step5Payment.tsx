'use client'

import { useEffect } from 'react'
import { ChoiceCard } from '../components/ChoiceCard'
import { StepShell } from '../components/StepShell'
import { Tooltip } from '../components/Tooltip'
import type { WizardState, YesNoUnsure } from '../lib/state'

type Props = {
  state: WizardState
  onAnswer: (value: YesNoUnsure) => void
}

const OPTIONS: Array<{ value: YesNoUnsure; title: string; desc: string }> = [
  { value: 'yes', title: '네, 필요해요', desc: '카드·계좌이체로 결제 받으려고요' },
  { value: 'no', title: '아니요, 안 받아요', desc: '결제는 다른 곳(인스타·전화 등)으로 받아요' },
]

export function Step5Payment({ state, onAnswer }: Props) {
  const value = state.answers.payment

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === '1') onAnswer('yes')
      else if (e.key === '2') onAnswer('no')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onAnswer])

  return (
    <StepShell
      question={
        <>
          사이트에서 직접 <br className="sm:hidden" />
          결제 받으실 건가요?
        </>
      }
      helper={
        <>
          <span>상품 판매·강의 결제·예약금 등 사이트 안에서 카드 결제 받는 기능이요.</span>
          <span className="ml-2 inline-block">
            <Tooltip
              content={
                <>
                  토스페이먼츠 같은 결제 모듈을 연결하는 작업이에요. 사용료
                  별도, 카드 수수료 약 3%. 안 쓰면 비용 절감돼요.
                </>
              }
            />
          </span>
        </>
      }
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
        <ChoiceCard
          selected={value === 'unsure'}
          prefix="?"
          title="잘 모르겠어요"
          description="저희가 상담 때 같이 정해드릴게요"
          variant="muted"
          onClick={() => onAnswer('unsure')}
        />
      </div>
    </StepShell>
  )
}
