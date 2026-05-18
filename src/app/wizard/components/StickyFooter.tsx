'use client'

import { type ReactNode } from 'react'

type Props = {
  children: ReactNode
}

/**
 * 화면 하단 sticky CTA 컨테이너. iOS safe-area 반영.
 * 자유 입력·multi-choice 단계에서만 사용. single-choice는 클릭 즉시 다음이라 불필요.
 */
export function StickyFooter({ children }: Props) {
  return (
    <div
      className="sticky bottom-0 left-0 right-0 z-20 border-t border-gray-200 bg-white/95 backdrop-blur-xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto max-w-2xl px-4 py-3 sm:px-6 sm:py-4">{children}</div>
    </div>
  )
}
