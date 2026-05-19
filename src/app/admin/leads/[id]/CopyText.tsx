'use client'

import { showToast } from './Toaster'

async function copy(value: string, label: string) {
  try {
    await navigator.clipboard.writeText(value)
    showToast(`${label} 복사됨`)
  } catch {
    showToast('복사 실패 — 직접 선택해주세요', 'error')
  }
}

/**
 * 클릭하면 클립보드 복사 + 토스트. value가 비어있으면 회색 "—"로 표시 (비활성).
 */
export function CopyText({
  value,
  label,
  mono = false,
}: {
  value: string | null | undefined
  label: string
  mono?: boolean
}) {
  if (!value) {
    return <span className="text-gray-400">—</span>
  }

  return (
    <button
      type="button"
      onClick={() => copy(value, label)}
      title={`${label} 복사`}
      className={`group inline-flex items-center gap-1.5 rounded text-left text-gray-900 transition hover:text-indigo-700 ${mono ? 'tabular-nums' : ''}`}
    >
      <span className="underline decoration-dotted decoration-gray-300 underline-offset-2 group-hover:decoration-indigo-400">
        {value}
      </span>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="h-3.5 w-3.5 shrink-0 opacity-0 transition group-hover:opacity-100"
      >
        <rect x="6.5" y="6.5" width="9" height="9" rx="1.5" />
        <path d="M4.5 13V5a.5.5 0 0 1 .5-.5h8" />
      </svg>
    </button>
  )
}

/** 헤더 빠른 액션용 — 카톡 ID를 클립보드에 복사. 표준 URL 스킴이 없어 이렇게 처리. */
export function KakaoCopyButton({ kakao }: { kakao: string }) {
  return (
    <button
      type="button"
      onClick={() => copy(kakao, '카카오 ID')}
      title={`카카오 ID "${kakao}" 복사`}
      className="inline-flex h-10 items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 text-xs font-semibold text-gray-800 transition hover:border-gray-400 hover:text-gray-900"
    >
      <span aria-hidden="true">💬</span> 카톡 ID
    </button>
  )
}
