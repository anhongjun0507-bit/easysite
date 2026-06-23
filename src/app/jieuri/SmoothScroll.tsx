'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * 관성 스무스 스크롤(Lenis). 페이지 전체 휠/터치 스크롤에 관성감.
 * · prefers-reduced-motion 이면 비활성(네이티브 스크롤)
 * · #앵커 링크는 lenis.scrollTo 로 부드럽게(헤더 높이 96px 보정)
 * · ScrollShowcase 의 스크롤 진행도 계산은 실제 window 스크롤 기반이라 그대로 동작
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    // 디버그/도구용 인스턴스 노출(무해)
    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis

    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const id = a.getAttribute('href')?.slice(1)
      if (!id) return
      const target = document.getElementById(id)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target, { offset: -96 })
    }
    document.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('click', onClick)
      lenis.destroy()
    }
  }, [])

  return null
}
