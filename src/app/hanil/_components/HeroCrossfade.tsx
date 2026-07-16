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

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setAuto(true)
  }, [])

  useEffect(() => {
    if (!auto || images.length < 2) return
    const id = setInterval(() => setI((v) => (v + 1) % images.length), interval)
    return () => clearInterval(id)
  }, [auto, images.length, interval])

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
        <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`히어로 배경 ${idx + 1}`}
              aria-current={idx === i}
              onClick={() => setI(idx)}
              className="h-1.5 rounded-full bg-white/40 transition-all duration-500 hover:bg-white/70"
              style={{ width: idx === i ? 30 : 10, background: idx === i ? 'rgba(255,255,255,.92)' : undefined }}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
