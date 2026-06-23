'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

/**
 * 좌하단 고정 전화 CTA — 50~60대 사장님 친화 fallback (P2-09 / #7).
 * - Hero 화면(첫 600px)에서는 숨김 → Hero 데모 카드·CTA와 겹치지 않게.
 * - 위치 우하단 → 좌하단 변경 (FinalCta의 흰 버튼·텍스트가 가운데, 좌측은 비어있음).
 * - 모바일은 h-10, 데스크탑은 h-12로 절제된 크기.
 */
export function FloatingContact() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <Link
      href="tel:01037825418"
      aria-label="전화로 견적 문의: 010-3782-5418"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-4 left-4 z-30 inline-flex h-10 items-center gap-2 rounded-full bg-gray-900/95 px-3.5 text-[13px] font-semibold text-white shadow-lg shadow-gray-900/20 transition-all duration-300 ease-emphasized hover:bg-gray-800 sm:bottom-6 sm:left-6 sm:h-12 sm:px-5 sm:text-sm ${
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
        className="h-4 w-4 sm:h-5 sm:w-5"
        aria-hidden="true"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
      <span>전화로 문의</span>
    </Link>
  )
}
