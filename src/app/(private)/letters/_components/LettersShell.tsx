'use client'

import { ReactLenis, type LenisRef } from 'lenis/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { gsap, ScrollTrigger } from '@/lib/letters/gsap'

// 전역 SmoothScrollProvider 는 /letters 를 제외하므로 여기가 이 페이지의 유일한 Lenis 다.
const LENIS_OPTIONS = {
  duration: 1.15,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  syncTouch: true, // 모바일도 같은 관성으로 — 편지 넘기는 호흡을 맞춘다
  syncTouchLerp: 0.09,
  autoRaf: false, // RAF 는 GSAP ticker 하나로 단일화
} as const

/**
 * 이 페이지의 스크롤 엔진 + 그레인 오버레이.
 * · reduced-motion 이면 Lenis 미적용(네이티브 스크롤)
 * · 폰트·이미지 로드 후 ScrollTrigger.refresh() → 트리거 위치 어긋남 방지
 */
export function LettersShell({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)
  const [smooth, setSmooth] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setSmooth(true)
  }, [])

  useEffect(() => {
    if (!smooth) return
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    const sync = () => ScrollTrigger.update()
    const lenis = lenisRef.current?.lenis
    lenis?.on('scroll', sync)
    // 스크린샷·디버그용 노출(무해) — 사이트 전역 provider 와 동일한 관행
    ;(window as unknown as { __lenis?: unknown }).__lenis = lenis
    return () => {
      gsap.ticker.remove(update)
      lenis?.off('scroll', sync)
    }
  }, [smooth])

  // 폰트(손글씨 woff2)·스캔 이미지가 들어오면 레이아웃 높이가 바뀐다 → 한 번 재계산
  useEffect(() => {
    let done = false
    const refresh = () => {
      if (done) return
      done = true
      ScrollTrigger.refresh()
    }
    const t = window.setTimeout(refresh, 2500) // 최후 보루
    Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise<void>((r) => {
        if (document.readyState === 'complete') r()
        else window.addEventListener('load', () => r(), { once: true })
      }),
    ]).then(refresh)
    return () => window.clearTimeout(t)
  }, [])

  const body = (
    <>
      <div className="lt-grain" aria-hidden />
      {children}
    </>
  )

  if (!smooth) return body

  return (
    <ReactLenis root options={LENIS_OPTIONS} ref={lenisRef}>
      {body}
    </ReactLenis>
  )
}
