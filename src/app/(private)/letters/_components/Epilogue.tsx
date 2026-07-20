'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/letters/gsap'
import { EASE_IN_VIEW, REVEAL_START } from '@/lib/letters/motion'

/**
 * 에필로그 — 지금까지 주고받은 통수를 세고, 다음 편지를 위한 여백을 남긴다.
 * (PDF 내보내기 자리는 아직 만들지 않는다 — 아래 주석 참고)
 */
export function Epilogue({ total }: { total: number }) {
  const root = useRef<HTMLElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const el = numRef.current
        if (!el) return
        const counter = { v: 0 }
        gsap.to(counter, {
          v: total,
          duration: 1.6,
          ease: EASE_IN_VIEW,
          snap: { v: 1 },
          onUpdate: () => {
            el.textContent = String(Math.round(counter.v))
          },
          scrollTrigger: { trigger: root.current, start: REVEAL_START, once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section className="lt-section text-center" ref={root}>
      <div className="lt-shell">
        <p className="lt-eyebrow">EPILOGUE</p>
        <p className="mt-10 text-[clamp(64px,14vw,180px)] font-medium leading-none tracking-[-0.05em]">
          <span ref={numRef}>{total}</span>
          <span className="ml-3 align-middle text-[0.18em] tracking-[0.3em] text-[color:var(--ink-40)]">
            통
          </span>
        </p>
        <p className="lt-meta mt-8">여기까지 주고받았다</p>

        <p className="hand mt-24 text-[clamp(26px,4.6vw,44px)] text-[color:var(--ink-60)]">
          다음 편지에 계속
        </p>

        {/* TODO(나중): 전체를 PDF 로 내보내는 버튼 자리 — 지금은 만들지 않는다. */}
        <div className="h-[20vh]" aria-hidden />
      </div>
    </section>
  )
}
