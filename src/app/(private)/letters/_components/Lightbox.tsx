'use client'

import Image from 'next/image'
import { createPortal } from 'react-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import { blurOf, type LetterImage } from '@/content/letters'

/**
 * 캡쳐 리더 — 원본 비율 그대로 크게 본다. 새 라이브러리 없이 구현.
 * 세로로 긴 캡쳐라 스테이지 안에서 세로 스크롤되고, 두 손가락 확대(pinch-zoom)를 허용한다.
 * 키보드(← → ESC)·스와이프·포커스 트랩 지원.
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
  const stage = useRef<HTMLDivElement>(null)
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

  // 다른 캡쳐로 넘어가면 위에서부터 다시 읽는다
  useEffect(() => {
    stage.current?.scrollTo({ top: 0 })
  }, [index])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'Tab') {
        // 포커스 트랩 — 리더 안에서만 순환
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
  const host = typeof document === 'undefined' ? null : document.querySelector('.letters-root')
  if (!img || !host) return null

  // .letters-root 로 포털 — main(z-index:1) 안에 있으면 사운드 토글 같은 고정 UI 위로 올라가지 못한다.
  // body 가 아니라 letters-root 인 이유: 색·폰트 변수가 거기 정의돼 있다.
  return createPortal(
    <div
      className="lt-reader"
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="캡쳐 크게 보기"
      onPointerDown={(e) => setDrag(e.clientX)}
      onPointerUp={(e) => {
        if (drag === null) return
        const dx = e.clientX - drag
        if (dx > 70) prev()
        else if (dx < -70) next()
        setDrag(null)
      }}
    >
      <div className="lt-reader-bar">
        <span className="lt-date">
          {index + 1} / {images.length}
        </span>
        <button type="button" className="lt-btn lt-btn-sm" onClick={onClose} ref={closeRef}>
          닫기
        </button>
      </div>

      <div className="lt-reader-stage" ref={stage}>
        <Image
          src={img.src}
          alt={img.alt}
          width={img.width}
          height={img.height}
          sizes="(max-width: 900px) 100vw, 900px"
          placeholder={blurOf(img.src) ? 'blur' : 'empty'}
          blurDataURL={blurOf(img.src)}
          quality={88}
        />
      </div>

      <div className="lt-reader-bar">
        <button type="button" className="lt-btn lt-btn-sm" onClick={prev} disabled={index === 0}>
          이전
        </button>
        <span className="lt-date">두 손가락으로 확대할 수 있어요</span>
        <button
          type="button"
          className="lt-btn lt-btn-sm"
          onClick={next}
          disabled={index === images.length - 1}
        >
          다음
        </button>
      </div>
    </div>,
    host,
  )
}
