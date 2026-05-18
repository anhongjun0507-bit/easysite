'use client'

import { type ReactNode } from 'react'

type Props = {
  /** Step 헤딩 (큰 글씨) */
  question: ReactNode
  /** 헤딩 아래 helper text */
  helper?: ReactNode
  children: ReactNode
}

/**
 * 각 step 본문의 공통 layout — 헤딩·헬퍼·콘텐츠를 일관된 spacing으로.
 * Slide/fade 전환은 부모(WizardShell)에서 key로 처리.
 */
export function StepShell({ question, helper, children }: Props) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-10 pt-8 sm:px-6 sm:pt-12">
      <h1
        className="font-extrabold text-gray-900"
        style={{
          fontSize: 'clamp(26px, 5vw, 36px)',
          lineHeight: 1.25,
          letterSpacing: '-0.015em',
        }}
      >
        {question}
      </h1>
      {helper && (
        <div className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
          {helper}
        </div>
      )}
      <div className="mt-8 sm:mt-10">{children}</div>
    </div>
  )
}
