'use client'

import { useEffect, useState } from 'react'

/**
 * 히어로 배경 다장 CSS 크로스페이드(6초) + 인디케이터. 시안 A 전용.
 * prefers-reduced-motion → 자동 전환 정지, 첫 장 고정, 인디케이터 숨김.
 * overlay 는 시안별 톤을 위해 className 으로 주입.
 */
export function HeroCrossfade({
  images,
  alt,
  interval = 6000,
  overlayClassName,
}: {
  images: string[]
  alt: string
  interval?: number
  overlayClassName?: string
}) {
  const [i, setI] = useState(0)
  const [auto, setAuto] = useState(false)
  const [fill, setFill] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setAuto(true)
  }, [])

  useEffect(() => {
    if (!auto || images.length < 2) return
    const id = setInterval(() => setI((v) => (v + 1) % images.length), interval)
    return () => clearInterval(id)
  }, [auto, images.length, interval])

  // 활성 세그먼트 프로그레스 채움 — 슬라이드 전환마다 0→100%를 interval 동안 선형으로.
  useEffect(() => {
    if (!auto) return
    setFill(0)
    const r = requestAnimationFrame(() => setFill(100))
    return () => cancelAnimationFrame(r)
  }, [i, auto])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((src, idx) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={idx === 0 ? alt : ''}
          aria-hidden={idx !== 0}
          loading={idx === 0 ? 'eager' : 'lazy'}
          decoding="async"
          className="absolute inset-0 h-full w-full scale-[1.05] object-cover blur-[4px] transition-opacity duration-[1400ms] ease-out"
          style={{ opacity: idx === i ? 1 : 0 }}
        />
      ))}
      {overlayClassName ? <div className={overlayClassName} aria-hidden /> : null}
      {auto && images.length > 1 ? (
        <div className="absolute inset-x-0 bottom-8 z-10 mx-auto flex max-w-7xl items-center gap-4 px-6 sm:px-8">
          <span className="text-[0.72rem] font-semibold tabular-nums tracking-[0.22em] text-white/70">
            {String(i + 1).padStart(2, '0')}
            <span className="mx-1.5 text-white/35">/</span>
            <span className="text-white/45">{String(images.length).padStart(2, '0')}</span>
          </span>
          <div className="flex flex-1 items-center gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`히어로 배경 ${idx + 1}`}
                aria-current={idx === i}
                onClick={() => setI(idx)}
                className="group relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/25"
              >
                <span
                  className="absolute inset-y-0 left-0 block rounded-full bg-white group-hover:bg-white"
                  style={{
                    width: idx < i ? '100%' : idx === i ? `${fill}%` : '0%',
                    transition: idx === i ? `width ${interval}ms linear` : 'width .4s ease',
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
