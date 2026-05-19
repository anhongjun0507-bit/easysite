'use client'

import { TOTAL_QUESTIONS } from '../lib/state'

type Props = {
  index: number | null
  total?: number
  onBack: () => void
  canGoBack: boolean
}

/**
 * 상단 진행률 바. intro/contact 단계에선 index=null로 호출하면 progress 숨김.
 * - 좌측 ← (이전): step 1 이상에서만 활성화
 * - 6단계 이후 "거의 다 왔어요!" 격려 (사장님 잔여 부담 ↓)
 */
export function ProgressBar({ index, total = TOTAL_QUESTIONS, onBack, canGoBack }: Props) {
  const percent = index === null ? 0 : Math.round((index / total) * 100)
  const showEncouragement = index !== null && index >= 6

  return (
    <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          aria-label="이전 단계"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="flex-1">
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={index === null ? '진행률' : `${index} / ${total} 단계`}
          >
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-500 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
          {showEncouragement && (
            <p className="mt-1.5 text-[11px] font-medium text-indigo-600">
              거의 다 왔어요!
            </p>
          )}
        </div>

        {index !== null && (
          <span className="shrink-0 text-sm font-semibold tabular-nums text-gray-600">
            {index}
            <span className="text-gray-400"> / {total}</span>
          </span>
        )}
      </div>
    </div>
  )
}
