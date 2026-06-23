'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { featuredPortfolio, type PortfolioItem } from '@/config/portfolio'
import { Reveal } from './Reveal'

const WORKS = featuredPortfolio.slice(0, 6)

/**
 * Featured Work — Lusion 톤 포트폴리오. 실제 운영 사이트(public/portfolio) 재사용.
 * 스크롤에 따라 각 썸네일이 프레임 안에서 패럴럭스로 흐르고, 진입 시 리빌된다.
 * prefers-reduced-motion 이면 패럴럭스 비활성(정적).
 */
export function FeaturedWork() {
  const refs = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const vh = window.innerHeight
        for (const el of refs.current) {
          if (!el) continue
          const r = el.getBoundingClientRect()
          if (r.bottom < -40 || r.top > vh + 40) continue
          const prog = (r.top + r.height / 2 - vh / 2) / vh // -0.5..0.5 근방
          el.style.transform = `translate3d(0, ${(prog * 26).toFixed(1)}px, 0) scale(1.14)`
        }
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="relative border-t border-gray-100/70" aria-label="제작 사례 — Featured Work">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <Reveal>
          <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-indigo-600">
            Featured Work
          </p>
          <h2 className="mt-3 text-[30px] font-extrabold leading-[1.05] tracking-[-0.03em] text-gray-900 sm:text-[46px]">
            말이 아니라, <span className="text-gradient">결과로.</span>
          </h2>
          <p className="mt-4 max-w-md text-[16px] leading-relaxed text-gray-600">
            실제로 만들어 운영 중인 사이트들이에요 — 숨고 평점 5.0.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-x-7 gap-y-12 sm:mt-16 sm:grid-cols-2 sm:gap-y-16">
          {WORKS.map((w, i) => (
            <Reveal key={w.id} delay={(i % 2) * 90} className={i % 2 === 1 ? 'sm:mt-20' : ''}>
              <WorkTile work={w} index={i} setRef={(el) => (refs.current[i] = el)} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 flex justify-center">
          <Link
            href="/portfolio"
            data-cursor
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white/70 px-7 py-3.5 text-[15px] font-bold text-gray-900 backdrop-blur transition duration-200 ease-emphasized hover:-translate-y-0.5 hover:border-gray-400"
          >
            전체 제작 사례 보기
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 ease-emphasized group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

function WorkTile({
  work,
  index,
  setRef,
}: {
  work: PortfolioItem
  index: number
  setRef: (el: HTMLDivElement | null) => void
}) {
  return (
    <a
      href={work.url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor
      className="group block"
    >
      <div className="relative aspect-[16/11] overflow-hidden rounded-[22px] border border-gray-200/70 bg-gray-100 shadow-[0_30px_70px_-40px_rgba(30,27,75,0.5)]">
        <div ref={setRef} className="absolute inset-0 will-change-transform" style={{ transform: 'scale(1.14)' }}>
          <Image
            src={work.image}
            alt={work.imageAlt}
            fill
            sizes="(min-width: 640px) 45vw, 92vw"
            className="object-cover object-top transition-transform duration-700 ease-emphasized group-hover:scale-[1.05]"
          />
        </div>

        {/* 번호 — mix-blend 로 항상 또렷하게 */}
        <span className="absolute left-4 top-3.5 text-[13px] font-extrabold tabular-nums text-white mix-blend-difference">
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* hover veil + 보기 */}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-gray-950/60 via-gray-950/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="m-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[13px] font-bold text-gray-900 shadow-lg">
            사이트 보기
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[19px] font-extrabold tracking-[-0.01em] text-gray-900 sm:text-[22px]">
            {work.name}
          </h3>
          <p className="mt-1 text-[14px] leading-relaxed text-gray-600">{work.description}</p>
        </div>
        <span className="mt-1 shrink-0 rounded-full bg-white/70 px-3 py-1 text-[11.5px] font-bold text-indigo-700 ring-1 ring-indigo-100 backdrop-blur">
          {work.category}
        </span>
      </div>
    </a>
  )
}
