'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { ArrowUpRight } from 'lucide-react'
import { useMagnetic } from '@/hooks/useMagnetic'
import { EASE, DUR, DUR_SUB, STAGGER, REVEAL_START, MAGNET } from '@/lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

/**
 * 컨택 (#contact) — 다크 클로징 모먼트. 헤드라인 마스크 리빌 + 마그네틱 CTA + 사업자 정보.
 * reduced-motion: 정적 표시(리빌 없음).
 */
export function ContactSection() {
  const root = useRef<HTMLElement>(null)
  const hRef = useRef<HTMLHeadingElement>(null)
  const ctaRef = useMagnetic<HTMLAnchorElement>(MAGNET)

  useGSAP(
    () => {
      ScrollTrigger.saveStyles('[data-c-reveal]')
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        let split: SplitText | null = null
        const run = async () => {
          await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 400))])
          if (!hRef.current || !root.current) return
          split = new SplitText(hRef.current, { type: 'lines', mask: 'lines' })
          // 초기 숨김 후, 트리거 진입 시 gsap.to 를 명령형으로 재생(ScrollTrigger 진행도와 분리 → stall 회피)
          gsap.set(split.lines, { yPercent: 100 })
          gsap.set('[data-c-reveal]', { opacity: 0, y: 24 })
          ScrollTrigger.create({
            trigger: root.current,
            start: REVEAL_START,
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => {
              gsap.to(split!.lines, { yPercent: 0, duration: DUR, stagger: STAGGER, ease: EASE })
              gsap.to('[data-c-reveal]', { opacity: 1, y: 0, duration: DUR_SUB, stagger: STAGGER, ease: EASE, delay: 0.15 })
            },
          })
        }
        run()
        return () => split?.revert()
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      id="contact"
      className="scroll-mt-24 bg-gray-950 text-white"
      aria-label="프로젝트 문의"
    >
      <div className="mx-auto max-w-6xl px-6 py-28 sm:py-40">
        <p data-c-reveal className="text-[12px] font-semibold uppercase tracking-[0.3em] text-indigo-400">
          Let’s work together
        </p>
        <h2
          ref={hRef}
          className="mt-6 text-[12vw] font-extrabold leading-[0.95] tracking-[-0.04em] sm:text-[clamp(48px,7vw,104px)] sm:leading-[0.92]"
        >
          다음 프로젝트,
          <br />
          같이 만들어요.
        </h2>

        <div data-c-reveal className="mt-12">
          <a
            ref={ctaRef}
            href="tel:01037825418"
            data-cursor="hover"
            className="group inline-flex items-center gap-3 rounded-full bg-white px-9 py-5 text-[17px] font-bold text-gray-950 transition-colors duration-300 hover:bg-gray-200 sm:text-[19px]"
          >
            프로젝트 문의
            <ArrowUpRight className="h-5 w-5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  )
}
