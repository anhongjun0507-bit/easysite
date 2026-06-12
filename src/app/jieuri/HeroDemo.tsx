'use client'

import { useEffect, useState } from 'react'
import { Check, Globe, Send, Star } from 'lucide-react'
import styles from './HeroDemo.module.css'

type Effect = 'cta' | 'image' | 'reviews'

const SCENES: { cmd: string; effect: Effect; done: string }[] = [
  { cmd: '예약 버튼 넣어줘', effect: 'cta', done: '예약 버튼 추가' },
  { cmd: '사진 더 크게', effect: 'image', done: '대표 사진 확대' },
  { cmd: '후기 별점도 보여줘', effect: 'reviews', done: '후기 추가' },
]
const ALL: Effect[] = ['cta', 'image', 'reviews']

/**
 * 히어로 시그니처: 채팅으로 말하면 옆 사이트 목업이 단계별로 만들어지는 루프.
 * - 등장/변형은 transform·opacity 만 (슬롯 자리 고정 → layout 흔들림 없음, 모바일 60fps)
 * - prefers-reduced-motion: 완성된 목업을 정적으로 표시(루프·타이핑 없음)
 * - 장식 요소라 root 는 aria-hidden
 */
export function HeroDemo() {
  const [typed, setTyped] = useState('')
  const [active, setActive] = useState<Set<Effect>>(() => new Set(ALL))
  const [chip, setChip] = useState<string | null>(null)
  const [thinking, setThinking] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActive(new Set(ALL))
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
        await wait(900)
        for (const scene of SCENES) {
          if (cancelled) return
          for (let i = 1; i <= scene.cmd.length; i++) {
            if (cancelled) return
            setTyped(scene.cmd.slice(0, i))
            await wait(58)
          }
          await wait(420)
          if (cancelled) return
          setTyped('')
          setThinking(true)
          await wait(640)
          if (cancelled) return
          setThinking(false)
          setActive((prev) => new Set(prev).add(scene.effect))
          setChip(scene.done)
          await wait(1500)
          if (cancelled) return
          setChip(null)
          await wait(280)
        }
        await wait(1500)
      }
    }
    void loop()
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [])

  const has = (e: Effect) => active.has(e)

  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[420px]">
      <div
        className={`${styles.aura} pointer-events-none absolute -inset-8 -z-10`}
        style={{
          background:
            'radial-gradient(58% 52% at 50% 28%, rgba(79,70,229,0.09), transparent 72%)',
        }}
      />

      {/* 브라우저 목업 */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_24px_60px_-28px_rgba(17,24,39,0.4)]">
        <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/80 px-4 py-2.5">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          </span>
          <span className="ml-1 inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-[11px] font-medium text-gray-400 ring-1 ring-gray-200">
            <Globe className="h-3 w-3" />
            내가게.kr
          </span>
        </div>

        {/* 슬롯 자리 고정 — 등장은 opacity/scale 만 */}
        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <div className="h-3 w-16 rounded bg-gray-900/85" />
            <div className="flex gap-1.5">
              <div className="h-2.5 w-8 rounded bg-gray-200" />
              <div className="h-2.5 w-8 rounded bg-gray-200" />
              <div className="h-2.5 w-8 rounded bg-gray-200" />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200">
            <div
              className="flex aspect-[16/9] items-center justify-center transition-transform duration-700 ease-emphasized will-change-transform"
              style={{ transform: has('image') ? 'scale(1)' : 'scale(0.86)' }}
            >
              <div className="h-9 w-9 rounded-lg bg-white/70 ring-1 ring-black/5" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-3.5 w-2/3 rounded bg-gray-900/80" />
            <div className="h-2.5 w-full rounded bg-gray-200" />
            <div className="h-2.5 w-4/5 rounded bg-gray-200" />
          </div>

          {/* 예약 버튼 슬롯(높이 고정) */}
          <div className="h-9">
            <div
              className="inline-flex h-9 items-center rounded-lg bg-indigo-600 px-4 text-[13px] font-semibold text-white shadow-sm transition-[opacity,transform] duration-500 ease-emphasized will-change-transform"
              style={{
                opacity: has('cta') ? 1 : 0,
                transform: has('cta')
                  ? 'translateY(0) scale(1)'
                  : 'translateY(4px) scale(0.92)',
              }}
            >
              예약하기
            </div>
          </div>

          {/* 후기 슬롯(높이 고정) */}
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
              <span className="text-[11px] font-bold text-gray-700">5.0</span>
              <span className="h-2 w-14 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>

      {/* 반영 칩 */}
      <div className="pointer-events-none absolute right-3 top-12 h-7">
        {chip && (
          <div
            className={`${styles.chip} inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-2.5 py-1 text-[11px] font-semibold text-white shadow-lg`}
          >
            <Check className="h-3 w-3 text-indigo-300" />
            {chip}
          </div>
        )}
      </div>

      {/* 채팅 입력 */}
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
