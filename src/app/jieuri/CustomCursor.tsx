'use client'

import { useEffect, useRef } from 'react'

/**
 * 커스텀 커서 (Lusion 톤) — 정밀 도트 + 따라오는 링.
 * 링은 a/button/[data-cursor] 위에서 그 요소에 '달라붙어' 크기·라운드가 모핑된다.
 * · pointer:fine + reduced-motion 아님일 때만 활성(터치/저모션 비활성)
 * · 네이티브 커서 숨김(입력 필드는 text 커서 유지)
 * · 모든 요소 pointer-events-none → 클릭 방해 없음
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dot = dotRef.current
    const ring = ringRef.current
    if (!fine || reduce || !dot || !ring) return

    document.documentElement.classList.add('cursor-none')

    let px = window.innerWidth / 2
    let py = window.innerHeight / 2
    let rx = px
    let ry = py
    let raf = 0

    const onMove = (e: PointerEvent) => {
      px = e.clientX
      py = e.clientY
    }

    const loop = () => {
      dot.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%)`

      const under = document.elementFromPoint(px, py)
      const hit = under
        ? (under.closest('a, button, [data-cursor]') as HTMLElement | null)
        : null

      if (hit) {
        const r = hit.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        rx += (cx - rx) * 0.22
        ry += (cy - ry) * 0.22
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
        ring.style.width = `${r.width + 16}px`
        ring.style.height = `${r.height + 16}px`
        ring.style.borderRadius = getComputedStyle(hit).borderRadius || '9999px'
        ring.dataset.stick = '1'
      } else {
        rx += (px - rx) * 0.18
        ry += (py - ry) * 0.18
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
        ring.style.width = '36px'
        ring.style.height = '36px'
        ring.style.borderRadius = '9999px'
        ring.dataset.stick = '0'
      }
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.classList.remove('cursor-none')
    }
  }, [])

  return (
    <>
      <div ref={ringRef} aria-hidden className="cursor-ring" />
      <div ref={dotRef} aria-hidden className="cursor-dot" />
    </>
  )
}
