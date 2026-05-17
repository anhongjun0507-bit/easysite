'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/#solutions', label: '차별점', match: 'anchor' as const },
  { href: '/#how-it-works', label: '제작 과정', match: 'anchor' as const },
  { href: '/portfolio', label: '포트폴리오', match: 'path' as const },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/60 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 sm:px-8 sm:py-5">
        <Link
          href="/"
          className="shrink-0 text-lg font-bold tracking-tight text-gray-900 sm:text-xl"
        >
          EasySite
        </Link>

        <ul className="hidden items-center gap-6 sm:flex md:gap-7">
          {navLinks.map((link) => {
            const isActive =
              link.match === 'path' ? pathname === link.href : false
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`text-sm font-medium transition ${
                    isActive
                      ? 'text-gray-900 underline decoration-indigo-500 decoration-2 underline-offset-[6px]'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* CTA 텍스트 통일: "1분 만에 견적 받기" (P1-11) */}
        <Link
          href="/wizard"
          className="shrink-0 rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 sm:px-4 sm:text-[15px]"
        >
          1분 만에 견적 받기
        </Link>
      </nav>
    </header>
  )
}
