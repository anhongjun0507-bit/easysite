'use client'

import type { UseFormRegisterReturn } from 'react-hook-form'

type Tone = 'light' | 'dark'

/**
 * 칩/pill 단일선택 — 드롭다운 대신 탭형. 네이티브 라디오를 sr-only 로 깔고
 * peer-checked 로 시각화 → 키보드(탭·방향키)·스크린리더 접근성 그대로 유지.
 * react-hook-form 의 register() 결과를 그룹의 모든 라디오에 spread 한다.
 */
export function PillGroup({
  label,
  hint,
  required,
  error,
  tone,
  options,
  registration,
}: {
  label: string
  hint?: string
  required?: boolean
  error?: string
  tone: Tone
  options: readonly string[]
  registration: UseFormRegisterReturn
}) {
  const dark = tone === 'dark'

  return (
    <fieldset>
      <legend
        className={
          dark
            ? 'text-[13px] font-medium tracking-wide text-white/55'
            : 'block text-sm font-semibold text-gray-800'
        }
      >
        {label}
        {required ? (
          <span className={dark ? 'ml-1 text-white' : 'ml-1 text-indigo-600'}>*</span>
        ) : (
          <span
            className={
              dark
                ? 'ml-1.5 text-xs font-normal text-white/35'
                : 'ml-1.5 text-xs font-normal text-gray-400'
            }
          >
            선택
          </span>
        )}
      </legend>
      {hint && (
        <p className={dark ? 'mt-1 text-xs text-white/40' : 'mt-0.5 text-xs text-gray-500'}>
          {hint}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((opt) => (
          <label key={opt} className="cursor-pointer">
            <input
              type="radio"
              value={opt}
              {...registration}
              className="peer sr-only"
            />
            <span
              data-cursor="hover"
              className={
                dark
                  ? 'inline-flex select-none items-center rounded-full border border-white/20 px-4 py-2.5 text-[15px] font-medium text-white/65 transition-colors duration-200 hover:border-white/45 hover:text-white peer-checked:border-white peer-checked:bg-white peer-checked:font-semibold peer-checked:text-gray-950 peer-focus-visible:ring-2 peer-focus-visible:ring-white/70 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-gray-950'
                  : 'inline-flex select-none items-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition-colors duration-200 hover:border-gray-400 peer-checked:border-indigo-600 peer-checked:bg-indigo-600 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500 peer-focus-visible:ring-offset-2'
              }
            >
              {opt}
            </span>
          </label>
        ))}
      </div>

      {error && (
        <p
          role="alert"
          className={dark ? 'mt-2 text-sm text-rose-300' : 'mt-2 text-sm text-red-600'}
        >
          {error}
        </p>
      )}
    </fieldset>
  )
}
