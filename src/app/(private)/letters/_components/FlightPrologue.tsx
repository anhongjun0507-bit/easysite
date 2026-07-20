'use client'

import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger } from '@/lib/letters/gsap'
import { DISPLAY } from '@/content/letters-copy'
import { scrollState } from '@/lib/letters/scroll'
import { useLettersEnv } from './LettersShell'

/**
 * 항로 프롤로그 — 이 구간의 스크롤이 곧 밤하늘 항로의 진행도가 된다.
 *
 * 항로·비행기는 WebGL(RouteArc)이 그리고, 여기서는 그 진행도(scrollState.prologue)와
 * 한 문장만 담당한다. pin 을 쓰지만 스크롤은 계속 먹으므로 어느 지점에서든 빠져나갈 수 있다.
 */
export function FlightPrologue() {
  const root = useRef<HTMLElement>(null)
  const { ready, reduced } = useLettersEnv()

  useGSAP(
    () => {
      if (!ready || reduced) return
      const inner = root.current?.querySelector<HTMLElement>('[data-prologue-inner]')
      if (!root.current || !inner) return

      const st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: '+=170%',
        pin: inner,
        pinSpacing: true,
        scrub: 0.5,
        onUpdate: (self) => {
          scrollState.prologue = self.progress
        },
        onLeave: () => {
          scrollState.prologue = 1
        },
        onLeaveBack: () => {
          scrollState.prologue = 0
        },
      })

      // 문장은 항로가 절반쯤 그어졌을 때 들어오고, 도착 직전에 빠진다
      gsap.fromTo(
        '[data-prologue-copy]',
        { opacity: 0, y: 26, filter: 'blur(10px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=70%',
            scrub: 0.6,
          },
        },
      )

      return () => st.kill()
    },
    { scope: root, dependencies: [ready, reduced] },
  )

  return (
    <section className="lt-prologue" ref={root} aria-label="편지가 지나온 길">
      <div className="lt-prologue-inner" data-prologue-inner>
        <p className="lt-display lt-prologue-copy" data-prologue-copy>
          {DISPLAY.prologue.split('\n').map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
      </div>
    </section>
  )
}
