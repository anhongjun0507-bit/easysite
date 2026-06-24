'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { ArrowUpRight } from 'lucide-react'
import { EASE, DUR, DUR_SUB, STAGGER, REVEAL_START } from '@/lib/motion'
import { ContactForm } from './ContactForm'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

/**
 * 컨택 (#contact) — 다크 클로징 모먼트. 헤드라인 마스크 리빌 + 자격검증 폼 임베드.
 * 전화 only 였던 CTA 를 프로젝트 문의 폼(ContactForm)으로 교체, 전화는 대체 연락으로 병기.
 * 폼 필드는 [data-c-reveal] 로 같은 리빌 타임라인을 타고 staggered fade-up 된다.
 * reduced-motion: 정적 표시(리빌 없음).
 */
export function ContactSection() {
  const root = useRef<HTMLElement>(null)
  const hRef = useRef<HTMLHeadingElement>(null)

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
      <div className="mx-auto max-w-6xl px-6 py-28 sm:py-36">
        <p data-c-reveal className="text-[12px] font-semibold uppercase tracking-[0.3em] text-indigo-400">
          Let’s work together
        </p>
        <h2
          ref={hRef}
          className="mt-6 text-[12vw] font-extrabold leading-[0.95] tracking-[-0.04em] sm:text-[clamp(44px,6vw,92px)] sm:leading-[0.92]"
        >
          다음 프로젝트,
          <br />
          같이 만들어요.
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-[0.82fr_1.18fr]">
          {/* 좌: 안내 + 대체 연락(전화 병기) */}
          <div className="lg:pt-2">
            <p data-c-reveal className="max-w-sm text-[17px] leading-relaxed text-white/65 sm:text-[18px]">
              구상 중인 프로젝트를 들려주세요. 예산·일정만 알려주시면, 영업일 24시간 안에
              안홍준 대표가 직접 검토해 연락드립니다.
            </p>

            <div data-c-reveal className="mt-9">
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/35">
                전화가 편하시면
              </p>
              <a
                href="tel:01037825418"
                data-cursor="hover"
                className="group mt-2 inline-flex items-center gap-2 text-[22px] font-bold tracking-tight text-white transition-colors hover:text-white/80 sm:text-[26px]"
              >
                010-3782-5418
                <ArrowUpRight className="h-5 w-5 text-white/50 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <p className="mt-3 text-sm text-white/40">
                프리즘 · 대표 안홍준 · 사업자등록번호 672-35-01596
              </p>
            </div>
          </div>

          {/* 우: 자격검증 폼 (검증된 leads + 텔레그램 백엔드 재사용) */}
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
