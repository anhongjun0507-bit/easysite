'use client'

import { useRef } from 'react'
import { gsap, useGSAP, SplitText } from '@/lib/letters/gsap'
import { DISPLAY } from '@/content/letters-copy'
import { useLettersEnv } from './LettersShell'

/**
 * 인트로 — 어둠 속에서 제목이 시처럼 한 줄씩 올라온다.
 * 그리고 딱 한 번, 소리를 켤지 묻는다(자동재생 없음, 기본 무음).
 */
export function Intro() {
  const root = useRef<HTMLElement>(null)
  const { ready, reduced, sound, chooseSound } = useLettersEnv()

  useGSAP(
    () => {
      if (!ready || reduced) return
      const splits: SplitText[] = []

      // 프리로더가 걷히는 타이밍(0.9s 대기 + 0.9s 페이드)에 맞춘 지연.
      // ⚠️ 공용 타임라인에 넣지 않는다 — autoSplit 이 폰트 로드 후 다시 쪼갤 때
      //    이미 끝난 타임라인에 tween 이 붙어 영영 재생되지 않는 사고가 난다(줄이 사라짐).
      const DELAY = 1.5

      root.current?.querySelectorAll<HTMLElement>('[data-intro-line]').forEach((el, i) => {
        splits.push(
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'lt-mask-line',
            autoSplit: true,
            onSplit(self) {
              gsap.set(el, { opacity: 1 })
              return gsap.from(self.lines, {
                yPercent: 112,
                duration: 1.35,
                ease: 'power4.out',
                stagger: 0.12,
                delay: DELAY + i * 0.16,
              })
            },
          }),
        )
      })

      gsap.from('[data-intro-sub]', {
        opacity: 0,
        y: 16,
        duration: 1.1,
        ease: 'power3.out',
        delay: DELAY + 0.8,
      })
      gsap.from('[data-intro-ask]', {
        opacity: 0,
        y: 20,
        duration: 1.1,
        ease: 'power3.out',
        delay: DELAY + 1,
      })

      return () => splits.forEach((s) => s.revert())
    },
    { scope: root, dependencies: [ready, reduced] },
  )

  return (
    <section className="lt-intro" ref={root}>
      <h1 className="lt-display lt-intro-title">
        {DISPLAY.introTitle.split('\n').map((line) => (
          <span className="lt-intro-line" data-intro-line key={line}>
            {line}
          </span>
        ))}
      </h1>

      <p className="lt-intro-sub" data-intro-sub>
        {DISPLAY.introSub}
      </p>

      {sound === null && (
        <div className="lt-ask" data-intro-ask>
          <p className="lt-display lt-ask-title">{DISPLAY.soundAsk}</p>
          <div className="lt-ask-actions">
            <button type="button" className="lt-btn lt-btn-primary" onClick={() => chooseSound(true)}>
              소리와 함께
            </button>
            <button type="button" className="lt-btn" onClick={() => chooseSound(false)}>
              소리 없이
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
