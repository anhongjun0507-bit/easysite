'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

/**
 * 모바일 전용 하단 sticky CTA 바.
 * - 히어로를 지나 스크롤하면 올라옴(translateY) → 폼(#register) 도달 시 자동 숨김
 * - X 로 닫으면 세션 동안 다시 안 뜸. 탭하면 폼으로 스크롤
 * - transform 트랜지션만, prefers-reduced-motion 시 트랜지션 제거
 */
export function StickyCta() {
  const [scrolled, setScrolled] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [atForm, setAtForm] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 480)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    const form = document.getElementById('register')
    const io = form
      ? new IntersectionObserver(
          (entries) => setAtForm(entries[0]?.isIntersecting ?? false),
          { rootMargin: '0px 0px -45% 0px' },
        )
      : null
    if (form && io) io.observe(form)

    return () => {
      window.removeEventListener('scroll', onScroll)
      io?.disconnect()
    }
  }, [])

  const show = scrolled && !dismissed && !atForm

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ease-emphasized motion-reduce:transition-none sm:hidden ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="m-3 flex items-center gap-2 rounded-2xl border border-gray-200 bg-white/95 p-2 pl-3 shadow-[0_-4px_28px_-10px_rgba(17,24,39,0.3)] backdrop-blur">
        <a
          href="#register"
          className="flex h-12 flex-1 items-center justify-center rounded-xl bg-indigo-600 px-4 text-[15px] font-bold text-white transition active:scale-[0.99]"
        >
          선착순 100명 · 평생 50% 할인 등록
        </a>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="사전등록 바 닫기"
          className="inline-flex h-12 w-10 shrink-0 items-center justify-center rounded-xl text-gray-400 transition hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
