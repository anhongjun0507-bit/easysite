'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { COMPANY, PROCESSES, makeNav } from '../_content'

type Variant = 'a' | 'b' | 'c'

/** 시안별 헤더 톤 — 구조는 공유, 팔레트만 분기(Tailwind 정적 클래스 유지). */
const V: Record<
  Variant,
  {
    topText: string
    solidShell: string
    solidText: string
    logoTop: string
    logoSolid: string
    ctaTop: string
    ctaSolid: string
    mega: string
    megaCode: string
    megaItem: string
    megaHead: string
    mobilePanel: string
    mobileItem: string
    accent: string
    underlineTop: string
    underlineSolid: string
  }
> = {
  a: {
    topText: 'text-white/85',
    solidShell: 'bg-[#0B1B33]/92 backdrop-blur border-b border-white/10',
    solidText: 'text-neutral-200',
    logoTop: 'text-white',
    logoSolid: 'text-white',
    ctaTop: 'border border-white/30 text-white hover:bg-white/10',
    ctaSolid: 'bg-[#6f8bb3] text-[#0B1B33] hover:bg-[#8fb0da]',
    mega: 'bg-[#0c1f3a] border-t border-white/10',
    megaCode: 'text-[#8fb0da]',
    megaItem: 'text-neutral-300 hover:bg-white/5 hover:text-white',
    megaHead: 'text-white/50',
    mobilePanel: 'bg-[#0B1B33] text-white',
    mobileItem: 'text-white/85',
    accent: 'text-[#8fb0da]',
    underlineTop: 'bg-white',
    underlineSolid: 'bg-[#8fb0da]',
  },
  b: {
    topText: 'text-white/90',
    solidShell: 'bg-white/92 backdrop-blur border-b border-neutral-200',
    solidText: 'text-neutral-600',
    logoTop: 'text-white',
    logoSolid: 'text-[#12233d]',
    ctaTop: 'border border-white/60 text-white hover:bg-white/10',
    ctaSolid: 'bg-[#1e3a63] text-white hover:bg-[#16304f]',
    mega: 'bg-white border-t border-neutral-200 shadow-[0_24px_48px_-24px_rgba(15,30,55,0.35)]',
    megaCode: 'text-[#1e3a63]',
    megaItem: 'text-neutral-600 hover:bg-neutral-50 hover:text-[#1e3a63]',
    megaHead: 'text-neutral-400',
    mobilePanel: 'bg-white text-neutral-900',
    mobileItem: 'text-neutral-700',
    accent: 'text-[#1e3a63]',
    underlineTop: 'bg-white',
    underlineSolid: 'bg-[#1e3a63]',
  },
  c: {
    topText: 'text-white/85',
    solidShell: 'bg-white/94 backdrop-blur border-b border-neutral-200',
    solidText: 'text-neutral-700',
    logoTop: 'text-white',
    logoSolid: 'text-neutral-900',
    ctaTop: 'border border-white/40 text-white hover:bg-white/10',
    ctaSolid: 'bg-[#6B1F2E] text-white hover:bg-[#571825]',
    mega: 'bg-[#6B1F2E] border-t border-[#6B1F2E]',
    megaCode: 'text-[#e6b8bf]',
    megaItem: 'text-white/75 hover:bg-white/10 hover:text-white',
    megaHead: 'text-white/45',
    mobilePanel: 'bg-neutral-950 text-white',
    mobileItem: 'text-white/85',
    accent: 'text-[#6B1F2E]',
    underlineTop: 'bg-white',
    underlineSolid: 'bg-[#6B1F2E]',
  },
}

export function SiteHeader({ variant, base }: { variant: Variant; base: string }) {
  const t = V[variant]
  const nav = makeNav(base)
  const [scrolled, setScrolled] = useState(false)
  const [mega, setMega] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [mobileProduct, setMobileProduct] = useState(false)

  // 상단/스크롤 상태 토글(불리언 1회 전환만 — 연속값 애니메이션 아님)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 모바일 메뉴 열림 시 배경 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobile])

  const solid = scrolled || mega
  const productHref = (code: string) => (code === 'ISONITE TF1' ? `${base}/isonite-tf1` : '#')

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${solid ? t.solidShell : 'bg-transparent'}`}
      onMouseLeave={() => setMega(false)}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:h-[88px]">
        {/* 로고 */}
        <Link href={base} className="flex flex-col leading-none" onMouseEnter={() => setMega(false)}>
          <span className={`text-[20px] font-extrabold tracking-tight sm:text-[22px] ${solid ? t.logoSolid : t.logoTop}`}>
            {COMPANY.nameKo}
          </span>
          <span
            className={`mt-0.5 text-[9px] font-medium tracking-[0.18em] ${solid ? t.solidText : t.topText} opacity-70`}
          >
            {COMPANY.nameEn}
          </span>
        </Link>

        {/* 데스크톱 네비 — hover 시 언더라인 scaleX(전 시안 통일 이징) */}
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const cls = `group relative px-4 py-2 text-[15px] font-semibold tracking-wide transition-colors ${solid ? t.solidText : t.topText} ${solid ? 'hover:opacity-100' : 'hover:text-white'}`
            const underline = (
              <span
                className={`pointer-events-none absolute inset-x-4 bottom-1.5 h-[2px] origin-left scale-x-0 transition-transform duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 ${solid ? t.underlineSolid : t.underlineTop}`}
                aria-hidden
              />
            )
            return item.hasMega ? (
              <button
                key={item.label}
                type="button"
                onMouseEnter={() => setMega(true)}
                onFocus={() => setMega(true)}
                aria-expanded={mega}
                className={cls}
              >
                {item.label}
                {underline}
              </button>
            ) : (
              <Link key={item.label} href={item.href} onMouseEnter={() => setMega(false)} className={cls}>
                {item.label}
                {underline}
              </Link>
            )
          })}
          <a
            href={COMPANY.telHref}
            className={`ml-3 inline-flex h-10 items-center rounded px-4 text-[13px] font-bold tracking-wide transition-colors ${solid ? t.ctaSolid : t.ctaTop}`}
          >
            {COMPANY.tel}
          </a>
        </nav>

        {/* 모바일 햄버거 */}
        <button
          type="button"
          className="lg:hidden"
          aria-label="메뉴 열기"
          aria-expanded={mobile}
          onClick={() => setMobile(true)}
        >
          <span className="flex h-10 w-10 flex-col items-center justify-center gap-[5px]">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`block h-[2px] w-6 ${solid ? (variant === 'a' ? 'bg-white' : 'bg-neutral-900') : 'bg-white'}`} />
            ))}
          </span>
        </button>
      </div>

      {/* PRODUCT 메가메뉴 (데스크톱) */}
      <div
        className={`absolute inset-x-0 top-full hidden origin-top overflow-hidden transition-[max-height,opacity] duration-300 lg:block ${mega ? 'max-h-[620px] opacity-100' : 'pointer-events-none max-h-0 opacity-0'} ${t.mega}`}
        onMouseEnter={() => setMega(true)}
      >
        <div className="mx-auto max-w-7xl px-8 py-9">
          <p className={`mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] ${t.megaHead}`}>
            PRODUCT · 표면처리 공정 12
          </p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-0.5 md:grid-cols-3 xl:grid-cols-4">
            {PROCESSES.map((p, idx) => (
              <li key={p.code}>
                <Link
                  href={productHref(p.code)}
                  onClick={() => setMega(false)}
                  className={`group flex flex-col rounded px-3 py-2.5 transition-colors ${t.megaItem}`}
                >
                  <span className="flex items-baseline gap-2">
                    <span className={`text-[11px] font-bold tabular-nums ${t.megaCode}`}>{String(idx + 1).padStart(2, '0')}</span>
                    <span className="text-[14px] font-bold">{p.name}</span>
                  </span>
                  {p.en ? (
                    <span className="mt-0.5 pl-[26px] text-[10.5px] font-medium uppercase tracking-[0.12em] opacity-55">{p.en}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 모바일 풀스크린 메뉴 */}
      {mobile ? (
        <div className={`fixed inset-0 z-[60] flex flex-col ${t.mobilePanel} lg:hidden`}>
          <div className="flex h-[72px] items-center justify-between px-5">
            <span className="text-[20px] font-extrabold tracking-tight">{COMPANY.nameKo}</span>
            <button type="button" aria-label="메뉴 닫기" onClick={() => setMobile(false)} className="flex h-10 w-10 items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-5 py-4">
            {nav.map((item) =>
              item.hasMega ? (
                <div key={item.label} className="border-b border-current/10">
                  <button
                    type="button"
                    onClick={() => setMobileProduct((v) => !v)}
                    aria-expanded={mobileProduct}
                    className={`flex w-full items-center justify-between py-4 text-lg font-bold ${t.mobileItem}`}
                  >
                    {item.label}
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden
                      className={`transition-transform ${mobileProduct ? 'rotate-180' : ''}`}
                    >
                      <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div className={`grid overflow-hidden transition-all ${mobileProduct ? 'max-h-[720px] pb-3' : 'max-h-0'}`}>
                    <ul>
                      {PROCESSES.map((p) => (
                        <li key={p.code}>
                          <Link
                            href={productHref(p.code)}
                            onClick={() => setMobile(false)}
                            className={`block py-2.5 pl-3 text-[15px] font-medium opacity-80`}
                          >
                            {p.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobile(false)}
                  className={`block border-b border-current/10 py-4 text-lg font-bold ${t.mobileItem}`}
                >
                  {item.label}
                </Link>
              ),
            )}
            <a
              href={COMPANY.telHref}
              className={`mt-6 flex h-12 items-center justify-center rounded text-sm font-bold ${t.ctaSolid}`}
            >
              전화 문의 {COMPANY.tel}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
