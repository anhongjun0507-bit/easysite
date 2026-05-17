import Link from 'next/link'

/**
 * 우하단 고정 전화 CTA — 50~60대 사장님 친화 fallback (P2-09).
 * 폼 작성이 어려운 사용자가 1탭에 전화 걸 수 있도록 sticky로 노출.
 */
export function FloatingContact() {
  return (
    <Link
      href="tel:01037825418"
      aria-label="전화로 견적 문의: 010-3782-5418"
      className="fixed bottom-5 right-5 z-30 inline-flex h-12 items-center gap-2 rounded-full bg-gray-900 px-4 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:bg-gray-800 sm:bottom-7 sm:right-7 sm:h-14 sm:px-5 sm:text-[15px]"
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
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
      <span className="hidden sm:inline">전화로 문의</span>
      <span className="sm:hidden">전화</span>
    </Link>
  )
}
