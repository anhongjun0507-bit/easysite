'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// 무거운 three/R3F 번들은 클라이언트에서만, 지연 로드 → 광고/LCP 경로 비차단.
const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false })

/**
 * 히어로 WebGL 배경 래퍼 — 성능·접근성 가드.
 * · 초기 페인트는 CSS `.bg-aurora` 폴백(즉시) → 다음 프레임에 캔버스 마운트
 * · prefers-reduced-motion 이면 캔버스 미사용(정적 유지)
 * · 캔버스는 pointer-events-none → CTA 클릭 방해 없음
 */
export function HeroBackdrop() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.requestAnimationFrame(() => setEnabled(true))
    return () => window.cancelAnimationFrame(id)
  }, [])

  if (!enabled) return null

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <HeroCanvas />
    </div>
  )
}
