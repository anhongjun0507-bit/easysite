'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '@/lib/letters/gsap'
import { DISPLAY } from '@/content/letters-copy'
import { useLettersEnv } from './LettersShell'

/**
 * 프리로더 — 로딩 표시가 아니라 첫 씬의 일부다.
 * 어둠에서 한 문장이 떠올랐다가, 준비가 끝나면 그대로 걷힌다.
 * (reduced-motion 이면 아예 렌더하지 않는다)
 */

const MIN_MS = 900 // 문장이 읽힐 최소 시간
const MAX_MS = 4000 // 무슨 일이 있어도 걷힌다

export function Preloader() {
  const { reduced } = useLettersEnv()
  const root = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (reduced) return
    const started = performance.now()
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      const waited = performance.now() - started
      window.setTimeout(() => setDone(true), Math.max(0, MIN_MS - waited))
    }

    const hard = window.setTimeout(finish, MAX_MS)
    Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise<void>((resolve) => {
        if (document.readyState === 'complete') resolve()
        else window.addEventListener('load', () => resolve(), { once: true })
      }),
    ]).then(finish)

    return () => window.clearTimeout(hard)
  }, [reduced])

  // 첫 문장의 등장은 CSS 애니메이션으로 한다.
  // GSAP 로 opacity 0 에서 시작하면 이 문장이 곧 LCP 요소인데 스크립트가 실행될 때까지
  // 화면에 없는 것으로 취급돼 LCP 가 몇 초씩 밀린다. (걷히는 연출만 GSAP)
  useGSAP(
    () => {
      if (!done || !root.current) return
      gsap.to(root.current, {
        opacity: 0,
        duration: 0.9,
        ease: 'power2.inOut',
        onComplete: () => root.current?.setAttribute('hidden', ''),
      })
    },
    { scope: root, dependencies: [done] },
  )

  if (reduced) return null

  return (
    <div className="lt-preloader" ref={root} role="status" aria-live="polite">
      <p className="lt-preloader-line" data-preloader-line>
        {DISPLAY.preloader}
      </p>
    </div>
  )
}
