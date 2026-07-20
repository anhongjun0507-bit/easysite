'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import type { LetterImage } from '@/content/letters'
import { blurOf } from '@/content/letters'

/**
 * 스캔 라이트박스 — 새 라이브러리 없이 구현.
 * 키보드(←/→/ESC)·스와이프·핀치줌(touch-action: pinch-zoom)·포커스 트랩 지원.
 */
export function Lightbox({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: LetterImage[]
  index: number
  onIndex: (i: number) => void
  onClose: () => void
}) {
  const root = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [drag, setDrag] = useState<number | null>(null)
  const lenis = useLenis()

  const prev = useCallback(() => onIndex(Math.max(0, index - 1)), [index, onIndex])
  const next = useCallback(() => onIndex(Math.min(images.length - 1, index + 1)), [index, images.length, onIndex])

  // 배경 스크롤 정지 (Lenis + 네이티브 둘 다)
  useEffect(() => {
    lenis?.stop()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      lenis?.start()
      document.body.style.overflow = prevOverflow
    }
  }, [lenis])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'Tab') {
        // 포커스 트랩 — 라이트박스 안에서만 순환
        const focusables = root.current?.querySelectorAll<HTMLElement>('button:not(:disabled)')
        if (!focusables?.length) return
        const list = Array.from(focusables)
        const i = list.indexOf(document.activeElement as HTMLElement)
        e.preventDefault()
        const nextIdx = e.shiftKey ? (i <= 0 ? list.length - 1 : i - 1) : (i + 1) % list.length
        list[nextIdx]?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, prev, next])

  const img = images[index]
  if (!img) return null

  return (
    <div
      className="lt-lightbox"
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="편지 스캔 크게 보기"
      onPointerDown={(e) => setDrag(e.clientX)}
      onPointerUp={(e) => {
        if (drag === null) return
        const dx = e.clientX - drag
        if (dx > 60) prev()
        else if (dx < -60) next()
        setDrag(null)
      }}
    >
      <div className="lt-lightbox-bar">
        <span>
          {index + 1} / {images.length}
        </span>
        <button type="button" className="lt-lightbox-btn" onClick={onClose} ref={closeRef}>
          닫기
        </button>
      </div>

      <div className="lt-lightbox-stage">
        <Image
          src={img.src}
          alt={img.alt}
          width={img.width}
          height={img.height}
          sizes="(max-width: 900px) 96vw, 1100px"
          placeholder={blurOf(img.src) ? 'blur' : 'empty'}
          blurDataURL={blurOf(img.src)}
          quality={82}
        />
      </div>

      <div className="lt-lightbox-bar">
        <button type="button" className="lt-lightbox-btn" onClick={prev} disabled={index === 0}>
          ← 이전
        </button>
        <span className="opacity-70">두 손가락으로 확대할 수 있어요</span>
        <button
          type="button"
          className="lt-lightbox-btn"
          onClick={next}
          disabled={index === images.length - 1}
        >
          다음 →
        </button>
      </div>
    </div>
  )
}
