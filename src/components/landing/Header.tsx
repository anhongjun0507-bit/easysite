'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

// 공용 헤더 — 루트(지으리 랜딩) 포함 모든 페이지에서 사용.
// "견적 받기"(보조)·"사전등록"(메인) 두 행동을 항상 노출. 가격은 메뉴에서 제외(페이지는 유지).
const navLinks = [
  { href: '/service/website', label: '웹사이트 제작' },
  { href: '/service/app', label: '앱 개발' },
  { href: '/portfolio', label: '포트폴리오' },
  { href: '/about', label: '소개' },
]

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // 경로 변경 시 드로어 자동 닫기
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // 드로어 열렸을 때 body 스크롤 잠금 + ESC 닫기
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
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-6 py-4 sm:px-8 sm:py-5">
        <Link
          href="/"
          className="shrink-0 text-lg font-bold tracking-tight text-gray-900 sm:text-xl"
        >
          지으리
        </Link>

        {/* 데스크톱 네비 — 포트폴리오·소개 + 견적 받기(보조)·사전등록(메인) */}
        <div className="hidden items-center gap-1 sm:flex md:gap-1.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
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
            )
          })}
          <Link
            href="/wizard"
            className="ml-1 inline-flex h-11 items-center rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-900 transition hover:border-gray-400 hover:bg-gray-50"
          >
            견적 받기
          </Link>
          <a
            href="/register"
            className="inline-flex h-11 items-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            사전등록
          </a>
        </div>

        {/* 모바일 햄버거 — lucide Menu/X */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md text-gray-700 transition hover:bg-gray-100 sm:hidden"
        >
          {open ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* 모바일 드로어 — 전체 항목 펼침 */}
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
                aria-current={pathname === link.href ? 'page' : undefined}
                className="flex h-14 items-center px-6 text-base font-medium text-gray-800 transition hover:bg-gray-50 active:bg-gray-100"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="flex gap-2 px-6 py-4">
            <Link
              href="/wizard"
              onClick={() => setOpen(false)}
              className="inline-flex h-12 flex-1 items-center justify-center rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              견적 받기
            </Link>
            <a
              href="/register"
              onClick={() => setOpen(false)}
              className="inline-flex h-12 flex-1 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              사전등록
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
