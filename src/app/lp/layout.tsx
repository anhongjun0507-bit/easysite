import type { Metadata } from 'next'
import Link from 'next/link'
import { Phone } from 'lucide-react'

// 광고 전용 랜딩 영역 — 자연검색에 색인하지 않는다(자연검색 정본은 홈 / 이 LP는 광고 도착지).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function LpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 슬림 헤더 — 이탈 줄이려 메뉴 없이 로고 + 전화만 */}
      <header className="sticky top-0 z-40 border-b border-gray-200/60 bg-white/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">
            지으리
          </Link>
          <a
            href="tel:01037825418"
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-indigo-600 px-4 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            <Phone className="h-4 w-4" strokeWidth={2.4} />
            전화 문의
          </a>
        </div>
      </header>

      <main className="flex-1 pb-20 sm:pb-0">{children}</main>

      {/* 사업자 정보 푸터 — 개인정보 수집 페이지 신뢰·고지 */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10 text-center">
          <p className="text-base font-extrabold tracking-tight text-gray-900">지으리</p>
          <p className="mt-2 text-[13px] leading-relaxed text-gray-500">
            프리즘 · 대표 안홍준 · 사업자등록번호 672-35-01596
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> · </span>
            <a href="tel:01037825418" className="transition hover:text-gray-700">
              010-3782-5418
            </a>
          </p>
          <p className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-400">
            <Link href="/privacy" className="hover:text-gray-600">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="hover:text-gray-600">
              이용약관
            </Link>
            <Link href="/portfolio" className="hover:text-gray-600">
              제작 사례
            </Link>
          </p>
          <p className="mt-4 text-xs text-gray-400">
            © 2026 지으리. 남겨주신 연락처는 견적·상담 안내 목적으로만 사용합니다.
          </p>
        </div>
      </footer>
    </>
  )
}
