'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const navLinks = [
  { href: '/home#solutions', label: '차별점', match: 'anchor' as const },
  { href: '/home#how-it-works', label: '제작 과정', match: 'anchor' as const },
  { href: '/home#reviews', label: '후기', match: 'anchor' as const },
  { href: '/pricing', label: '가격표', match: 'path' as const },
  { href: '/portfolio', label: '포트폴리오', match: 'path' as const },
  { href: '/about', label: '소개', match: 'path' as const },
]

export function Header() {
  const pathname = usePathname()
  const isResult = pathname?.startsWith('/wizard/result') ?? false
  const ctaLabel = isResult ? '다시 견적 받기' : '1분 만에 견적 받기'
  const [open, setOpen] = useState(false)

  // 경로 변경 시 자동 닫기 (앵커 이동 포함)
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // 드로어 열렸을 때 body 스크롤 잠금 + ESC로 닫기
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/60 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-6 py-4 sm:gap-4 sm:px-8 sm:py-5">
        <Link
          href="/"
          className="shrink-0 text-lg font-bold tracking-tight text-gray-900 sm:text-xl"
        >
          지으리
        </Link>

        <ul className="hidden items-center gap-2 sm:flex md:gap-3">
          {navLinks.map((link) => {
            const isActive =
              link.match === 'path' ? pathname === link.href : false
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`inline-flex h-11 items-center rounded-md px-3 text-sm font-medium transition ${
                    isActive
                      ? 'text-gray-900 underline decoration-indigo-500 decoration-2 underline-offset-[6px]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          {/* 모바일 햄버거 — sm 이하에서만 노출 */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-gray-700 transition hover:bg-gray-100 sm:hidden"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              {open ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>

          {/* CTA — 모바일 h-11(44px), sm h-12(48px) — WCAG 2.5.5 / iOS HIG 44pt */}
          <Link
            href="/wizard"
            className="inline-flex h-11 shrink-0 items-center rounded-lg bg-gray-900 px-3.5 text-[13px] font-semibold text-white transition hover:bg-gray-700 sm:h-12 sm:px-5 sm:text-[15px]"
          >
            {ctaLabel}
          </Link>
        </div>
      </nav>

      {/* 모바일 드로어 — header 바로 아래로 슬라이드 다운 */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`absolute inset-x-0 top-full overflow-hidden border-b border-gray-200 bg-white shadow-lg transition-all duration-300 ease-out sm:hidden ${
          open
            ? 'max-h-96 opacity-100'
            : 'pointer-events-none max-h-0 opacity-0'
        }`}
      >
        <ul className="divide-y divide-gray-100">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex h-14 items-center px-6 text-base font-medium text-gray-800 transition hover:bg-gray-50 active:bg-gray-100"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
