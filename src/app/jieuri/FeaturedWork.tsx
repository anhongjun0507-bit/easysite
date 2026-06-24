'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { ArrowUpRight } from 'lucide-react'
import { caseStudies } from '@/config/portfolio'
import { EASE, DUR, DUR_SUB, STAGGER, REVEAL_START } from '@/lib/motion'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

// 강한 3개로 큐레이션된 케이스(SELLFIT·PS Company·프리즘 입시). config/portfolio 의 caseStudies 참조.
const WORKS = caseStudies

/**
 * 케이스 스터디 (#work) — Lusion 톤. 실제 운영 사이트(config/portfolio) 재사용.
 * 3레이어: .case-media(clip-path 리빌) > .case-media-inner(scale+yPercent 패럴랙스) > img.
 * 제목 SplitText 마스크 / 메타 stagger / hover 이미지 스케일 + "View" 커서.
 * reduced-motion: 전부 비활성(정적, clip-path 풀린 상태). 패럴랙스는 데스크탑만(perf).
 */
export function FeaturedWork() {
  const root = useRef<HTMLElement>(null)
  const [fontsReady, setFontsReady] = useState(false)

  useEffect(() => {
    let alive = true
    document.fonts.ready.then(() => alive && setFontsReady(true))
    return () => {
      alive = false
    }
  }, [])

  useGSAP(
    () => {
      if (!fontsReady) return
      ScrollTrigger.saveStyles('.case-media, .case-media-inner, .case-title, .case-meta-item, .case-head')

      const mm = gsap.matchMedia()
      mm.add(
        {
          isDesktop: '(min-width: 768px)',
          reduce: '(prefers-reduced-motion: reduce)',
        },
        (ctx) => {
          const { isDesktop, reduce } = ctx.conditions as { isDesktop: boolean; reduce: boolean }
          if (reduce) return // 정적 — CSS 기본(clip-path none, opacity 1)

          const splits: SplitText[] = []

          // 섹션 헤더 리빌
          const head = root.current?.querySelector('.case-head')
          if (head) {
            gsap.from(head.children, {
              y: 26,
              opacity: 0,
              duration: DUR_SUB,
              stagger: STAGGER,
              ease: EASE,
              scrollTrigger: { trigger: head, start: REVEAL_START, once: true },
            })
          }

          gsap.utils.toArray<HTMLElement>('.case').forEach((caseEl) => {
            const media = caseEl.querySelector('.case-media')
            const inner = caseEl.querySelector('.case-media-inner')
            const title = caseEl.querySelector('.case-title')
            const metaItems = caseEl.querySelectorAll('.case-meta-item')

            const tl = gsap.timeline({
              scrollTrigger: { trigger: caseEl, start: REVEAL_START, once: true },
            })
            // (1) clip-path 리빌 — 아래→위
            tl.fromTo(
              media,
              { clipPath: 'inset(0 0 100% 0)' },
              { clipPath: 'inset(0 0 0% 0)', duration: DUR, ease: EASE },
            )
            // (2) 제목 마스크 리빌
            if (title) {
              const split = new SplitText(title, { type: 'lines', mask: 'lines' })
              splits.push(split)
              tl.from(split.lines, { yPercent: 100, duration: DUR, stagger: STAGGER, ease: EASE }, 0.15)
            }
            // (3) 메타 stagger
            tl.from(metaItems, { y: 24, opacity: 0, duration: DUR_SUB, stagger: STAGGER, ease: EASE }, 0.25)

            // (4) 연속 패럴랙스 (데스크탑만)
            if (isDesktop && inner) {
              gsap.fromTo(
                inner,
                { yPercent: 12 },
                {
                  yPercent: -12,
                  ease: 'none',
                  scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: true },
                },
              )
            }
          })

          return () => splits.forEach((s) => s.revert())
        },
      )

      return () => mm.revert()
    },
    { scope: root, dependencies: [fontsReady] },
  )

  return (
    <section ref={root} id="work" className="scroll-mt-24 border-t border-gray-100">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <div className="case-head max-w-2xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-indigo-600">
            Selected Work
          </p>
          <h2 className="mt-4 text-[34px] font-extrabold leading-[1.02] tracking-[-0.035em] text-gray-950 sm:text-[clamp(40px,5vw,68px)]">
            결과로 증명합니다.
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-gray-500 sm:text-[18px]">
            실제로 만들어 운영 중인 사이트들이에요.
          </p>
        </div>

        <div className="mt-20 space-y-28 sm:mt-28 sm:space-y-40">
          {WORKS.map((w, i) => {
            const flipped = i % 2 === 1
            return (
              <article key={w.id} className="case grid items-center gap-8 sm:gap-14 lg:grid-cols-2">
                {/* 미디어 */}
                <a
                  href={w.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="view"
                  aria-label={`${w.name} — 사이트 보기 (새 창)`}
                  className={`group block ${flipped ? 'lg:order-2' : ''}`}
                >
                  <div className="case-media relative aspect-[16/11] overflow-hidden rounded-[20px] bg-gray-100 shadow-[0_40px_80px_-50px_rgba(15,15,35,0.55)]">
                    <div
                      className="case-media-inner absolute inset-0 will-change-transform"
                      style={{ transform: 'scale(1.18)' }}
                    >
                      <Image
                        src={w.image}
                        alt={w.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 50vw, 92vw"
                        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                      />
                    </div>
                  </div>
                </a>

                {/* 메타 */}
                <div className={flipped ? 'lg:order-1 lg:pr-10' : 'lg:pl-10'}>
                  <span className="case-meta-item block text-[13px] font-bold tabular-nums tracking-widest text-gray-400">
                    {String(i + 1).padStart(2, '0')} <span className="text-gray-300">/ {String(WORKS.length).padStart(2, '0')}</span>
                  </span>
                  <h3 className="case-title mt-3 text-[28px] font-extrabold leading-[1.05] tracking-[-0.02em] text-gray-950 sm:text-[36px]">
                    {w.name}
                  </h3>
                  <p className="case-meta-item mt-4 max-w-md text-[15px] leading-relaxed text-gray-600 sm:text-[16px]">
                    {w.description}
                  </p>
                  <div className="case-meta-item mt-6 flex items-center gap-4">
                    <span className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1.5 text-[12px] font-semibold text-gray-700">
                      {w.category}
                    </span>
                    <a
                      href={w.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="hover"
                      className="group/v inline-flex items-center gap-1.5 text-[14px] font-bold text-gray-950"
                    >
                      View
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover/v:-translate-y-0.5 group-hover/v:translate-x-0.5" />
                    </a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
