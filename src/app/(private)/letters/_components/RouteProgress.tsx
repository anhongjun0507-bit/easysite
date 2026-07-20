'use client'

import { useRef } from 'react'
import { gsap, useGSAP, ScrollTrigger } from '@/lib/letters/gsap'

/**
 * 상단 고정 진행 인디케이터 — 항로 위 비행기 위치가 곧 스크롤 진도.
 * 전체 문서에 대한 ScrollTrigger 하나만 쓴다.
 *
 * 항로 SVG 는 가로로 늘여야 해서(preserveAspectRatio="none") 비행기를 같은 SVG 에 두면
 * 모양이 찌그러진다 → 비행기는 별도 HTML 레이어로 두고 path 좌표를 화면 좌표로 직접 매핑한다.
 */
const VB_W = 1000
const VB_H = 26

export function RouteProgress() {
  const root = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const planeRef = useRef<HTMLSpanElement>(null)
  const trailRef = useRef<SVGPathElement>(null)

  useGSAP(
    () => {
      const path = pathRef.current
      const plane = planeRef.current
      const trail = trailRef.current
      const host = root.current
      if (!path || !plane || !trail || !host) return

      const len = path.getTotalLength()
      trail.style.strokeDasharray = String(len)
      let width = path.getBoundingClientRect().width || host.clientWidth

      const place = (progress: number) => {
        const at = Math.min(len, Math.max(0, len * progress))
        const p = path.getPointAtLength(at)
        const q = path.getPointAtLength(Math.min(len, at + 4))
        const scale = width / VB_W
        gsap.set(plane, {
          x: p.x * scale,
          y: p.y, // svg 높이 = viewBox 높이(26) 라 y 는 그대로 쓴다
          rotation: (Math.atan2(q.y - p.y, (q.x - p.x) * scale) * 180) / Math.PI,
        })
        trail.style.strokeDashoffset = String(len - at)
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
      <div className="lt-progress-inner">
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none">
          <path ref={pathRef} className="lt-progress-track" d="M4 20 C 260 2, 740 2, 996 20" />
          <path ref={trailRef} className="lt-progress-trail" d="M4 20 C 260 2, 740 2, 996 20" />
        </svg>
        <span className="lt-progress-plane" ref={planeRef}>
          <svg viewBox="-9 -6 18 12" width="18" height="12">
            <path d="M-7 0 7 -4 2 0 7 4Z" fill="currentColor" />
          </svg>
        </span>
      </div>
    </div>
  )
}
