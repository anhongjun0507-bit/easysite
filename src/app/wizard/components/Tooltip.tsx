'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

type Props = {
  /** 트리거에 표시할 텍스트. 기본 "이게 뭐예요?" */
  label?: string
  content: ReactNode
}

/**
 * "이게 뭐예요?" 팝오버 — 어려운 용어 옆에 작은 버튼.
 * 클릭으로 토글 (모바일 친화), 바깥 클릭/ESC로 닫힘.
 */
export function Tooltip({ label = '이게 뭐예요?', content }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <span ref={ref} className="relative inline-block align-middle">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex h-7 items-center gap-1 rounded-full bg-gray-100 px-2.5 text-xs font-medium text-gray-600 transition hover:bg-gray-200 hover:text-gray-800"
      >
        <span
          aria-hidden="true"
          className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-400 text-[10px] font-bold text-white"
        >
          ?
        </span>
        {label}
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute left-1/2 top-full z-40 mt-2 w-64 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-3 text-xs leading-relaxed text-gray-700 shadow-lg sm:w-72 sm:text-sm"
        >
          {content}
        </span>
      )}
    </span>
  )
}
