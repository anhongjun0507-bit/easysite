'use client'

/**
 * /letters 전용 GSAP 진입점 — **플러그인 등록은 이 파일 한 곳에서만** 한다.
 * 씬 컴포넌트는 항상 여기서 import (개별 파일에서 registerPlugin 금지 → 중복 등록·누락 사고 방지).
 * 사용 플러그인은 전부 GSAP 3.13+ 무료 공식 플러그인이라 직접 구현하지 않는다.
 */

import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, MotionPathPlugin)
gsap.config({ nullTargetWarn: false })

// 개발 중 스크린샷·트리거 위치 디버그용 (프로덕션 번들에서는 제거됨)
if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  ;(window as unknown as Record<string, unknown>).__ltGsap = { gsap, ScrollTrigger }
}

export { gsap, useGSAP, ScrollTrigger, SplitText, MotionPathPlugin }

/** 이 페이지에서 모션을 완전히 끌지 여부 (SSR 안전) */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
