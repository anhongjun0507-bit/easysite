'use client'

import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger, SplitText } from '@/lib/letters/gsap'
import { DUR_LINE, EASE_REVEAL, REVEAL_START, STAGGER_LINE } from '@/lib/letters/motion'
import type { LetterReply } from '@/content/letters'
import { koDate } from '@/lib/letters/format'
import { useLettersEnv } from './LettersShell'

/**
 * 내 답장 — 어둠 속에서 한 줄씩, 잉크가 번졌다가 마르듯 드러난다.
 *
 * 라인 마스크(SplitText mask:'lines')로 아래에서 올라오고 동시에 blur 가 풀린다.
 * 두 가지를 겹쳐야 "지금 쓰이는 중"으로 읽힌다.
 */
export function ReplyBlock({ reply }: { reply: LetterReply }) {
  const root = useRef<HTMLDivElement>(null)
  const { ready, reduced } = useLettersEnv()

  useGSAP(
    () => {
      if (!ready || reduced) return
      const el = root.current?.querySelector<HTMLElement>('[data-reply-body]')
      if (!el) return

      // 줄 쪼개기는 강제 레이아웃을 부른다. 편지가 늘어날수록 첫 로드에서 그 비용이 쌓이므로
      // 화면 두 개 앞까지 다가온 항목만 쪼갠다.
      let split: SplitText | null = null
      const arm = ScrollTrigger.create({
        trigger: el,
        start: 'top bottom+=100%',
        once: true,
        onEnter: () => {
          split = SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'lt-mask-line',
            autoSplit: true, // 손글씨 폰트 로드·리사이즈 후 자동 재분할
            onSplit(self) {
              gsap.set(el, { opacity: 1 })
              return gsap.from(self.lines, {
                yPercent: 108,
                filter: 'blur(8px)',
                duration: DUR_LINE,
                ease: EASE_REVEAL,
                stagger: STAGGER_LINE,
                scrollTrigger: { trigger: el, start: REVEAL_START, once: true },
              })
            },
          })
        },
      })

      return () => {
        arm.kill()
        split?.revert()
      }
    },
    { scope: root, dependencies: [ready, reduced] },
  )

  return (
    <div className="lt-reply" ref={root}>
      <p className="lt-label">나의 답장</p>
      <p className="lt-date">{koDate(reply.date)}</p>
      <p className="lt-hand lt-reply-body" data-reply-body>
        {reply.body}
      </p>
    </div>
  )
}
