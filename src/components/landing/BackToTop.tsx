'use client'

import { useEffect, useState } from 'react'

/**
 * 우하단 "맨 위로 가기" 플로팅 버튼.
 * - 800px 이상 스크롤 시 노출.
 * - 좌하단 FloatingContact(전화)와 좌우 분리 — 겹침 없음.
 * - 화이트 + ring 톤으로 좌하단의 어두운 전화 버튼과 시각 대비.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 800)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="페이지 맨 위로 가기"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-4 right-4 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg ring-1 ring-gray-300 transition-all duration-300 ease-emphasized hover:bg-gray-50 hover:text-gray-900 sm:bottom-6 sm:right-6 sm:h-12 sm:w-12 ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 sm:h-6 sm:w-6"
        aria-hidden="true"
      >
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
    </button>
  )
}
