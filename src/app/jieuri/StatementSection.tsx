'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

const TEXT =
  '디자인, 모션, 개발을 하나로 엮어 — 보는 순간 기억에 남는 디지털 경험을 짓습니다.'

/**
 * 스테이트먼트 — 큰 문장이 스크롤에 따라 단어별로 회색→검정으로 채워진다(scrub).
 * transform/opacity/color 만. reduced-motion: 전체 진한 색으로 즉시 표시(스크럽 없음).
 */
export function StatementSection() {
  const root = useRef<HTMLElement>(null)
  const pRef = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = new SplitText(pRef.current, { type: 'words' })
        gsap.set(split.words, { color: '#d4d4d8' }) // 흐린 회색 시작
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top 72%',
            end: 'bottom 58%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
        tl.to(split.words, { color: '#0a0a0c', stagger: 0.4, ease: 'none', duration: 0.6 })
        return () => split.revert()
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} className="border-t border-gray-100">
      <div className="mx-auto max-w-5xl px-6 py-36 sm:py-52">
        <p className="mb-6 text-[12px] font-semibold uppercase tracking-[0.3em] text-indigo-600">
          What we do
        </p>
        <p
          ref={pRef}
          className="text-[26px] font-extrabold leading-[1.28] tracking-[-0.02em] text-gray-950 sm:text-[clamp(32px,4.4vw,58px)] sm:leading-[1.22]"
        >
          {TEXT}
        </p>
      </div>
    </section>
  )
}
