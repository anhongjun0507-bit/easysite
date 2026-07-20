'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger, SplitText } from '@/lib/letters/gsap'
import {
  DUR_PAPER,
  DUR_STAMP,
  EASE_IN_VIEW,
  EASE_STAMP,
  REVEAL_START,
  STAGGER_LINE,
} from '@/lib/letters/motion'
import { blurOf, type LetterEntry, type LetterImage } from '@/content/letters'
import { Lightbox } from './Lightbox'
import { Postmark, Stamp } from './svg'

const KIND_LABEL: Record<LetterEntry['kind'], string> = {
  letter: '도희의 편지',
  diary: '도희의 일기',
}

function koDate(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${y}년 ${Number(m)}월 ${Number(d)}일`
}

/** 소인이 매번 똑같은 각도로 찍히면 인쇄물처럼 보인다 — 항목마다 조금씩 다르게(결정적 값) */
const TILT = [-5, 4, -3, 6, -4]

export function LetterTimeline({ entries }: { entries: LetterEntry[] }) {
  const root = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<{ images: LetterImage[]; index: number } | null>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const splits: SplitText[] = []

        // 1) 종이·본문 등장 — batch 로 묶어 트리거 콜백을 최소화
        gsap.set('[data-reveal]', { opacity: 0, y: 34 })
        ScrollTrigger.batch('[data-reveal]', {
          start: REVEAL_START,
          once: true,
          onEnter: (els) =>
            gsap.to(els, {
              opacity: 1,
              y: 0,
              duration: DUR_PAPER,
              ease: EASE_IN_VIEW,
              stagger: 0.12,
            }),
        })

        // 2) 소인 — 쾅 찍히는 순간만 짧고 단호하게
        gsap.set('[data-stamp]', { opacity: 0, scale: 1.7 })
        ScrollTrigger.batch('[data-stamp]', {
          start: REVEAL_START,
          once: true,
          onEnter: (els) =>
            gsap.to(els, { opacity: 0.85, scale: 1, duration: DUR_STAMP, ease: EASE_STAMP }),
        })

        // 3) 답장 본문 — 지금 쓰이는 것처럼 라인 마스크 스태거.
        //    autoSplit 으로 손글씨 폰트 로드·리사이즈 후 자동 재분할(= await 없이 컨텍스트 안에서 생성)
        root.current?.querySelectorAll<HTMLElement>('[data-reply-body]').forEach((el) => {
          splits.push(
            SplitText.create(el, {
              type: 'lines',
              mask: 'lines',
              linesClass: 'lt-reply-line',
              autoSplit: true,
              onSplit(self) {
                gsap.set(el, { opacity: 1 })
                return gsap.from(self.lines, {
                  yPercent: 108,
                  duration: 0.9,
                  ease: EASE_IN_VIEW,
                  stagger: STAGGER_LINE,
                  scrollTrigger: { trigger: el, start: REVEAL_START, once: true },
                })
              },
            }),
          )
        })

        // 4) 스캔 카드 틸트 — 포인터(데스크탑)
        const tiltCleanups: Array<() => void> = []
        if (window.matchMedia('(pointer: fine)').matches) {
          root.current?.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
            const rx = gsap.quickTo(card, 'rotateX', { duration: 0.6, ease: 'power3' })
            const ry = gsap.quickTo(card, 'rotateY', { duration: 0.6, ease: 'power3' })
            const onMove = (e: PointerEvent) => {
              const r = card.getBoundingClientRect()
              rx((0.5 - (e.clientY - r.top) / r.height) * 7)
              ry(((e.clientX - r.left) / r.width - 0.5) * 9)
            }
            const onLeave = () => {
              rx(0)
              ry(0)
            }
            card.addEventListener('pointermove', onMove)
            card.addEventListener('pointerleave', onLeave)
            tiltCleanups.push(() => {
              card.removeEventListener('pointermove', onMove)
              card.removeEventListener('pointerleave', onLeave)
            })
          })
        }

        // 5) 항목 사이를 잇는 짧은 곡선 — 종이비행기가 스크롤에 맞춰 건너간다
        root.current?.querySelectorAll<SVGSVGElement>('[data-link]').forEach((svg) => {
          const path = svg.querySelector<SVGPathElement>('path.lt-link-path')
          const plane = svg.querySelector<SVGGElement>('[data-link-plane]')
          if (!path || !plane) return
          gsap.to(plane, {
            motionPath: { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: true },
            ease: 'none',
            scrollTrigger: { trigger: svg, start: 'top 92%', end: 'bottom 45%', scrub: 0.8 },
          })
        })

        return () => {
          splits.forEach((s) => s.revert())
          tiltCleanups.forEach((fn) => fn())
        }
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className="lt-shell">
      {entries.map((entry, i) => (
        <article className="lt-entry" key={entry.id}>
          <header className="flex items-start gap-6 md:gap-10">
            <span
              data-stamp
              className="lt-postmark shrink-0"
              style={{ rotate: `${TILT[i % TILT.length]}deg` }}
            >
              <Postmark date={entry.date} className="h-full w-full" />
            </span>
            <div className="pt-6">
              <p className="lt-eyebrow">{KIND_LABEL[entry.kind]}</p>
              <p className="lt-meta mt-3">{koDate(entry.date)}</p>
            </div>
          </header>

          <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
            <div className="space-y-10" style={{ perspective: '1200px' }}>
              {entry.images.map((img, imgIdx) => (
                <button
                  key={img.src}
                  type="button"
                  className="lt-scan"
                  data-reveal
                  data-tilt
                  onClick={() => setOpen({ images: entry.images, index: imgIdx })}
                  aria-label={`${img.alt} — 크게 보기`}
                >
                  <span className="lt-scan-inner block">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={img.width}
                      height={img.height}
                      sizes="(max-width: 768px) 92vw, 560px"
                      placeholder={blurOf(img.src) ? 'blur' : 'empty'}
                      blurDataURL={blurOf(img.src)}
                      priority={i === 0 && imgIdx === 0}
                      quality={78}
                    />
                  </span>
                  <span className="lt-scan-more block text-left">눌러서 크게 보기</span>
                </button>
              ))}
            </div>

            {entry.transcript && (
              <p className="hand lt-transcript md:sticky md:top-28 md:pt-6" data-reveal>
                {entry.transcript}
              </p>
            )}
          </div>

          {entry.reply && (
            <>
              <div className="lt-airmail my-16 md:my-24" />
              <div className="lt-reply ml-auto max-w-[46rem]" data-reveal>
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="lt-eyebrow">나의 답장</p>
                    <p className="lt-meta mt-3">{koDate(entry.reply.date)}</p>
                  </div>
                  <Stamp className="lt-stamp shrink-0" id={`stamp-${entry.id}`} />
                </div>
                <p className="hand lt-reply-body mt-10" data-reply-body>
                  {entry.reply.body}
                </p>
              </div>
            </>
          )}

          {i < entries.length - 1 && (
            <svg
              data-link
              className="mx-auto mt-24 block w-full max-w-[520px]"
              viewBox="0 0 520 120"
              aria-hidden
            >
              <path className="lt-link-path" d="M40 16 C 170 130, 350 -8, 480 104" />
              <g data-link-plane>
                <path d="M-9 0 9 -5 3 0 9 5Z" fill="#1b2a4a" opacity="0.85" />
              </g>
            </svg>
          )}
        </article>
      ))}

      {open && (
        <Lightbox
          images={open.images}
          index={open.index}
          onIndex={(index) => setOpen((s) => (s ? { ...s, index } : s))}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  )
}
