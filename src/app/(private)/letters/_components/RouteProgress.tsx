'use client'

import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger } from '@/lib/letters/gsap'

/**
 * 상단 고정 진행 인디케이터 — 항로 위 비행기 위치가 곧 스크롤 진도.
 * 전체 문서 스크롤에 대한 ScrollTrigger **1개**만 쓴다(성능).
 *
 * 항로 SVG 는 가로로 늘여야 해서(preserveAspectRatio="none") 비행기를 같은 SVG 에 두면
 * 모양이 찌그러진다 → 비행기는 별도 HTML 레이어로 두고, path 좌표를 화면 좌표로 직접 매핑한다.
 */
const VB_W = 1000
const VB_H = 26

export function RouteProgress() {
  const root = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const planeRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const path = pathRef.current
      const plane = planeRef.current
      const host = root.current
      if (!path || !plane || !host) return

      const len = path.getTotalLength()
      let width = path.getBoundingClientRect().width || host.clientWidth

      const place = (progress: number) => {
        const at = Math.min(len, Math.max(0, len * progress))
        const p = path.getPointAtLength(at)
        const q = path.getPointAtLength(Math.min(len, at + 4))
        const scale = width / VB_W
        gsap.set(plane, {
          x: p.x * scale,
          y: p.y, // .lt-progress svg 높이가 viewBox 높이(26)와 같아 y 는 그대로 쓴다
          rotation: (Math.atan2(q.y - p.y, (q.x - p.x) * scale) * 180) / Math.PI,
        })
      }

      const st = ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => place(self.progress),
        onRefresh: (self) => {
          width = path.getBoundingClientRect().width || host.clientWidth
          place(self.progress)
        },
      })
      place(0)

      return () => st.kill()
    },
    { scope: root },
  )

  return (
    <div className="lt-progress" ref={root} aria-hidden>
      <div className="relative">
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none">
          <path ref={pathRef} className="lt-progress-track" d="M4 20 C 260 2, 740 2, 996 20" />
        </svg>
        <span
          ref={planeRef}
          className="pointer-events-none absolute left-0 top-0 block"
          style={{ willChange: 'transform' }}
        >
          <svg viewBox="-9 -6 18 12" width="20" height="14" style={{ display: 'block', marginLeft: -10, marginTop: -7 }}>
            <path d="M-7 0 7 -4 2 0 7 4Z" fill="#b3312c" />
          </svg>
        </span>
      </div>
    </div>
  )
}
