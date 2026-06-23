'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// 무거운 three/R3F 는 클라이언트에서만 지연 로드 → 광고/LCP 경로 비차단.
const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false })

/**
 * 사이트 전역 배경 — 히어로 WebGL 흐르는 그라데이션을 페이지 전체에 깐다(fixed).
 * 콘텐츠는 위로 스크롤되고 배경은 고정 → 랜딩 어디서나 같은 살아있는 배경.
 * · 초기/저모션/미지원은 CSS .bg-aurora 폴백(즉시)
 * · 그 위에 미세 그리드 + 그레인 텍스처
 * · pointer-events-none, -z-10 → 콘텐츠 클릭/레이아웃 방해 없음
 */
export function SiteBackdrop() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.requestAnimationFrame(() => setEnabled(true))
    return () => window.cancelAnimationFrame(id)
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      {/* CSS 폴백(캔버스가 덮음) */}
      <div className="absolute inset-0 bg-aurora" />
      {/* WebGL 셰이더 — 불투명, 폴백을 덮음 */}
      {enabled && <HeroCanvas />}
      {/* 텍스처는 캔버스 위로 */}
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute inset-0 bg-noise opacity-[0.1] mix-blend-soft-light" />
    </div>
  )
}
