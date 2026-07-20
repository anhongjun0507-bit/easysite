'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/letters/gsap'
import { DISPLAY } from '@/content/letters-copy'
import { EASE_REVEAL, REVEAL_START } from '@/lib/letters/motion'
import { useLettersEnv } from './LettersShell'

/**
 * 에필로그 — 숫자 하나와 여백.
 * 주고받은 통수가 올라가고, 마지막 문장 뒤로는 아무것도 두지 않는다.
 */
// TODO: PDF 내보내기(연도별 묶음) 자리 — 실제 캡쳐가 다 모인 뒤에 붙인다.
export function Epilogue({ total }: { total: number }) {
  const root = useRef<HTMLElement>(null)
  const { ready, reduced } = useLettersEnv()

  useGSAP(
    () => {
      const counter = root.current?.querySelector<HTMLElement>('[data-count]')
      if (!ready || !counter) return
      if (reduced) {
        counter.textContent = String(total)
        return
      }

      const value = { n: 0 }
      gsap.to(value, {
        n: total,
        duration: 1.9,
        ease: 'power2.out',
        snap: { n: 1 },
        onUpdate: () => {
          counter.textContent = String(Math.round(value.n))
        },
        scrollTrigger: { trigger: counter, start: REVEAL_START, once: true },
      })

      gsap.from('[data-epilogue-tail]', {
        opacity: 0,
        y: 22,
        duration: 1.2,
        ease: EASE_REVEAL,
        scrollTrigger: { trigger: '[data-epilogue-tail]', start: REVEAL_START, once: true },
      })
    },
    { scope: root, dependencies: [ready, reduced, total] },
  )

  return (
    <section className="lt-epilogue" ref={root}>
      <p className="lt-label">{DISPLAY.epilogueLead}</p>
      <p className="lt-count">
        <span className="lt-display" data-count>
          0
        </span>
        <span className="lt-count-unit">통</span>
      </p>
      <p className="lt-display lt-epilogue-tail" data-epilogue-tail>
        {DISPLAY.epilogueTail}
      </p>
    </section>
  )
}
