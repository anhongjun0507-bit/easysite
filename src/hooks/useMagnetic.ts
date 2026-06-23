'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/**
 * 마그네틱 버튼 — 요소 위에서 커서 방향으로 살짝 끌려오고(offset * strength),
 * 벗어나면 elastic 으로 원위치. transform(x/y)만 애니메이트.
 * 터치(pointer:coarse)·prefers-reduced-motion 에서는 비활성.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.3) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const mx = e.clientX - (r.left + r.width / 2)
      const my = e.clientY - (r.top + r.height / 2)
      xTo(mx * strength)
      yTo(my * strength)
    }
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' })
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      gsap.killTweensOf(el)
    }
  }, [strength])

  return ref
}
