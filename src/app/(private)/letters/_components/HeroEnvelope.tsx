'use client'

import { useRef } from 'react'
import { gsap, useGSAP, SplitText } from '@/lib/letters/gsap'
import { WaxSeal } from './svg'

/**
 * 히어로 — 닫힌 봉투 + 밀랍 씰.
 * 스크롤을 시작하면(pin+scrub) 씰이 반으로 갈라지고 플랩이 rotateX 로 열리며,
 * 그 뒤로 타이틀이 SplitText 라인 마스크로 번지듯 올라온다.
 */
export function HeroEnvelope() {
  const root = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // reduced-motion: 아무것도 하지 않는다 → 봉투는 닫힌 채로, 타이틀은 CSS 가 즉시 표시
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const title = titleRef.current
        if (!title) return

        // autoSplit: 폰트 로드·리사이즈로 줄바꿈이 바뀌면 자동으로 다시 쪼개고 onSplit 을 재실행한다.
        // (await 로 폰트를 기다렸다가 만들면 useGSAP 컨텍스트 밖에서 생성돼 트리거가 중복 누적된다)
        const split = SplitText.create(title, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'lt-hero-line',
          autoSplit: true,
          onSplit(self) {
            gsap.set(title, { opacity: 1 })
            gsap.set(self.lines, { yPercent: 110 })

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: root.current,
                start: 'top top',
                end: '+=110%',
                scrub: 0.8,
                pin: true,
                anticipatePin: 1,
              },
              defaults: { ease: 'none' },
            })

            tl.to('[data-anim="seal-l"]', { xPercent: -34, rotate: -16 }, 0)
              .to('[data-anim="seal-r"]', { xPercent: 34, rotate: 18 }, 0)
              .to(['[data-anim="seal-l"]', '[data-anim="seal-r"]'], { opacity: 0, duration: 0.4 }, 0.5)
              .to('[data-anim="flap"]', { rotateX: -168, duration: 1.4, ease: 'power2.inOut' }, 0.25)
              .to('[data-anim="envelope"]', { yPercent: 14, scale: 0.94, duration: 1.6 }, 0.4)
              .to(self.lines, { yPercent: 0, duration: 1, stagger: 0.18, ease: 'power2.out' }, 0.9)
              .to('[data-anim="hero-meta"]', { opacity: 1, y: 0, duration: 0.8 }, 1.5)
              .to('[data-anim="hint"]', { opacity: 0, duration: 0.4 }, 0)

            return tl // 재분할 시 GSAP 이 이 타임라인을 되돌린다
          },
        })

        return () => split.revert()
      })
    },
    { scope: root },
  )

  return (
    <section className="lt-hero" ref={root}>
      <div className="lt-shell">
        <p className="lt-eyebrow text-center">PAR AVION</p>

        <div className="mt-8 grid place-items-center">
          <div className="lt-envelope" data-anim="envelope">
            <div className="lt-envelope-body" />
            <div className="lt-envelope-flap" data-anim="flap" />
            {/* 밀랍 씰 — 좌우 반쪽을 겹쳐 두고 갈라지게 한다 */}
            <div className="lt-seal">
              <div
                data-anim="seal-l"
                className="absolute inset-0"
                style={{ clipPath: 'inset(0 50% 0 0)' }}
              >
                <WaxSeal className="h-full w-full" id="seal-l" />
              </div>
              <div
                data-anim="seal-r"
                className="absolute inset-0"
                style={{ clipPath: 'inset(0 0 0 50%)' }}
              >
                <WaxSeal className="h-full w-full" id="seal-r" />
              </div>
            </div>
          </div>
        </div>

        {/* TODO: 최종 카피 확정 전 임시 타이틀 */}
        <h1 className="lt-hero-title opacity-0" data-anim="title" ref={titleRef}>
          도희가 보낸 계절들
        </h1>

        <p
          className="lt-meta mt-6 text-center opacity-0"
          style={{ transform: 'translateY(14px)' }}
          data-anim="hero-meta"
        >
          2026 — 손편지와 일기, 그리고 답장
        </p>
      </div>

      <div className="lt-scroll-hint lt-eyebrow" data-anim="hint">
        SCROLL
      </div>
    </section>
  )
}
