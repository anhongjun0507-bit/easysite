'use client'

import { useEffect, useState } from 'react'
import { Check, Globe, Send, Star } from 'lucide-react'
import styles from './HeroDemo.module.css'

type Effect = 'cta' | 'image' | 'reviews' | 'dark' | 'green' | 'menuAdd'

const SCENES: { cmd: string; effect: Effect; done: string }[] = [
  { cmd: '예약 버튼 넣어줘', effect: 'cta', done: '예약 버튼 추가' },
  { cmd: '대표 사진 크게', effect: 'image', done: '대표 사진 확대' },
  { cmd: '후기 보여줘', effect: 'reviews', done: '후기 추가' },
  { cmd: '테마 어둡게 바꿔줘', effect: 'dark', done: '다크 테마 적용' },
  { cmd: '포인트 색 초록으로', effect: 'green', done: '포인트 색 변경' },
  { cmd: '메뉴에 딸기 케이크 추가해줘', effect: 'menuAdd', done: '메뉴 추가' },
]
// 정적/축소모션 기본값: 라이트 완성형(테마 토글 제외) — 다 만들어진 카페 사이트로 보이게
const COMPLETE: Effect[] = ['cta', 'image', 'reviews', 'menuAdd']

/**
 * 히어로 시그니처: 채팅으로 말하면 옆 카페 사이트 목업이 단계별로 바뀌는 루프.
 * - 변형은 transform·opacity·color 트랜지션만 + 슬롯 높이 고정 → layout 시프트 0(모바일 60fps)
 * - "반영했어요" 칩은 브라우저 프레임 *위* 고정 슬롯 → 어떤 단계에서도 목업 콘텐츠를 가리지 않음
 * - prefers-reduced-motion: 라이트 완성형을 정적으로 표시(루프·타이핑 없음)
 * - 장식 요소라 root 는 aria-hidden
 */
export function HeroDemo() {
  const [typed, setTyped] = useState('')
  const [active, setActive] = useState<Set<Effect>>(() => new Set(COMPLETE))
  const [chip, setChip] = useState<string | null>(null)
  const [thinking, setThinking] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActive(new Set(COMPLETE))
      setTyped('')
      return
    }

    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const wait = (ms: number) =>
      new Promise<void>((res) => {
        timers.push(setTimeout(res, ms))
      })

    async function loop() {
      while (!cancelled) {
        setActive(new Set())
        setChip(null)
        setTyped('')
        await wait(800)
        for (const scene of SCENES) {
          if (cancelled) return
          for (let i = 1; i <= scene.cmd.length; i++) {
            if (cancelled) return
            setTyped(scene.cmd.slice(0, i))
            await wait(52)
          }
          await wait(380)
          if (cancelled) return
          setTyped('')
          setThinking(true)
          await wait(560) // 타이핑 완료 후 1초 내 반영
          if (cancelled) return
          setThinking(false)
          setActive((prev) => new Set(prev).add(scene.effect))
          setChip(scene.done)
          await wait(1750) // 1.5~2초 유지
          if (cancelled) return
          setChip(null)
          await wait(320)
        }
        await wait(1600)
      }
    }
    void loop()
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [])

  const has = (e: Effect) => active.has(e)
  const dark = has('dark')
  const green = has('green')

  // 색 토큰 — 다크/그린에 따라(transition-colors 로 부드럽게 전환)
  const surface = dark ? '#18181b' : '#ffffff'
  const bar = dark ? '#27272a' : '#f9fafb'
  const border = dark ? '#3f3f46' : '#f3f4f6'
  const ink = dark ? '#fafafa' : '#292524'
  const sub = dark ? '#a1a1aa' : '#a8a29e'
  const menuName = dark ? '#e4e4e7' : '#44403c'
  const brand = green ? (dark ? '#34d399' : '#059669') : ink
  const buttonBg = green ? '#059669' : dark ? '#3f3f46' : '#1c1917'

  const colorTr = 'transition-colors duration-500 ease-emphasized'

  return (
    <div aria-hidden data-herodemo className="relative mx-auto w-full max-w-[420px]">
      <div
        className={`${styles.aura} pointer-events-none absolute -inset-8 -z-10`}
        style={{
          background:
            'radial-gradient(58% 52% at 50% 28%, rgba(79,70,229,0.09), transparent 72%)',
        }}
      />

      {/* 반영 칩 — 프레임 위 고정 슬롯 (목업 콘텐츠를 절대 가리지 않음) */}
      <div className="mb-2 flex h-7 items-center justify-end">
        {chip && (
          <div
            data-chip
            className={`${styles.chip} inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-2.5 py-1 text-[11px] font-semibold text-white shadow-lg`}
          >
            <Check className="h-3 w-3 text-indigo-300" />
            {chip}
          </div>
        )}
      </div>

      {/* 브라우저 목업 */}
      <div
        className={`overflow-hidden rounded-2xl border border-gray-200/80 shadow-[0_24px_60px_-28px_rgba(17,24,39,0.4)] ${colorTr}`}
        style={{ backgroundColor: surface }}
      >
        <div
          className={`flex items-center gap-2 border-b px-4 py-2.5 ${colorTr}`}
          style={{ backgroundColor: bar, borderColor: border }}
        >
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          </span>
          <span
            className={`ml-1 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium ${colorTr}`}
            style={{
              backgroundColor: dark ? '#18181b' : '#ffffff',
              color: sub,
              boxShadow: `inset 0 0 0 1px ${border}`,
            }}
          >
            <Globe className="h-3 w-3" />
            내가게.kr
          </span>
        </div>

        {/* 콘텐츠 — 슬롯 높이 고정(등장은 opacity/transform, 테마는 color 만) */}
        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <span
              className={`text-[13px] font-extrabold tracking-tight ${colorTr}`}
              style={{ color: brand }}
            >
              모모 커피
            </span>
            <span
              className={`flex gap-2.5 text-[10px] font-medium ${colorTr}`}
              style={{ color: sub }}
            >
              <span>메뉴</span>
              <span>오시는 길</span>
              <span>예약</span>
            </span>
          </div>

          {/* 히어로 사진(따뜻한 그라데이션) — 'image' 단계에서 확대 */}
          <div className="overflow-hidden rounded-xl bg-[#f3e7d6]">
            <div
              className="relative aspect-[16/9] transition-transform duration-700 ease-emphasized will-change-transform"
              style={{ transform: has('image') ? 'scale(1)' : 'scale(0.86)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#e7b27a] via-[#c98a52] to-[#7c4f33]" />
              <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_22%_12%,rgba(255,255,255,0.38),transparent_55%)]" />
              <div className="absolute inset-0 flex flex-col justify-end p-3">
                <span className="text-[15px] font-extrabold leading-tight text-white drop-shadow-sm">
                  오늘도, 모모
                </span>
                <span className="mt-0.5 text-[10px] font-medium text-white/85">
                  방배동 골목 끝 작은 커피집
                </span>
              </div>
            </div>
          </div>

          {/* 메뉴 — 딸기 케이크 슬롯은 자리 고정, 'menuAdd' 때 슬라이드 인 */}
          <div className="space-y-1.5">
            {[
              ['아메리카노', '4,500'],
              ['바닐라 라떼', '5,500'],
              ['오늘의 디저트', '6,000'],
            ].map(([name, price]) => (
              <div
                key={name}
                className="flex items-center justify-between text-[11px]"
              >
                <span className={`font-semibold ${colorTr}`} style={{ color: menuName }}>
                  {name}
                </span>
                <span className={`font-medium ${colorTr}`} style={{ color: sub }}>
                  {price}
                </span>
              </div>
            ))}
            <div className="h-[15px]">
              <div
                className="flex items-center justify-between text-[11px] transition-[opacity,transform] duration-500 ease-emphasized will-change-transform"
                style={{
                  opacity: has('menuAdd') ? 1 : 0,
                  transform: has('menuAdd') ? 'translateX(0)' : 'translateX(-10px)',
                }}
              >
                <span className={`font-semibold ${colorTr}`} style={{ color: menuName }}>
                  딸기 케이크
                </span>
                <span className={`font-medium ${colorTr}`} style={{ color: sub }}>
                  7,000
                </span>
              </div>
            </div>
          </div>

          {/* 예약 버튼 슬롯 — 'cta' 등장, 'green' 때 초록 */}
          <div className="h-9">
            <div
              className="inline-flex h-9 items-center rounded-lg px-4 text-[13px] font-semibold text-white shadow-sm ring-1 ring-inset ring-white/10 transition-[opacity,transform,background-color] duration-500 ease-emphasized will-change-transform"
              style={{
                backgroundColor: buttonBg,
                opacity: has('cta') ? 1 : 0,
                transform: has('cta')
                  ? 'translateY(0) scale(1)'
                  : 'translateY(4px) scale(0.92)',
              }}
            >
              예약하기
            </div>
          </div>

          {/* 후기 슬롯 — 'reviews' 등장 */}
          <div className="h-6">
            <div
              className="flex items-center gap-2 transition-[opacity,transform] duration-500 ease-out will-change-transform"
              style={{
                opacity: has('reviews') ? 1 : 0,
                transform: has('reviews') ? 'translateY(0)' : 'translateY(6px)',
              }}
            >
              <span className="flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
                ))}
              </span>
              <span className={`text-[11px] font-bold ${colorTr}`} style={{ color: ink }}>
                5.0
              </span>
              <span className={`text-[11px] ${colorTr}`} style={{ color: sub }}>
                후기 32
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 채팅 입력 — 지으리의 도구(목업 테마 변화에 영향 없음, 항상 라이트) */}
      <div className="mt-3 flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-2 pl-3.5 shadow-sm">
        <div className="min-w-0 flex-1 truncate text-[14px] text-gray-900">
          {typed ? (
            <>
              <span>{typed}</span>
              <span className={styles.caret} />
            </>
          ) : thinking ? (
            <span className="inline-flex items-center gap-2 align-middle">
              <span className="text-[12.5px] font-medium text-indigo-600">
                지으리가 반영 중
              </span>
              <span className="flex gap-0.5">
                <span className={`${styles.dot} h-1 w-1 rounded-full bg-indigo-500`} />
                <span className={`${styles.dot} ${styles.dot2} h-1 w-1 rounded-full bg-indigo-500`} />
                <span className={`${styles.dot} ${styles.dot3} h-1 w-1 rounded-full bg-indigo-500`} />
              </span>
            </span>
          ) : (
            <span className="text-gray-400">바꾸고 싶은 걸 말해보세요</span>
          )}
        </div>
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <Send className="h-4 w-4" />
        </span>
      </div>
    </div>
  )
}
