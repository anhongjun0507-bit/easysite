'use client'

import { ReactLenis, type LenisRef } from 'lenis/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { usePathname, useSelectedLayoutSegments } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
// StrictMode 이중 호출 시 revert 타이밍으로 빈 타겟 경고가 날 수 있어 비활성(무해)
gsap.config({ nullTargetWarn: false })

// 옵션은 모듈 상수로 고정(리렌더마다 새 객체 X)
const LENIS_OPTIONS = {
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  syncTouch: false, // 모바일은 네이티브 스크롤 유지
  autoRaf: false, // RAF 는 GSAP ticker 로 단일화
} as const

/**
 * 전역 스무스 스크롤 — ReactLenis(root) + GSAP ticker 단일 RAF 루프.
 * · lenis.on('scroll', ScrollTrigger.update) 로 ScrollTrigger 동기화
 * · prefers-reduced-motion: reduce → ReactLenis 미적용(네이티브 스크롤)
 *   root 모드는 래퍼 div 를 만들지 않으므로 조건부 렌더해도 DOM/하이드레이션 동일
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)
  const [enabled, setEnabled] = useState(false)
  // 클라 검토용 시안(/hanil)은 전역 스무스스크롤에서 격리 — 네이티브 스크롤 유지.
  // 프라이빗 아카이브(/letters)도 자체 Lenis 인스턴스를 쓰므로 전역에서 제외(이중 적용 방지).
  const segments = useSelectedLayoutSegments()
  const pathname = usePathname()
  const isIsolated = segments[0] === 'hanil' || (pathname?.startsWith('/letters') ?? false)

  useEffect(() => {
    if (isIsolated) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setEnabled(true)
  }, [isIsolated])

  useEffect(() => {
    if (!enabled || isIsolated) return
    const update = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000)
    }
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    const sync = () => ScrollTrigger.update()
    const lenis = lenisRef.current?.lenis
    lenis?.on('scroll', sync)
    // 도구/디버그용 노출(무해)
    ;(window as unknown as { __lenis?: unknown }).__lenis = lenis

    // 레이아웃/폰트/이미지 안정 후 모든 ScrollTrigger 위치 재계산(stale 트리거 방지)
    const refresh = () => ScrollTrigger.refresh()
    const t1 = window.setTimeout(refresh, 400)
    const t2 = window.setTimeout(refresh, 1200)
    window.addEventListener('load', refresh)

    return () => {
      gsap.ticker.remove(update)
      lenis?.off('scroll', sync)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.removeEventListener('load', refresh)
    }
  }, [enabled, isIsolated])

  if (!enabled || isIsolated) return <>{children}</>

  return (
    <ReactLenis root options={LENIS_OPTIONS} ref={lenisRef}>
      {children}
    </ReactLenis>
  )
}
