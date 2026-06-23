'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

/**
 * 모바일 전용 하단 sticky CTA 바.
 * - 히어로를 지나 스크롤(480px)하면 올라옴(translateY).
 * - 사전등록(/register) | 견적 받기(/wizard) 2버튼. X 로 닫으면 세션 동안 다시 안 뜸.
 * - transform 트랜지션만, prefers-reduced-motion 시 트랜지션 제거
 */
export function StickyCta() {
  const [scrolled, setScrolled] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 480)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const show = scrolled && !dismissed

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ease-emphasized motion-reduce:transition-none sm:hidden ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="m-3 flex items-center gap-2 rounded-2xl border border-gray-200 bg-white/95 p-2 shadow-[0_-4px_28px_-10px_rgba(17,24,39,0.3)] backdrop-blur">
        <Link
          href="/register"
          className="flex h-12 flex-1 items-center justify-center rounded-xl bg-indigo-600 px-2 text-[14px] font-bold text-white transition active:scale-[0.99]"
        >
          사전등록
        </Link>
        <Link
          href="/wizard"
          className="flex h-12 flex-1 items-center justify-center rounded-xl border border-gray-300 bg-white px-2 text-[14px] font-bold text-gray-900 transition active:scale-[0.99]"
        >
          견적 받기
        </Link>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="하단 바 닫기"
          className="inline-flex h-12 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 transition hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
