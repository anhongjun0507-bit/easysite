'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { SplitText } from 'gsap/SplitText'
import { useLenis } from 'lenis/react'
import { ArrowRight } from 'lucide-react'
import { useMagnetic } from '@/hooks/useMagnetic'
import { EASE, DUR, DUR_SUB, STAGGER, MAGNET } from '@/lib/motion'

gsap.registerPlugin(useGSAP, SplitText)

/**
 * 히어로 — "Interactive Digital Studio" 리포지셔닝 (Lusion 톤).
 * 라인 마스크 리빌 + 마그네틱 CTA + 미세 배경 패럴랙스. 절제·여백·오버사이즈 타이포.
 * [data-reveal] 요소는 CSS 로 기본 opacity:0(= FOUC/ CLS 없음), reduced-motion 이면 즉시 표시.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null)
  const h1Ref = useRef<HTMLHeadingElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const ctaRef = useMagnetic<HTMLButtonElement>(MAGNET)
  const lenis = useLenis()

  // 입장 리빌 (폰트 로드 후 SplitText) — useGSAP 자동 cleanup
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      // reduced-motion 이면 콜백 미실행 → CSS [data-reveal] 가 즉시 표시
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(['[data-reveal="eyebrow"]', '[data-reveal="sub"]', '[data-reveal="cta"]'], { y: 22 })

        let split: SplitText | null = null
        // 폰트 로드 대기에 400ms 캡 — 느린 망에서도 리빌(=LCP)이 400ms 내 시작. 동적 서브셋이라 평소 더 빠름.
        const run = async () => {
          await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 400))])
          const h1 = h1Ref.current
          if (!h1) return
          split = new SplitText(h1, { type: 'lines', mask: 'lines', linesClass: 'hero-line' })
          gsap.set(h1, { opacity: 1 }) // 라인은 마스크 아래에 숨은 상태라 깜빡임 없음

          const tl = gsap.timeline({ defaults: { ease: EASE }, delay: 0.2 })
          tl.from(split.lines, { yPercent: 100, duration: DUR, stagger: STAGGER })
            .to('[data-reveal="eyebrow"]', { opacity: 1, y: 0, duration: DUR_SUB }, 0.05)
            .to('[data-reveal="sub"]', { opacity: 1, y: 0, duration: DUR_SUB }, '-=0.65')
            .to('[data-reveal="cta"]', { opacity: 1, y: 0, duration: DUR_SUB }, '-=0.75')
            .to('[data-reveal="scroll"]', { opacity: 1, duration: DUR_SUB }, '-=0.35')
        }
        run()

        return () => split?.revert()
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  // 배경 마우스 패럴랙스 ±15px (데스크탑·non-reduced)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        const xTo = gsap.quickTo(bgRef.current, 'x', { duration: 1.2, ease: 'power2' })
        const yTo = gsap.quickTo(bgRef.current, 'y', { duration: 1.2, ease: 'power2' })
        const onMove = (e: MouseEvent) => {
          xTo((e.clientX / window.innerWidth - 0.5) * 30)
          yTo((e.clientY / window.innerHeight - 0.5) * 30)
        }
        window.addEventListener('mousemove', onMove, { passive: true })
        return () => window.removeEventListener('mousemove', onMove)
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  const goToWork = () => {
    if (lenis) lenis.scrollTo('#work', { duration: 1.4 })
    else document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' })
  }

  const goToContact = () => {
    if (lenis) lenis.scrollTo('#contact', { duration: 1.4 })
    else document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={root}
      className="hero-reveal relative isolate flex min-h-[100svh] items-center overflow-hidden bg-[#fafafb]"
    >
      {/* 배경 — 미세 그라디언트 + 노이즈 (거의 느껴질 듯 말 듯), 마우스 패럴랙스 */}
      <div ref={bgRef} aria-hidden className="pointer-events-none absolute inset-[-30px] -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_28%_18%,rgba(99,102,241,0.07),transparent_70%),radial-gradient(48%_46%_at_82%_84%,rgba(124,58,237,0.06),transparent_72%)]" />
        <div className="absolute inset-0 bg-noise opacity-[0.04] mix-blend-soft-light" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 py-28 sm:py-32">
        <p
          data-reveal="eyebrow"
          className="text-[12px] font-semibold uppercase tracking-[0.34em] text-indigo-600 sm:text-[13px]"
        >
          Interactive Digital Studio
        </p>

        <h1
          ref={h1Ref}
          data-reveal="h1"
          className="mt-5 text-[15vw] font-extrabold leading-[0.9] tracking-[-0.05em] text-gray-950 sm:mt-8 sm:text-[clamp(74px,11.5vw,172px)] sm:leading-[0.86]"
        >
          경험을
          <br />
          짓습니다.
        </h1>

        <p
          data-reveal="sub"
          className="mt-8 max-w-xl text-[16px] leading-relaxed text-gray-600 sm:text-[20px]"
        >
          보는 순간 기억에 남는 인터랙티브 웹을 만듭니다 — 디자인부터 모션, 개발까지.
        </p>

        <div data-reveal="cta" className="mt-11 flex flex-wrap items-center gap-3">
          <button
            ref={ctaRef}
            type="button"
            onClick={goToWork}
            data-cursor="hover"
            className="group inline-flex items-center gap-2.5 rounded-full bg-gray-950 px-8 py-4 text-[15px] font-semibold text-white transition-colors duration-300 hover:bg-gray-800 sm:text-[16px]"
          >
            작업 보기
            <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
          </button>
          <button
            type="button"
            onClick={goToContact}
            data-cursor="hover"
            className="group inline-flex items-center gap-2 rounded-full border border-gray-300 px-7 py-4 text-[15px] font-semibold text-gray-900 transition-colors duration-300 hover:border-gray-950 sm:text-[16px]"
          >
            프로젝트 문의
            <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* 스크롤 인디케이터 */}
      <div
        data-reveal="scroll"
        className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.32em] text-gray-400">scroll</span>
        <span aria-hidden className="scroll-bob block h-9 w-px bg-gradient-to-b from-gray-400 to-transparent" />
      </div>
    </section>
  )
}
