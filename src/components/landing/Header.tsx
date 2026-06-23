'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Menu, X } from 'lucide-react'
import { useLenis } from 'lenis/react'
import { useMagnetic } from '@/hooks/useMagnetic'

/**
 * 스튜디오 네비 — 로고 + Work + 프로젝트 문의(마그네틱).
 * · 스크롤 시 투명 → 반투명 흰색(blur 금지, 색만) + 높이 축소
 * · 내부 이동은 홈에서 Lenis 스크롤, 타 페이지에선 /#앵커로 이동
 * · 모바일: 풀스크린 오버레이(포커스 트랩 + Esc + 스크롤 락)
 */
const LINKS = [
  { hash: '#work', label: 'Work' },
  { hash: '#contact', label: '프로젝트 문의' },
]

export function Header() {
  const pathname = usePathname()
  const lenis = useLenis()
  const isHome = pathname === '/'
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const contactRef = useMagnetic<HTMLAnchorElement>(0.4)
  const overlayRef = useRef<HTMLDivElement>(null)

  // 경로 변경 시 닫기
  useEffect(() => setOpen(false), [pathname])

  // 스크롤 80px 후 배경 등장
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 오버레이: 스크롤 락 + Esc + 포커스 트랩
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusables = () =>
      Array.from(overlayRef.current?.querySelectorAll<HTMLElement>('a, button') ?? [])
    focusables()[0]?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return setOpen(false)
      if (e.key !== 'Tab') return
      const f = focusables()
      if (f.length === 0) return
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  function go(hash: string) {
    return (e: MouseEvent) => {
      setOpen(false)
      if (isHome && lenis) {
        e.preventDefault()
        lenis.scrollTo(hash, { duration: 1.4, offset: -10 })
      }
    }
  }

  return (
    <>
      <header
        className={`${isHome ? 'fixed' : 'sticky'} inset-x-0 top-0 z-40 transition-[background-color,padding] duration-300 ease-out ${
          scrolled || open
            ? 'border-b border-gray-200/70 bg-white/85 py-3'
            : 'border-b border-transparent py-5'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 sm:px-8">
          <Link
            href="/"
            data-cursor="hover"
            className="shrink-0 text-lg font-extrabold tracking-tight text-gray-950 sm:text-xl"
          >
            지으리
          </Link>

          {/* 데스크탑 */}
          <div className="hidden items-center gap-7 sm:flex">
            <a
              href={`/${LINKS[0].hash}`}
              onClick={go(LINKS[0].hash)}
              data-cursor="hover"
              className="text-[14px] font-semibold text-gray-700 transition-colors hover:text-gray-950"
            >
              {LINKS[0].label}
            </a>
            <a
              ref={contactRef}
              href={`/${LINKS[1].hash}`}
              onClick={go(LINKS[1].hash)}
              data-cursor="hover"
              className="inline-flex items-center rounded-full bg-gray-950 px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-gray-800"
            >
              {LINKS[1].label}
            </a>
          </div>

          {/* 모바일 햄버거 */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md text-gray-900 sm:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </header>

      {/* 모바일 풀스크린 오버레이 */}
      <div
        id="mobile-menu"
        ref={overlayRef}
        aria-hidden={!open}
        className={`fixed inset-0 z-50 flex flex-col bg-white transition-opacity duration-300 sm:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <span className="text-lg font-extrabold tracking-tight text-gray-950">지으리</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="메뉴 닫기"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md text-gray-900"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col justify-center gap-2 px-8">
          {LINKS.map((l) => (
            <a
              key={l.hash}
              href={`/${l.hash}`}
              onClick={go(l.hash)}
              className="py-3 text-[40px] font-extrabold tracking-[-0.03em] text-gray-950"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  )
}
