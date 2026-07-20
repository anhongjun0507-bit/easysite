'use client'

import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/letters/gsap'

// 한국 → 미국. 실제 지도가 아니라 "기억 속 항로" 수준의 단순 도형(three.js 없이 SVG 로만).
const ROUTE_D = 'M232 300 C 400 150, 700 118, 940 214'

/**
 * 항로 프롤로그 — 점선 항로가 그려지고, 종이비행기가 그 위를 활공한다.
 * 섹션을 pin + scrub 해서 스크롤이 곧 비행이 되고, 카메라(inner g)가 비행기를 따라간다.
 * (Codrops "Scroll-Driven SVG Map Animations with GSAP" 구성: draw → motionPath → quickTo camera)
 */
export function FlightPrologue() {
  const root = useRef<HTMLElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const maskRef = useRef<SVGPathElement>(null)
  const planeRef = useRef<SVGGElement>(null)
  const camRef = useRef<SVGGElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const path = pathRef.current
        const mask = maskRef.current
        const plane = planeRef.current
        const cam = camRef.current
        if (!path || !mask || !plane || !cam) return

        const len = path.getTotalLength()
        gsap.set(mask, { strokeDasharray: len, strokeDashoffset: len })
        gsap.set(plane, { opacity: 0, scale: 1.5, transformOrigin: '50% 50%' })

        // 카메라 — 비행기가 화면 중앙에 머물도록 inner g 를 반대로 민다. quickTo 로 매 프레임 부담 최소화.
        const camX = gsap.quickTo(cam, 'x', { duration: 0.5, ease: 'power3' })
        const camY = gsap.quickTo(cam, 'y', { duration: 0.5, ease: 'power3' })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=160%',
            scrub: 0.9,
            pin: true,
            anticipatePin: 1,
          },
          defaults: { ease: 'none' },
          onUpdate: () => {
            const p = path.getPointAtLength(len * tl.progress())
            camX((586 - p.x) * 0.34)
            camY((240 - p.y) * 0.34)
          },
        })

        tl.to('[data-anim="route-label"]', { opacity: 1, duration: 0.3 }, 0)
          .to(mask, { strokeDashoffset: 0, duration: 3 }, 0)
          .to(plane, { opacity: 1, duration: 0.25 }, 0)
          .to(
            plane,
            {
              motionPath: { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: true },
              duration: 3,
            },
            0,
          )
          .to(plane, { opacity: 0, duration: 0.3 }, 2.85)
      })
    },
    { scope: root },
  )

  return (
    <section className="lt-route" ref={root}>
      <svg viewBox="0 0 1172 480" role="img" aria-label="한국에서 미국으로 이어지는 항로">
        <g ref={camRef}>
          {/* 아주 단순화한 육지 실루엣 — 지도라기보다 기억의 좌표 */}
          <path
            className="lt-route-land"
            d="M150 250 l34 -46 30 6 18 26 -6 40 -22 30 -30 -8 -24 -20Z"
          />
          <path
            className="lt-route-land"
            d="M902 150 l70 -20 96 22 40 46 -22 62 -74 26 -84 -18 -46 -44Z"
          />

          <defs>
            <mask id="route-draw">
              <path
                ref={maskRef}
                d={ROUTE_D}
                stroke="#fff"
                strokeWidth="16"
                strokeLinecap="round"
                fill="none"
              />
            </mask>
          </defs>
          <path ref={pathRef} className="lt-route-path" d={ROUTE_D} mask="url(#route-draw)" />

          {/* 종이비행기 — 부모 SVG 좌표계에 직접 그린다(중첩 <svg> 는 크기 계산이 어긋난다) */}
          <g ref={planeRef}>
            <path d="M-12 0 12 -7 4 0 12 7Z" fill="#1b2a4a" opacity="0.9" />
            <path d="M-12 0 12 -7 2 1Z" fill="#1b2a4a" opacity="0.5" />
          </g>

          <g data-anim="route-label" className="opacity-0">
            <circle cx="232" cy="300" r="4" fill="#b3312c" />
            <text className="lt-route-label" x="212" y="332">
              SEOUL
            </text>
            <circle cx="940" cy="214" r="4" fill="#b3312c" />
            <text className="lt-route-label" x="906" y="196">
              U.S.A
            </text>
          </g>
        </g>
      </svg>

      <p className="lt-meta absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
        편지는 늘 며칠씩 늦게 도착했다
      </p>
    </section>
  )
}
