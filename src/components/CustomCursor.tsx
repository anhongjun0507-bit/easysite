'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/**
 * 커스텀 커서 (데스크탑 전용) — 도트 + 따라오는 링(gsap.quickTo, transform만).
 * · a / button / [data-cursor="hover"] 위에서 링 스케일 1 → 2.5 (mix-blend-difference)
 * · pointer:coarse(터치) 또는 prefers-reduced-motion → 비활성, 기본 커서 유지
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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
    const onOver = (e: Event) => {
      if ((e.target as HTMLElement)?.closest?.(HOVER)) {
        gsap.to(ring, { scale: 2.5, duration: 0.3, ease: 'power3' })
      }
    }
    const onOut = (e: Event) => {
      if ((e.target as HTMLElement)?.closest?.(HOVER)) {
        gsap.to(ring, { scale: 1, duration: 0.3, ease: 'power3' })
      }
    }
    document.addEventListener('pointerover', onOver)
    document.addEventListener('pointerout', onOut)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerout', onOut)
      gsap.killTweensOf([dot, ring])
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [])

  return (
    <>
      <div ref={ringRef} aria-hidden className="cursor-ring" />
      <div ref={dotRef} aria-hidden className="cursor-dot" />
    </>
  )
}
