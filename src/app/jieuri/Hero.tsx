'use client'

import Link from 'next/link'
import { useRef, type MouseEvent } from 'react'
import { ArrowRight, Check, Sparkles, Star } from 'lucide-react'

/**
 * 홈 플래그십 히어로 — 프리미엄·3D·AI 감성(토스/클로바 톤).
 * 오로라 그라데이션 + 미세 그리드 배경 위에, 마우스로 기울어지는 3D 다크 글래스
 * "AI가 사이트를 짓는" 데모 카드와 떠다니는 깊이 요소를 배치한다.
 */
export function Hero() {
  const tiltRef = useRef<HTMLDivElement>(null)

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const el = tiltRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(1100px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg)`
  }
  function handleLeave() {
    const el = tiltRef.current
    if (el) el.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg)'
  }

  return (
    <section className="relative isolate overflow-hidden bg-aurora">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-12 sm:pb-24 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
        {/* ───────── 카피 ───────── */}
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-white/70 px-3.5 py-1.5 text-[13px] font-semibold text-indigo-700 shadow-xs backdrop-blur">
            <Sparkles className="h-4 w-4" strokeWidth={2.2} />
            AI 웹사이트 빌더 · 사전등록 모집 중
          </span>

          <h1 className="mt-7 text-[26px] font-bold leading-tight tracking-[-0.02em] text-gray-900 sm:text-[34px]">
            코드 몰라도 됩니다.
          </h1>
          <p className="mt-1 text-[46px] font-extrabold leading-[1.02] tracking-[-0.04em] text-gray-900 sm:text-[74px]">
            말하면, <span className="text-gradient">지으리.</span>
          </p>

          <p className="mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-gray-600 sm:text-[18px] lg:mx-0">
            개발자한테 300만원 주고 3주 기다리지 마세요. 채팅으로 말하면 AI가
            만들고, 막히면 현직 개발자가 대신 고쳐드립니다.
          </p>

          {/* 신뢰 글래스 칩 */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-bold text-gray-800">
              <span className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3" fill="currentColor" strokeWidth={0} />
                ))}
              </span>
              숨고 5.0
            </span>
            <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-bold text-gray-800">
              <Check className="h-3.5 w-3.5 text-indigo-600" strokeWidth={2.6} />
              제작 100건+
            </span>
            <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-bold text-gray-800">
              현직 개발자 직접
            </span>
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col items-center gap-2.5 sm:flex-row sm:flex-wrap lg:justify-start lg:gap-3">
            <a
              href="#register"
              className="shine glow-indigo group inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-7 text-[16px] font-bold text-white transition duration-200 ease-emphasized hover:-translate-y-0.5 hover:bg-indigo-700 active:translate-y-0 sm:w-auto sm:text-[17px]"
            >
              사전등록하고 평생 50% 할인
              <ArrowRight className="h-5 w-5 transition-transform duration-200 ease-emphasized group-hover:translate-x-0.5" />
            </a>
            <Link
              href="/wizard"
              className="glass group inline-flex h-14 w-full items-center justify-center gap-1.5 rounded-2xl px-6 text-[15px] font-bold text-gray-800 transition duration-200 ease-emphasized hover:-translate-y-0.5 active:translate-y-0 sm:w-auto sm:text-[16px]"
            >
              1분 견적 받기
              <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-emphasized group-hover:translate-x-0.5" />
            </Link>
          </div>
          <p className="mt-3 text-center text-[13px] text-gray-500 lg:text-left">
            선착순 100명 · 딱 한 번만 연락
          </p>
        </div>

        {/* ───────── 3D 데모 ───────── */}
        <div
          className="relative mx-auto w-full max-w-md [perspective:1100px] lg:max-w-none"
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
        >
          <div ref={tiltRef} className="tilt-3d relative">
            <div className="glass-dark rounded-[28px] p-3.5 sm:p-4">
              {/* 윈도우 바 */}
              <div className="flex items-center gap-2 px-1.5 pb-3">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                <span className="ml-2 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-indigo-200/90">
                  <Sparkles className="h-3.5 w-3.5" strokeWidth={2.2} />
                  지으리 AI
                </span>
              </div>

              {/* 채팅 */}
              <div className="space-y-2.5 px-1">
                <div className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-md bg-indigo-500 px-3.5 py-2 text-[13.5px] font-medium text-white shadow-lg">
                  우리 동네 카페 예약 사이트 만들어줘 ☕
                </div>
                <div className="w-fit max-w-[85%] rounded-2xl rounded-bl-md border border-white/10 bg-white/5 px-3.5 py-2 text-[13.5px] text-indigo-50">
                  네! 바로 만들고 있어요 ✨
                </div>
              </div>

              {/* 미니 사이트 프리뷰 (생성 중) */}
              <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-gradient-to-br from-amber-300 to-rose-400" />
                    <span className="text-[11px] font-bold text-white/90">모카 카페</span>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="h-1.5 w-6 rounded-full bg-white/15" />
                    <span className="h-1.5 w-6 rounded-full bg-white/15" />
                    <span className="h-1.5 w-8 rounded-full bg-indigo-400/70" />
                  </div>
                </div>
                <div className="space-y-2 p-3">
                  <div className="h-16 rounded-xl bg-gradient-to-br from-amber-300/30 via-rose-300/20 to-indigo-400/30" />
                  <div className="h-2 w-1/2 rounded-full bg-white/20" />
                  <div className="h-2 w-2/3 rounded-full bg-white/12" />
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div className="h-10 rounded-lg bg-white/10" />
                    <div className="h-10 rounded-lg bg-white/10" />
                    <div className="h-10 rounded-lg bg-indigo-400/25" />
                  </div>
                </div>
              </div>

              {/* 입력 바 (타이핑) */}
              <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2.5">
                <span className="text-[13px] text-indigo-100/90">
                  색을 더 따뜻하게 바꿔줘<span className="caret text-indigo-300">|</span>
                </span>
                <span className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500 text-white">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>

          {/* 떠다니는 깊이 요소 */}
          <div className="animate-float glass absolute -right-3 -top-3 inline-flex items-center gap-1.5 rounded-2xl px-3 py-2 text-[12.5px] font-bold text-gray-800 sm:-right-5">
            <Check className="h-4 w-4 text-emerald-500" strokeWidth={2.6} />
            배포 완료
          </div>
          <div className="animate-float-slow glass absolute -bottom-4 -left-3 inline-flex items-center gap-2 rounded-2xl px-3 py-2 sm:-left-6">
            <span className="text-[11.5px] font-bold text-gray-700">AI 컬러</span>
            <span className="flex gap-1">
              <span className="h-3.5 w-3.5 rounded-full bg-amber-400" />
              <span className="h-3.5 w-3.5 rounded-full bg-rose-400" />
              <span className="h-3.5 w-3.5 rounded-full bg-indigo-500" />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
