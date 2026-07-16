'use client'

import { useEffect, useRef } from 'react'
import { useSelectedLayoutSegments } from 'next/navigation'
import { gsap } from 'gsap'
import { EASE_HOVER, DUR_HOVER } from '@/lib/motion'

/**
 * 커스텀 커서 (데스크탑 전용) — 도트 + 따라오는 링(gsap.quickTo, transform만).
 * · a / button / [data-cursor="hover"] → 링 scale 2.5 (mix-blend-difference)
 * · [data-cursor="view"] → 링이 "View" 라벨 디스크로 전환
 * · pointer:coarse(터치) / prefers-reduced-motion → 비활성
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  // 클라 검토용 시안(/hanil)은 전역 커스텀 커서에서 격리 — 네이티브 커서 유지.
  const segments = useSelectedLayoutSegments()
  const isHanil = segments[0] === 'hanil'

  useEffect(() => {
    if (isHanil) return
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dot = dotRef.current
    const ring = ringRef.current
    if (!fine || reduce || !dot || !ring) return

    document.documentElement.classList.add('has-custom-cursor')
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 })

    const xDot = gsap.quickTo(dot, 'x', { duration: 0.18, ease: 'power3' })
    const yDot = gsap.quickTo(dot, 'y', { duration: 0.18, ease: 'power3' })
    const xRing = gsap.quickTo(ring, 'x', { duration: 0.4, ease: 'power3' })
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.4, ease: 'power3' })

    const onMove = (e: PointerEvent) => {
      xDot(e.clientX)
      yDot(e.clientY)
      xRing(e.clientX)
      yRing(e.clientY)
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const HOVER = 'a, button, [data-cursor="hover"]'
    const setScale = (v: number) => gsap.to(ring, { scale: v, duration: DUR_HOVER, ease: EASE_HOVER })

    const onOver = (e: Event) => {
      const t = e.target as HTMLElement
      if (t?.closest?.('[data-cursor="view"]')) {
        ring.classList.add('is-view')
        setScale(1.9)
      } else if (t?.closest?.(HOVER)) {
        setScale(2.5)
      }
    }
    const onOut = (e: Event) => {
      const t = e.target as HTMLElement
      if (t?.closest?.('[data-cursor="view"]')) {
        ring.classList.remove('is-view')
        setScale(1)
      } else if (t?.closest?.(HOVER)) {
        setScale(1)
      }
    }
    document.addEventListener('pointerover', onOver)
    document.addEventListener('pointerout', onOut)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerout', onOut)
      gsap.killTweensOf([dot, ring])
      ring.classList.remove('is-view')
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [isHanil])

  if (isHanil) return null

  return (
    <>
      <div ref={ringRef} aria-hidden className="cursor-ring">
        <span className="cursor-label">View</span>
      </div>
      <div ref={dotRef} aria-hidden className="cursor-dot" />
    </>
  )
}
