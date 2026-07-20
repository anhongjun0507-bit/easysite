'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { gsap, useGSAP, ScrollTrigger } from '@/lib/letters/gsap'
import { DUR_REVEAL, DUR_STAMP, EASE_REVEAL, EASE_STAMP, REVEAL_START } from '@/lib/letters/motion'
import { koDate } from '@/lib/letters/format'
import { playPaper, playStamp } from '@/lib/letters/audio'
import { blurOf, hasReply, type LetterEntry, type LetterImage } from '@/content/letters'
import { Lightbox } from './Lightbox'
import { Postmark } from './svg'
import { ReplyBlock } from './ReplyBlock'
import { useLettersEnv } from './LettersShell'

const KIND_LABEL: Record<LetterEntry['kind'], string> = {
  letter: '도희의 편지',
  diary: '도희의 일기',
}

/** 소인이 매번 똑같은 각도로 찍히면 인쇄물처럼 보인다 — 항목마다 조금씩 다르게(결정적 값) */
const TILT = [-5, 4, -3, 6, -4]

/**
 * 엔트리 루프 — 항목마다 [소인 → 캡쳐 → 답장 → 다음으로 잇는 비행] 이 반복된다.
 *
 * 캡쳐 이미지는 WebGL 이 아니라 HTML(next/image)로 남긴다.
 * 세로로 긴 폰 캡쳐라 카드에서는 상단만 보여 주고(아래를 마스크로 흐린다), 누르면 원본 비율로 연다.
 */
export function LetterTimeline({ entries }: { entries: LetterEntry[] }) {
  const root = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<{ images: LetterImage[]; index: number } | null>(null)
  const { ready, reduced } = useLettersEnv()

  useGSAP(
    () => {
      if (!ready || reduced) return
      const mm = gsap.matchMedia()

      mm.add(
        {
          desktop: '(min-width: 768px) and (pointer: fine)',
          handheld: '(max-width: 767px), (pointer: coarse)',
        },
        (context) => {
          const { desktop } = context.conditions as { desktop: boolean }

          // 1) 카드·본문이 어둠에서 떠오른다 — batch 로 묶어 트리거 콜백을 줄인다
          gsap.set('[data-reveal]', { opacity: 0, y: 40 })
          ScrollTrigger.batch('[data-reveal]', {
            start: REVEAL_START,
            once: true,
            onEnter: (els) =>
              gsap.to(els, {
                opacity: 1,
                y: 0,
                duration: DUR_REVEAL,
                ease: EASE_REVEAL,
                stagger: 0.14,
                onStart: playPaper,
              }),
          })

          // 2) 소인 — 쾅 찍히는 순간만 짧고 단호하게
          gsap.set('[data-stamp]', { opacity: 0, scale: 1.8 })
          ScrollTrigger.batch('[data-stamp]', {
            start: REVEAL_START,
            once: true,
            onEnter: (els) =>
              gsap.to(els, {
                opacity: 1,
                scale: 1,
                duration: DUR_STAMP,
                ease: EASE_STAMP,
                onStart: playStamp,
              }),
          })

          // 3) 카드가 스크롤에 따라 아주 천천히 기운다 — 3D 공간에 떠 있는 느낌
          const cards = gsap.utils.toArray<HTMLElement>('[data-card]')
          cards.forEach((card, i) => {
            gsap.fromTo(
              card,
              { rotateX: 7, z: -70 },
              {
                rotateX: -4,
                z: 0,
                ease: 'none',
                scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1 },
              },
            )
            gsap.to(card, {
              y: i % 2 === 0 ? -26 : -14,
              ease: 'none',
              scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
            })
          })

          // 4) 포인터 틸트 — 데스크톱에서만
          const cleanups: Array<() => void> = []
          if (desktop) {
            cards.forEach((card) => {
              const rx = gsap.quickTo(card, 'rotateX', { duration: 0.7, ease: 'power3' })
              const ry = gsap.quickTo(card, 'rotateY', { duration: 0.7, ease: 'power3' })
              const onMove = (e: PointerEvent) => {
                const r = card.getBoundingClientRect()
                rx((0.5 - (e.clientY - r.top) / r.height) * 6)
                ry(((e.clientX - r.left) / r.width - 0.5) * 10)
              }
              const onLeave = () => {
                rx(0)
                ry(0)
              }
              card.addEventListener('pointermove', onMove)
              card.addEventListener('pointerleave', onLeave)
              cleanups.push(() => {
                card.removeEventListener('pointermove', onMove)
                card.removeEventListener('pointerleave', onLeave)
              })
            })
          }

          // 5) 항목 사이를 잇는 곡선 — 종이비행기가 스크롤에 맞춰 건너간다
          gsap.utils.toArray<SVGSVGElement>('[data-link]').forEach((svg) => {
            const path = svg.querySelector<SVGPathElement>('.lt-link-path')
            const plane = svg.querySelector<SVGGElement>('[data-link-plane]')
            if (!path || !plane) return
            gsap.to(plane, {
              motionPath: { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: true },
              ease: 'none',
              scrollTrigger: { trigger: svg, start: 'top 95%', end: 'bottom 40%', scrub: 0.8 },
            })
          })

          return () => cleanups.forEach((fn) => fn())
        },
      )

      return () => mm.revert()
    },
    { scope: root, dependencies: [ready, reduced] },
  )

  return (
    <div className="lt-timeline" ref={root}>
      {entries.map((entry, i) => (
        <article
          className="lt-entry"
          // id 는 우편함·딥링크(#2026-03-14-letter)의 앵커다
          id={entry.id}
          key={entry.id}
          aria-label={`${koDate(entry.date)} ${KIND_LABEL[entry.kind]}`}
        >
          <header className="lt-entry-head">
            <span className="lt-postmark" data-stamp style={{ rotate: `${TILT[i % TILT.length]}deg` }}>
              <Postmark date={entry.date} className="h-full w-full" />
            </span>
            <div>
              <p className="lt-label">{KIND_LABEL[entry.kind]}</p>
              <p className="lt-date">{koDate(entry.date)}</p>
            </div>
          </header>

          <div className="lt-entry-body">
            <div className="lt-cards">
              {entry.images.map((img, imgIdx) => (
                <button
                  key={img.src}
                  type="button"
                  className="lt-card"
                  data-reveal
                  data-card
                  onClick={() => setOpen({ images: entry.images, index: imgIdx })}
                  aria-label={`${img.alt}. 눌러서 크게 보기`}
                >
                  <span className="lt-card-frame">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={img.width}
                      height={img.height}
                      sizes="(max-width: 768px) 86vw, 460px"
                      placeholder={blurOf(img.src) ? 'blur' : 'empty'}
                      blurDataURL={blurOf(img.src)}
                      quality={80}
                    />
                  </span>
                  <span className="lt-card-hint">눌러서 크게 보기</span>
                </button>
              ))}
            </div>

            {entry.transcript && (
              <p className="lt-hand lt-transcript" data-reveal>
                {entry.transcript}
              </p>
            )}
          </div>

          {entry.reply && hasReply(entry) && <ReplyBlock reply={entry.reply} />}

          {i < entries.length - 1 && (
            <svg data-link className="lt-link" viewBox="0 0 520 130" aria-hidden>
              <path className="lt-link-path" d="M36 14 C 170 138, 350 -6, 484 112" />
              {/* 중첩 <svg> 대신 path 를 직접 둔다 — MotionPath 가 <g> 를 좌표째 옮기기 때문 */}
              <g data-link-plane className="lt-link-plane">
                <path d="M-8 0 8 -4.6 2.2 0 8 4.6Z" />
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
