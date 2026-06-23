'use client'

import { ReactLenis, type LenisRef } from 'lenis/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return
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
    return () => {
      gsap.ticker.remove(update)
      lenis?.off('scroll', sync)
    }
  }, [enabled])

  if (!enabled) return <>{children}</>

  return (
    <ReactLenis root options={LENIS_OPTIONS} ref={lenisRef}>
      {children}
    </ReactLenis>
  )
}
