'use client'

import { useRef, useState } from 'react'
import { gsap, useGSAP } from '@/lib/letters/gsap'
import { Stamp } from './svg'

/**
 * 프리로더 — 우표가 "쾅" 찍히듯 인쇄되고 종이가 걷힌다 (약 0.9초).
 * reduced-motion 이면 렌더 자체를 하지 않는다(CSS 에서도 2중 차단).
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null)
  const [gone, setGone] = useState(false)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setGone(true)
        return
      }
      const tl = gsap.timeline({ onComplete: () => setGone(true) })
      tl.fromTo(
        '[data-anim="preload-stamp"]',
        { scale: 1.9, rotate: -14, opacity: 0 },
        { scale: 1, rotate: -6, opacity: 1, duration: 0.42, ease: 'power4.out' },
      )
        .fromTo(
          '[data-anim="preload-ring"]',
          { scale: 0.6, opacity: 0.55 },
          { scale: 1.5, opacity: 0, duration: 0.5, ease: 'power2.out' },
          '<0.04',
        )
        .to('[data-anim="preload-stamp"]', { y: -8, duration: 0.28, ease: 'power2.in' }, '+=0.1')
        .to(root.current, { opacity: 0, duration: 0.34, ease: 'power2.inOut' }, '<0.05')
    },
    { scope: root },
  )

  if (gone) return null

  return (
    <div className="lt-preloader" ref={root} aria-hidden>
      <div className="relative grid place-items-center">
        <span
          data-anim="preload-ring"
          className="absolute h-32 w-32 rounded-full border border-[color:var(--ink-16)]"
        />
        <span data-anim="preload-stamp" className="block">
          <Stamp className="lt-stamp" id="preload" />
        </span>
      </div>
    </div>
  )
}
