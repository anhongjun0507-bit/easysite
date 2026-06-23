'use client'

import { useEffect, useRef, useState } from 'react'
import { Coffee, Lock, MapPin, Monitor, Smartphone, Sparkles, Star } from 'lucide-react'

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)

/**
 * 스크롤 디바이스 쇼케이스 — 클로바노트/토스 톤의 '키노트' 섹션.
 * 딥 인디고 무대 위에 데스크탑 브라우저 + 폰을 3D로 띄우고, 스크롤을 내리면
 * (1) 기기가 기울기에서 똑바로 정렬되고 (2) 화면 안 사이트가 위로 스크롤되어
 * "같은 사이트가 데스크탑·모바일에서 어떻게 쓰이는지"를 시연한다.
 * 새 의존성 0개 — sticky + rAF 스크롤 진행도로만 구현. transform/opacity만 사용.
 * prefers-reduced-motion 이면 정렬된 정적 상태로 표시(모션 없음).
 */
export function ScrollShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [p, setP] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      setReduced(true)
      setMounted(true)
      return
    }
    setMounted(true)
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const el = sectionRef.current
        if (!el) return
        const total = el.offsetHeight - window.innerHeight
        const passed = -el.getBoundingClientRect().top
        setP(total > 0 ? clamp01(passed / total) : 0)
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

  const active = mounted && !reduced
  const settle = active ? clamp01(p / 0.4) : 1 // 진입: 기울기→정렬
  const read = active ? clamp01((p - 0.12) / 0.82) : 0 // 화면 안 스크롤
  const onMobile = p >= 0.5 // 상단 인디케이터 active 디바이스

  const clusterStyle = {
    transform: `translateY(${((1 - settle) * 60).toFixed(1)}px) scale(${(0.9 + settle * 0.1).toFixed(3)})`,
    opacity: 0.2 + settle * 0.8,
  }
  const phoneStyle = {
    transform: `translateZ(90px) translateY(${onMobile ? -8 : 6}px) scale(${(0.95 + clamp01((p - 0.4) / 0.25) * 0.09).toFixed(3)})`,
  }

  return (
    <section
      ref={sectionRef}
      className={reduced ? 'relative' : 'relative h-[210vh]'}
      aria-label="데스크탑·모바일 미리보기"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden bg-stage-dark px-6">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-noise opacity-[0.18] mix-blend-overlay"
        />

        {/* ───────── 헤딩 ───────── */}
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[12.5px] font-semibold text-indigo-100 backdrop-blur">
            <Sparkles className="h-4 w-4" strokeWidth={2.2} />
            한 번 만들면, 모든 화면에서
          </span>
          <h2 className="mt-5 text-[27px] font-extrabold leading-tight tracking-[-0.03em] text-white sm:text-[42px]">
            데스크탑도, 모바일도
            <br className="sm:hidden" /> <span className="text-gradient">알아서 완벽하게.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-indigo-100/70 sm:text-[16px]">
            스크롤만 내려보세요 — 같은 사이트가 큰 화면과 손안에서 어떻게 보이는지.
          </p>

          {/* 디바이스 인디케이터 */}
          <div className="mt-5 inline-flex items-center gap-1 rounded-full border border-white/12 bg-white/5 p-1 text-[12.5px] font-bold backdrop-blur">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors duration-300 ${!onMobile ? 'bg-white text-gray-900' : 'text-indigo-100/70'}`}
            >
              <Monitor className="h-3.5 w-3.5" strokeWidth={2.2} />
              데스크탑
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors duration-300 ${onMobile ? 'bg-white text-gray-900' : 'text-indigo-100/70'}`}
            >
              <Smartphone className="h-3.5 w-3.5" strokeWidth={2.2} />
              모바일
            </span>
          </div>
        </div>

        {/* ───────── 디바이스 클러스터 ───────── */}
        <div className="relative mt-8 w-full max-w-3xl [perspective:1500px] sm:mt-10">
          <div className="stage-3d relative mx-auto w-[min(86vw,700px)]" style={clusterStyle}>
            {/* DESKTOP */}
            <div className="stage-3d" style={{ transform: `rotateX(${((1 - settle) * 12).toFixed(1)}deg)` }}>
              <div className="shadow-device overflow-hidden rounded-2xl border border-white/12 bg-[#0e0b26]">
                <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.05] px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  <span className="mx-auto inline-flex items-center gap-1.5 rounded-md bg-black/30 px-3 py-1 text-[11px] font-medium text-indigo-100/80">
                    <Lock className="h-2.5 w-2.5" strokeWidth={2.4} />
                    moca-cafe.jieuri.com
                  </span>
                </div>
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-50">
                  <div
                    className="will-change-transform"
                    style={{ transform: `translateY(${(-read * 50).toFixed(1)}%)` }}
                  >
                    <DesktopMock />
                  </div>
                </div>
              </div>
            </div>

            {/* PHONE — translateZ로 앞에서 데스크탑 우하단에 겹침 */}
            <div
              className="absolute -bottom-8 right-1 w-[122px] sm:right-3 sm:w-[166px] lg:-right-4 lg:w-[198px]"
              style={phoneStyle}
            >
              <div className="shadow-device rounded-[2rem] border-[6px] border-[#16132f] bg-[#16132f]">
                <div className="relative aspect-[9/19] overflow-hidden rounded-[1.5rem] bg-stone-50">
                  <div className="absolute left-1/2 top-1.5 z-10 h-3.5 w-14 -translate-x-1/2 rounded-full bg-[#16132f]" />
                  <div
                    className="will-change-transform"
                    style={{ transform: `translateY(${(-read * 56).toFixed(1)}%)` }}
                  >
                    <MobileMock />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────── 화면 안 미니 사이트 (모카 카페) ───────────────── */

function DesktopMock() {
  const menu: [string, string][] = [
    ['아인슈페너', '6,500'],
    ['바닐라 라떼', '5,500'],
    ['콜드브루', '5,000'],
  ]
  const cardImg = ['from-amber-200 to-orange-300', 'from-rose-200 to-amber-200', 'from-stone-300 to-stone-400']
  const gallery = [
    'from-amber-100 to-rose-200',
    'from-stone-200 to-stone-300',
    'from-orange-100 to-amber-200',
    'from-rose-100 to-stone-200',
    'from-amber-200 to-stone-200',
    'from-stone-200 to-amber-100',
  ]
  return (
    <div className="text-stone-800">
      <div className="flex items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-1.5 text-[15px] font-extrabold tracking-tight">
          <Coffee className="h-4 w-4 text-amber-600" strokeWidth={2.4} />
          MOCA
        </div>
        <div className="flex items-center gap-5 text-[11.5px] font-semibold text-stone-500">
          <span>메뉴</span>
          <span>스토리</span>
          <span>오시는 길</span>
          <span className="rounded-full bg-stone-900 px-3 py-1.5 text-white">예약</span>
        </div>
      </div>

      <div className="relative mx-4 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-200 via-orange-200 to-rose-200 px-7 py-10">
        <p className="text-[11px] font-bold tracking-[0.2em] text-amber-700">SINCE 2026 · SEOUL</p>
        <h3 className="mt-2 text-[30px] font-black leading-[1.05] tracking-tight text-stone-900">
          오늘의 위로,
          <br />
          따뜻한 한 잔.
        </h3>
        <p className="mt-2.5 max-w-xs text-[12px] text-stone-600">
          동네에서 가장 조용한 자리. 직접 로스팅한 원두로 한 잔씩 정성껏 내립니다.
        </p>
        <div className="mt-4 flex gap-2">
          <span className="rounded-full bg-stone-900 px-4 py-2 text-[11.5px] font-bold text-white">예약하기</span>
          <span className="rounded-full bg-white/70 px-4 py-2 text-[11.5px] font-bold text-stone-800">메뉴 보기</span>
        </div>
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/30 blur-2xl" />
      </div>

      <div className="px-6 pt-8">
        <div className="flex items-end justify-between">
          <h4 className="text-[16px] font-extrabold tracking-tight">시그니처 메뉴</h4>
          <span className="text-[11px] font-semibold text-amber-600">전체보기 →</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {menu.map(([name, price], i) => (
            <div key={name} className="overflow-hidden rounded-xl border border-stone-100 bg-white">
              <div className={`h-20 bg-gradient-to-br ${cardImg[i]}`} />
              <div className="px-3 py-2.5">
                <p className="text-[12px] font-bold">{name}</p>
                <p className="mt-0.5 text-[11px] font-semibold text-amber-700">₩{price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 pt-8">
        <h4 className="text-[16px] font-extrabold tracking-tight">공간</h4>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {gallery.map((g, i) => (
            <div key={i} className={`aspect-[4/3] rounded-lg bg-gradient-to-br ${g}`} />
          ))}
        </div>
      </div>

      <div className="mx-6 mt-8 rounded-2xl bg-stone-900 px-6 py-6 text-white">
        <div className="flex text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
          ))}
        </div>
        <p className="mt-2 text-[13px] font-semibold leading-relaxed">
          “분위기도 커피도 완벽해요. 노트북 들고 하루 종일 있고 싶은 곳.”
        </p>
        <p className="mt-2 text-[11px] text-stone-400">— 단골손님 김○○</p>
      </div>

      <div className="flex items-center justify-between px-6 py-7 text-[11px] text-stone-400">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3 w-3" /> 서울 어딘가 12-3
        </span>
        <span>매일 09:00 – 22:00</span>
      </div>
    </div>
  )
}

function MobileMock() {
  const menu: [string, string][] = [
    ['아인슈페너', '6,500'],
    ['바닐라 라떼', '5,500'],
  ]
  const cardImg = ['from-amber-200 to-orange-300', 'from-rose-200 to-amber-200']
  const gallery = [
    'from-amber-100 to-rose-200',
    'from-stone-200 to-stone-300',
    'from-orange-100 to-amber-200',
    'from-rose-100 to-stone-200',
  ]
  return (
    <div className="text-stone-800">
      <div className="flex items-center justify-between px-3.5 pb-2.5 pt-7">
        <div className="flex items-center gap-1 text-[12px] font-extrabold">
          <Coffee className="h-3.5 w-3.5 text-amber-600" strokeWidth={2.4} />
          MOCA
        </div>
        <div className="flex flex-col gap-[3px]">
          <span className="h-[2px] w-4 rounded bg-stone-400" />
          <span className="h-[2px] w-4 rounded bg-stone-400" />
        </div>
      </div>

      <div className="mx-2.5 overflow-hidden rounded-xl bg-gradient-to-br from-amber-200 via-orange-200 to-rose-200 px-4 py-6">
        <p className="text-[8px] font-bold tracking-[0.18em] text-amber-700">SINCE 2026</p>
        <h3 className="mt-1 text-[18px] font-black leading-[1.1] text-stone-900">
          오늘의 위로,
          <br />한 잔.
        </h3>
        <span className="mt-3 inline-block rounded-full bg-stone-900 px-3 py-1.5 text-[9.5px] font-bold text-white">
          예약하기
        </span>
      </div>

      <div className="px-3.5 pt-5">
        <h4 className="text-[12px] font-extrabold">시그니처</h4>
        <div className="mt-2 space-y-2">
          {menu.map(([name, price], i) => (
            <div key={name} className="flex items-center gap-2.5 rounded-lg border border-stone-100 bg-white p-2">
              <div className={`h-10 w-10 shrink-0 rounded-md bg-gradient-to-br ${cardImg[i]}`} />
              <div className="min-w-0">
                <p className="text-[10.5px] font-bold">{name}</p>
                <p className="text-[9.5px] font-semibold text-amber-700">₩{price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-3.5 pt-5">
        <h4 className="text-[12px] font-extrabold">공간</h4>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {gallery.map((g, i) => (
            <div key={i} className={`aspect-square rounded-md bg-gradient-to-br ${g}`} />
          ))}
        </div>
      </div>

      <div className="mx-2.5 mt-5 rounded-xl bg-stone-900 px-4 py-4 text-white">
        <div className="flex text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-2.5 w-2.5" fill="currentColor" strokeWidth={0} />
          ))}
        </div>
        <p className="mt-1.5 text-[10px] font-semibold leading-relaxed">“분위기도 커피도 완벽해요.”</p>
      </div>

      <div className="px-3.5 py-5 text-[9px] text-stone-400">서울 어딘가 12-3 · 매일 09–22시</div>
    </div>
  )
}
