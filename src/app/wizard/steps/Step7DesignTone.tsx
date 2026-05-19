'use client'

import { useEffect } from 'react'
import { ChoiceCard } from '../components/ChoiceCard'
import { StepShell } from '../components/StepShell'
import type { DesignTone, WizardState } from '../lib/state'

type Props = {
  state: WizardState
  onAnswer: (value: DesignTone) => void
}

const OPTIONS: Array<{ value: DesignTone; title: string; desc: string }> = [
  { value: 'modern', title: '모던·심플', desc: '요즘 회사 사이트 같은 깔끔한 느낌' },
  { value: 'luxury', title: '럭셔리', desc: '고급, 차분한 색감' },
  { value: 'friendly', title: '친근', desc: '따뜻하고 부드러운 분위기' },
  { value: 'auto', title: '알아서 추천해주세요', desc: '업종에 맞게 저희가 골라드릴게요' },
]

export function Step7DesignTone({ state, onAnswer }: Props) {
  const value = state.answers.designTone

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
      question="디자인은 어떤 톤이 좋으세요?"
      helper={
        <>
          잘 모르시겠으면 &ldquo;알아서&rdquo; 골라주세요. 시안 만들 때 다시
          확인해드려요.
        </>
      }
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
            onClick={() => onAnswer(opt.value)}
          />
        ))}
      </div>
    </StepShell>
  )
}
