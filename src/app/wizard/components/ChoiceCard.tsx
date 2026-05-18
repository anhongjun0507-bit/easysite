'use client'

import { type ReactNode } from 'react'

type Props = {
  selected: boolean
  /** 카드 좌측 prefix. 숫자(1/2/3) 또는 ? (잘 모르겠어요). */
  prefix?: string | ReactNode
  title: ReactNode
  description?: ReactNode
  /** "잘 모르겠어요" 같은 톤다운 변형 */
  variant?: 'default' | 'muted'
  onClick: () => void
  /** 0-based index — 키보드 단축키 매핑용 (1키 → 0번 카드). UI 노출 X */
  shortcutIndex?: number
}

export function ChoiceCard({
  selected,
  prefix,
  title,
  description,
  variant = 'default',
  onClick,
}: Props) {
  const base =
    'group flex w-full items-start gap-3 rounded-xl border-2 px-4 py-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 sm:gap-4 sm:px-5 sm:py-5'
  const stateClasses = selected
    ? 'border-indigo-600 bg-indigo-50/80 shadow-sm'
    : variant === 'muted'
      ? 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'

  return (
    <button type="button" onClick={onClick} className={`${base} ${stateClasses}`}>
      {prefix !== undefined && (
        <span
          aria-hidden="true"
          className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold transition sm:h-8 sm:w-8 sm:text-base ${
            selected
              ? 'bg-indigo-600 text-white'
              : variant === 'muted'
                ? 'bg-white text-gray-500 ring-1 ring-gray-300'
                : 'bg-gray-100 text-gray-700'
          }`}
        >
          {prefix}
        </span>
      )}
      <span className="flex-1">
        <span
          className={`block text-base font-semibold sm:text-lg ${
            selected ? 'text-indigo-900' : 'text-gray-900'
          }`}
        >
          {title}
        </span>
        {description && (
          <span
            className={`mt-1 block text-sm leading-relaxed ${
              selected ? 'text-indigo-800/80' : 'text-gray-600'
            }`}
          >
            {description}
          </span>
        )}
      </span>
      {selected && (
        <span aria-hidden="true" className="mt-1 shrink-0 text-indigo-600">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M5 12l5 5L20 7" />
          </svg>
        </span>
      )}
    </button>
  )
}
