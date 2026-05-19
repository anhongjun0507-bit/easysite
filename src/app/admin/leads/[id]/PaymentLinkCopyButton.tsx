'use client'

import { useState } from 'react'
import { showToast } from './Toaster'

/** pending 결제 행에서 노출되는 "결제 링크 다시 복사" 버튼 */
export function PaymentLinkCopyButton({ paymentUrl }: { paymentUrl: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(paymentUrl)
      setCopied(true)
      showToast('결제 링크 복사됨')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast('복사 실패. 직접 선택해서 복사해주세요', 'error')
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-11 items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 text-xs font-semibold text-gray-800 transition hover:border-gray-400 hover:text-gray-900"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      {copied ? '복사됨' : '링크 다시 복사'}
    </button>
  )
}
