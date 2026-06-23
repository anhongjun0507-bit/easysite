'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Check,
  Clock,
  Coffee,
  Lock,
  MapPin,
  MessageSquare,
  Rocket,
  Sparkles,
  Star,
} from 'lucide-react'

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)

type Step = {
  n: string
  title: string
  desc: string
  Icon: typeof Check
}

const STEPS: Step[] = [
  {
    n: '01',
    title: '말로 신청',
    desc: '“우리 가게 예약 사이트 만들어줘” 한마디면 끝. 양식도, 기획서도 필요 없어요.',
    Icon: MessageSquare,
  },
  {
    n: '02',
    title: 'AI가 제작',
    desc: '카피·구조·디자인까지 AI가 초안을 짓습니다. 보면서 그 자리에서 수정 요청.',
    Icon: Sparkles,
  },
  {
    n: '03',
    title: '현직 개발자 검수',
    desc: 'AI가 못 채운 디테일은 사람이 직접 손봐서 완성도를 끝까지 끌어올려요.',
    Icon: Check,
  },
  {
    n: '04',
    title: '배포 · 출시',
    desc: '도메인 연결하고 라이브. 데스크탑도 모바일도 알아서 완벽하게.',
    Icon: Rocket,
  },
]

/**
 * 스크롤 프로세스 내러티브 — 왼쪽 디바이스에서 '모카 카페' 사이트가 만들어지고,
 * 오른쪽 단계(신청→제작→검수→출시)가 스크롤에 맞춰 차례로 활성화·리빌된다.
 * 전역 SiteBackdrop(살아있는 배경) 위에 라이트 테마로 얹힘.
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
  const fp = active ? p : 0.78 // 정적(저모션)일 땐 거의 완성된 상태로
  const idx = Math.min(STEPS.length - 1, Math.floor(fp * STEPS.length))
  const build = clamp01((fp - 0.04) / 0.7) // 사이트 완성도 0→1

  return (
    <section
      ref={sectionRef}
      className={reduced ? 'relative' : 'relative h-[320vh]'}
      aria-label="어떻게 만들어지는지 — 신청부터 출시까지"
    >
      <div className="sticky top-0 flex min-h-[100svh] items-center overflow-hidden py-20">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 lg:grid-cols-[1.05fr_0.95fr]">
          {/* ───────── 왼쪽: 디바이스(만들어지는 중) ───────── */}
          <div className="order-2 lg:order-1">
            <DeviceStage idx={idx} build={build} />
          </div>

          {/* ───────── 오른쪽: 단계 내러티브 ───────── */}
          <div className="order-1 lg:order-2">
            <div className="glass rounded-[28px] p-7 sm:p-9">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-white/70 px-3.5 py-1.5 text-[12.5px] font-semibold text-indigo-700 backdrop-blur">
                <Sparkles className="h-4 w-4" strokeWidth={2.2} />
                이렇게 만들어져요
              </span>
              <h2 className="mt-5 text-[27px] font-extrabold leading-tight tracking-[-0.03em] text-gray-900 sm:text-[36px]">
                신청부터 출시까지 <span className="text-gradient">한 번에.</span>
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
                스크롤을 내리면 — 말 한마디가 진짜 사이트가 되어 배포되는 과정.
              </p>

              <ol className="mt-7 space-y-1.5">
                {STEPS.map((s, i) => {
                  const isActive = i === idx
                  const isDone = i < idx
                  return (
                    <li
                      key={s.n}
                      data-active={isActive}
                      className={`group rounded-2xl px-3 py-3 transition-all duration-500 ease-emphasized ${
                        isActive ? 'bg-white/70 shadow-[0_18px_40px_-30px_rgba(30,27,75,0.5)]' : ''
                      }`}
                      style={{ opacity: isActive ? 1 : isDone ? 0.55 : 0.34 }}
                    >
                      <div className="flex items-start gap-3.5">
                        <span
                          className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[13px] font-extrabold tabular-nums transition-colors duration-500 ${
                            isActive
                              ? 'bg-indigo-600 text-white'
                              : isDone
                                ? 'bg-emerald-500 text-white'
                                : 'bg-gray-200/80 text-gray-500'
                          }`}
                        >
                          {isDone ? <Check className="h-4 w-4" strokeWidth={3} /> : s.n}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <s.Icon
                              className={`h-4 w-4 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}
                              strokeWidth={2.2}
                            />
                            <h3 className="text-[16px] font-bold tracking-[-0.01em] text-gray-900 sm:text-[17px]">
                              {s.title}
                            </h3>
                          </div>
                          {/* 활성 시 설명 리빌 (grid-rows 0fr↔1fr) */}
                          <div
                            className={`grid transition-all duration-500 ease-emphasized ${
                              isActive ? 'mt-1.5 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                            }`}
                          >
                            <div className="overflow-hidden">
                              <p className="text-[14px] leading-relaxed text-gray-600">{s.desc}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ol>

              {/* 진행 바 */}
              <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-gray-200/70">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-400 transition-[width] duration-500 ease-emphasized"
                  style={{ width: `${((idx + 1) / STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────── 디바이스 무대 (데스크탑 + 폰) ───────────────── */

function DeviceStage({ idx, build }: { idx: number; build: number }) {
  const siteStyle = {
    filter: `saturate(${(0.2 + 0.8 * build).toFixed(2)})`,
    opacity: 0.5 + 0.5 * build,
  }
  return (
    <div className="relative mx-auto w-full max-w-xl">
      {/* 컬러 헤일로 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 -z-10 rounded-[48px] bg-gradient-to-br from-indigo-400/25 via-violet-400/20 to-sky-300/25 blur-3xl"
      />

      {/* 데스크탑 브라우저 */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-device">
        <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          <span className="mx-auto inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1 text-[11px] font-medium text-gray-500 ring-1 ring-gray-200">
            <Lock className="h-2.5 w-2.5" strokeWidth={2.4} />
            moca-cafe.jieuri.com
          </span>
        </div>
        <div className="relative aspect-[16/10.5] overflow-hidden bg-white">
          <div className="will-change-[filter,opacity]" style={siteStyle}>
            <CafeSite />
          </div>
          {/* 단계 오버레이 */}
          <StageOverlay idx={idx} />
        </div>
      </div>

      {/* 폰 — 우하단 겹침 */}
      <div className="absolute -bottom-6 right-0 w-[128px] sm:right-2 sm:w-[160px] lg:-right-6 lg:w-[188px]">
        <div className="rounded-[1.9rem] border-[6px] border-[#15131f] bg-[#15131f] shadow-device">
          <div className="relative aspect-[9/19] overflow-hidden rounded-[1.4rem] bg-white">
            <div className="absolute left-1/2 top-1.5 z-10 h-3.5 w-12 -translate-x-1/2 rounded-full bg-[#15131f]" />
            <div className="will-change-[filter,opacity]" style={siteStyle}>
              <CafeMobile />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StageOverlay({ idx }: { idx: number }) {
  if (idx === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white/55 backdrop-blur-[2px]">
        <div className="w-[78%] max-w-sm">
          <div className="ml-auto w-fit max-w-[88%] rounded-2xl rounded-br-md bg-indigo-600 px-4 py-2.5 text-[13.5px] font-medium text-white shadow-lg">
            우리 동네 카페 예약 사이트 만들어줘 ☕
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-bold text-indigo-700 shadow ring-1 ring-indigo-100">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2.4} />
            지으리가 듣고 있어요…
          </div>
        </div>
      </div>
    )
  }
  const pill =
    idx === 1
      ? { cls: 'bg-indigo-600 text-white', icon: <Sparkles className="h-3.5 w-3.5" strokeWidth={2.4} />, label: 'AI가 짓는 중…' }
      : idx === 2
        ? { cls: 'bg-gray-900 text-white', icon: <Check className="h-3.5 w-3.5" strokeWidth={2.6} />, label: '현직 개발자 검수 중' }
        : { cls: 'bg-emerald-600 text-white', icon: <Rocket className="h-3.5 w-3.5" strokeWidth={2.4} />, label: '배포 완료 · 라이브' }
  return (
    <div className="absolute right-3 top-3">
      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold shadow-lg ${pill.cls}`}>
        {pill.icon}
        {pill.label}
      </span>
    </div>
  )
}

/* ───────────────── 화면 안 미니 사이트 (모카 카페) — 디테일업 ───────────────── */

function CafeSite() {
  const menu: [string, string, string][] = [
    ['아인슈페너', 'Einspänner', '6,500'],
    ['바닐라 라떼', 'Vanilla Latte', '5,500'],
    ['콜드브루', 'Cold Brew', '5,000'],
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
      {/* nav */}
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

      {/* hero */}
      <div className="relative mx-4 overflow-hidden rounded-2xl bg-gradient-to-br from-amber-200 via-orange-200 to-rose-200 px-7 py-9">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-bold text-amber-800">
          <Star className="h-2.5 w-2.5" fill="currentColor" strokeWidth={0} /> 4.9 · 단골 320명
        </span>
        <h3 className="mt-2.5 text-[29px] font-black leading-[1.04] tracking-tight text-stone-900">
          오늘의 위로,
          <br />
          따뜻한 한 잔.
        </h3>
        <p className="mt-2 max-w-xs text-[12px] text-stone-600">
          동네에서 가장 조용한 자리. 직접 로스팅한 원두로 한 잔씩 정성껏 내립니다.
        </p>
        <div className="mt-4 flex gap-2">
          <span className="rounded-full bg-stone-900 px-4 py-2 text-[11.5px] font-bold text-white">예약하기</span>
          <span className="rounded-full bg-white/70 px-4 py-2 text-[11.5px] font-bold text-stone-800">메뉴 보기</span>
        </div>
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/30 blur-2xl" />
      </div>

      {/* stats */}
      <div className="mx-4 mt-4 grid grid-cols-3 divide-x divide-stone-100 rounded-xl border border-stone-100 bg-white py-3 text-center">
        {[
          ['직접', '로스팅'],
          ['매일 8시', '오픈'],
          ['시그니처', '12종'],
        ].map(([a, b]) => (
          <div key={a} className="px-2">
            <p className="text-[12px] font-extrabold text-stone-900">{a}</p>
            <p className="text-[9.5px] text-stone-500">{b}</p>
          </div>
        ))}
      </div>

      {/* menu */}
      <div className="px-6 pt-7">
        <div className="flex items-end justify-between">
          <h4 className="text-[16px] font-extrabold tracking-tight">시그니처 메뉴</h4>
          <span className="text-[11px] font-semibold text-amber-600">전체보기 →</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {menu.map(([name, en, price], i) => (
            <div key={name} className="overflow-hidden rounded-xl border border-stone-100 bg-white">
              <div className={`h-[72px] bg-gradient-to-br ${cardImg[i]}`} />
              <div className="px-3 py-2.5">
                <p className="text-[12px] font-bold leading-tight">{name}</p>
                <p className="text-[9px] uppercase tracking-wide text-stone-400">{en}</p>
                <p className="mt-1 text-[11px] font-semibold text-amber-700">₩{price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* gallery */}
      <div className="px-6 pt-7">
        <div className="flex items-end justify-between">
          <h4 className="text-[16px] font-extrabold tracking-tight">공간</h4>
          <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-stone-400">
            <span className="h-3 w-3 rounded-[4px] bg-gradient-to-br from-amber-400 to-rose-500" /> @moca_cafe
          </span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {gallery.map((g, i) => (
            <div key={i} className={`aspect-[4/3] rounded-lg bg-gradient-to-br ${g}`} />
          ))}
        </div>
      </div>

      {/* reviews */}
      <div className="px-6 pt-7">
        <h4 className="text-[16px] font-extrabold tracking-tight">단골들의 한마디</h4>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {[
            ['김○○', '분위기도 커피도 완벽. 하루 종일 있고 싶은 곳.'],
            ['이○○', '아인슈페너 맛집. 사장님이 친절하세요.'],
          ].map(([name, text]) => (
            <div key={name} className="rounded-xl border border-stone-100 bg-white p-3.5">
              <div className="flex items-center gap-2">
                <span className="h-7 w-7 rounded-full bg-gradient-to-br from-amber-300 to-rose-300" />
                <div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-2.5 w-2.5" fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-stone-700">{name}</p>
                </div>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-stone-600">“{text}”</p>
            </div>
          ))}
        </div>
      </div>

      {/* location */}
      <div className="px-6 pt-7">
        <h4 className="text-[16px] font-extrabold tracking-tight">오시는 길</h4>
        <div className="mt-3 overflow-hidden rounded-xl border border-stone-100">
          <div className="relative h-24 bg-gradient-to-br from-emerald-100 via-stone-100 to-sky-100">
            <span className="absolute left-1/2 top-1/2 inline-flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-rose-500 text-white shadow">
              <MapPin className="h-4 w-4" strokeWidth={2.4} />
            </span>
          </div>
          <div className="divide-y divide-stone-100 bg-white">
            <div className="flex items-center gap-2 px-3.5 py-2.5 text-[11px] text-stone-600">
              <MapPin className="h-3.5 w-3.5 text-stone-400" /> 서울 어딘가 12-3, 1층
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2.5 text-[11px] text-stone-600">
              <Clock className="h-3.5 w-3.5 text-stone-400" /> 매일 09:00 – 22:00
            </div>
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="mt-7 flex items-center justify-between border-t border-stone-100 px-6 py-5">
        <span className="text-[12px] font-extrabold tracking-tight text-stone-800">MOCA</span>
        <div className="flex gap-1.5">
          <span className="h-5 w-5 rounded-full bg-stone-100" />
          <span className="h-5 w-5 rounded-full bg-stone-100" />
          <span className="h-5 w-5 rounded-full bg-stone-100" />
        </div>
      </div>
    </div>
  )
}

function CafeMobile() {
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
        <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 text-[7.5px] font-bold text-amber-800">
          <Star className="h-2 w-2" fill="currentColor" strokeWidth={0} /> 4.9
        </span>
        <h3 className="mt-1.5 text-[18px] font-black leading-[1.1] text-stone-900">
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

      <div className="mx-2.5 mt-5 overflow-hidden rounded-xl border border-stone-100">
        <div className="relative h-16 bg-gradient-to-br from-emerald-100 via-stone-100 to-sky-100">
          <span className="absolute left-1/2 top-1/2 inline-flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-rose-500 text-white">
            <MapPin className="h-3.5 w-3.5" strokeWidth={2.4} />
          </span>
        </div>
        <div className="bg-white px-3 py-2 text-[9px] text-stone-500">서울 어딘가 12-3 · 09–22시</div>
      </div>

      <div className="px-3.5 py-5 text-center text-[9px] font-bold text-stone-700">MOCA</div>
    </div>
  )
}
