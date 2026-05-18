'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { aiCopyResultSchema, type AiCopyResult } from '@/lib/ai/types'

type Props = {
  leadId: string
  /** SSR에서 미리 불러온 캐시 결과 — null이면 client에서 fetch */
  initial: AiCopyResult | null
  userDesignTone?: string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

const LOADING_MESSAGES: Array<{ untilMs: number; text: string }> = [
  { untilMs: 5_000, text: 'AI가 사장님 사이트 구조를 만들고 있어요…' },
  { untilMs: 15_000, text: '거의 다 됐어요. 조금만 기다려주세요…' },
  { untilMs: 25_000, text: 'AI가 마지막 손질 중이에요…' },
  { untilMs: Infinity, text: '곧 결과가 도착해요…' },
]

const ABOUT_DRAFT_LS_KEY = (leadId: string) => `easysite-about-draft-${leadId}`
const FAVORITE_COPY_LS_KEY = (leadId: string) =>
  `easysite-hero-favorite-${leadId}`

export function AISection({ leadId, initial }: Props) {
  const [status, setStatus] = useState<Status>(initial ? 'success' : 'idle')
  const [data, setData] = useState<AiCopyResult | null>(initial)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [favoriteIdx, setFavoriteIdx] = useState<number | null>(null)
  const [aboutDraft, setAboutDraft] = useState<string>('')
  const [loadingMsg, setLoadingMsg] = useState<string>(LOADING_MESSAGES[0].text)
  const aboutSaveTimer = useRef<number | null>(null)
  const fetchRequested = useRef(false)

  const fetchAI = useCallback(
    async (force: boolean) => {
      setStatus('loading')
      setErrorMsg(null)
      try {
        const res = await fetch('/api/ai/generate-copy', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ leadId, force }),
        })
        const json = (await res.json()) as
          | { ok: true; result: unknown }
          | { ok: false; error: string }
        if (!json.ok) {
          setErrorMsg(json.error || 'AI 결과를 못 받았어요')
          setStatus('error')
          return
        }
        const parsed = aiCopyResultSchema.safeParse(json.result)
        if (!parsed.success) {
          setErrorMsg('AI 결과 형식이 맞지 않아요')
          setStatus('error')
          return
        }
        setData(parsed.data)
        setAboutDraft(parsed.data.aboutDraft)
        setStatus('success')
      } catch {
        setErrorMsg('AI 호출에 실패했어요. 잠시 후 다시 시도해 주세요.')
        setStatus('error')
      }
    },
    [leadId],
  )

  // 초기 캐시 — about/favorite localStorage 복원
  useEffect(() => {
    if (!initial) return
    setAboutDraft(initial.aboutDraft)
    try {
      const cached = localStorage.getItem(ABOUT_DRAFT_LS_KEY(leadId))
      if (cached && cached.trim()) setAboutDraft(cached)
      const fav = localStorage.getItem(FAVORITE_COPY_LS_KEY(leadId))
      if (fav !== null) {
        const n = Number(fav)
        if (Number.isInteger(n) && n >= 0 && n < initial.heroCopy.length) {
          setFavoriteIdx(n)
        }
      }
    } catch {
      // localStorage 접근 실패 — 무시
    }
  }, [initial, leadId])

  // 마운트 시 캐시 없으면 AI 호출
  useEffect(() => {
    if (initial) return
    if (fetchRequested.current) return
    fetchRequested.current = true
    fetchAI(false)
  }, [initial, fetchAI])

  // 로딩 중 메시지 갱신 (1초마다 elapsed 체크)
  useEffect(() => {
    if (status !== 'loading') return
    const start = Date.now()
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - start
      const m = LOADING_MESSAGES.find((m) => elapsed < m.untilMs)
      if (m) setLoadingMsg(m.text)
    }, 1000)
    return () => window.clearInterval(interval)
  }, [status])

  // About textarea debounce 1초 localStorage 저장
  const onAboutChange = (v: string) => {
    setAboutDraft(v)
    if (aboutSaveTimer.current) window.clearTimeout(aboutSaveTimer.current)
    aboutSaveTimer.current = window.setTimeout(() => {
      try {
        localStorage.setItem(ABOUT_DRAFT_LS_KEY(leadId), v)
      } catch {
        // ignore
      }
    }, 1000)
  }

  const onPickFavorite = (idx: number) => {
    setFavoriteIdx(idx)
    try {
      localStorage.setItem(FAVORITE_COPY_LS_KEY(leadId), String(idx))
    } catch {
      // ignore
    }
  }

  return (
    <section className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-16">
        <div className="text-center">
          <p className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold tracking-[0.12em] text-indigo-700">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1.5 h-3.5 w-3.5"
              aria-hidden="true"
            >
              <path d="M12 3l1.9 4.8L19 9.9l-4.7 2.1L12 17l-2.3-5L5 9.9l5.1-2.1z" />
            </svg>
            AI 초안
          </p>
          <h2
            className="mt-4 font-extrabold text-gray-900"
            style={{
              fontSize: 'clamp(24px, 4.5vw, 34px)',
              lineHeight: 1.25,
              letterSpacing: '-0.015em',
            }}
          >
            AI가 사장님 사이트를 만들어봤어요
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
            지금 보여드리는 건 초안이에요. 마음대로 골라보시고 수정해보세요.
            정식 시안은 운영자가 만들어드려요.
          </p>
        </div>

        {status === 'loading' && <LoadingState message={loadingMsg} />}
        {status === 'error' && (
          <ErrorState message={errorMsg} onRetry={() => fetchAI(true)} />
        )}
        {status === 'success' && data && (
          <div className="mt-10 space-y-8 sm:mt-12 sm:space-y-10">
            <MenuStructureCard items={data.menuStructure} />
            <HeroCopyCard
              items={data.heroCopy}
              favoriteIdx={favoriteIdx}
              onPick={onPickFavorite}
            />
            <AboutDraftCard
              value={aboutDraft}
              onChange={onAboutChange}
              originalValue={data.aboutDraft}
            />
            <ColorsCard items={data.colors} />
          </div>
        )}
      </div>
    </section>
  )
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-8 sm:p-10">
      <div className="flex items-center justify-center gap-3">
        <svg
          aria-hidden="true"
          className="h-5 w-5 animate-spin text-indigo-600"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            opacity="0.25"
          />
          <path
            d="M22 12a10 10 0 0 1-10 10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <p className="text-sm font-medium text-gray-700 sm:text-base">{message}</p>
      </div>
      <div className="mt-6 space-y-3" aria-hidden="true">
        <Skeleton h="h-7" w="w-1/2" />
        <Skeleton h="h-4" w="w-full" />
        <Skeleton h="h-4" w="w-5/6" />
        <Skeleton h="h-4" w="w-2/3" />
      </div>
    </div>
  )
}

function Skeleton({ h, w }: { h: string; w: string }) {
  return (
    <div
      className={`${h} ${w} animate-pulse rounded-md bg-gray-200`}
      aria-hidden="true"
    />
  )
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string | null
  onRetry: () => void
}) {
  return (
    <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-7 text-center sm:p-9">
      <p className="text-sm font-semibold text-amber-900 sm:text-base">
        {message ?? 'AI 결과를 못 받았어요'}
      </p>
      <p className="mt-2 text-xs text-amber-800 sm:text-sm">
        견적·기간은 위 정상 표시돼요. AI 초안은 잠시 후 다시 시도해 주세요.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-gray-900 px-5 text-sm font-semibold text-white transition hover:bg-gray-700"
      >
        다시 만들기
      </button>
    </div>
  )
}

function MenuStructureCard({
  items,
}: {
  items: AiCopyResult['menuStructure']
}) {
  return (
    <Card>
      <CardHeading prefix="1" title="추천 메뉴 구조" />
      <div className="mt-5 flex flex-wrap gap-2">
        {items.map((m) => (
          <span
            key={m.label}
            title={m.description}
            className="inline-flex h-10 items-center rounded-full border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-800"
          >
            {m.label}
          </span>
        ))}
      </div>
      <ul className="mt-5 grid grid-cols-1 gap-2.5 text-sm text-gray-600 sm:grid-cols-2">
        {items.map((m) => (
          <li
            key={m.label}
            className="flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2.5"
          >
            <span className="mt-0.5 inline-flex h-5 shrink-0 items-center justify-center rounded bg-white px-1.5 text-[11px] font-bold text-gray-700 ring-1 ring-gray-200">
              {m.label}
            </span>
            <span className="leading-relaxed">{m.description}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

function HeroCopyCard({
  items,
  favoriteIdx,
  onPick,
}: {
  items: AiCopyResult['heroCopy']
  favoriteIdx: number | null
  onPick: (idx: number) => void
}) {
  return (
    <Card>
      <CardHeading
        prefix="2"
        title="첫 화면 카피 3안"
        helper="마음에 드는 거 골라주세요. 운영자에게 전달돼요."
      />
      <div className="mt-5 grid gap-3">
        {items.map((c, i) => {
          const picked = favoriteIdx === i
          return (
            <button
              key={i}
              type="button"
              onClick={() => onPick(i)}
              className={`group flex items-start gap-3 rounded-xl border-2 px-4 py-4 text-left transition sm:px-5 sm:py-5 ${
                picked
                  ? 'border-indigo-600 bg-indigo-50/80 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span
                aria-hidden="true"
                className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  picked
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {picked ? '✓' : i + 1}
              </span>
              <div className="flex-1">
                <p className="text-base font-bold leading-snug text-gray-900 sm:text-lg">
                  {c.headline}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600 sm:text-[15px]">
                  {c.subhead}
                </p>
                <p className="mt-2 inline-flex items-center text-[11px] font-medium uppercase tracking-wider text-gray-500">
                  분위기 · {c.tone}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </Card>
  )
}

function AboutDraftCard({
  value,
  onChange,
  originalValue,
}: {
  value: string
  onChange: (v: string) => void
  originalValue: string
}) {
  const dirty = value !== originalValue
  return (
    <Card>
      <CardHeading
        prefix="3"
        title="회사 소개 초안"
        helper="자유롭게 다듬어보세요. 이 화면에서만 저장돼요 (같은 기기에서 다시 오면 복원)."
      />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        maxLength={500}
        className="mt-4 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-base leading-relaxed text-gray-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
      />
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <span>{value.length} / 500자</span>
        {dirty && <span className="text-indigo-600">✓ 수정됨 (이 기기에 저장됨)</span>}
      </div>
      {dirty && (
        <button
          type="button"
          onClick={() => onChange(originalValue)}
          className="mt-3 text-xs font-medium text-gray-500 underline-offset-2 hover:text-gray-700 hover:underline"
        >
          처음 AI 초안으로 되돌리기
        </button>
      )}
    </Card>
  )
}

function ColorsCard({ items }: { items: AiCopyResult['colors'] }) {
  const recommended = items.findIndex((c) => c.recommended)
  return (
    <Card>
      <CardHeading
        prefix="4"
        title="추천 컬러"
        helper="선택하신 톤이 첫번째예요. 다른 톤도 같이 보여드려요."
      />
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {items.map((c, i) => {
          const isRecommended = i === recommended
          return (
            <div
              key={`${c.name}-${i}`}
              className={`rounded-xl border-2 p-4 transition ${
                isRecommended
                  ? 'border-indigo-600 bg-white shadow-sm'
                  : 'border-gray-200 bg-gray-50 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between">
                <p
                  className={`text-sm font-bold ${
                    isRecommended ? 'text-indigo-900' : 'text-gray-700'
                  }`}
                >
                  {c.name}
                </p>
                {isRecommended && (
                  <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    추천
                  </span>
                )}
              </div>
              <div className="mt-3 flex h-14 overflow-hidden rounded-lg ring-1 ring-gray-200">
                <Swatch color={c.primary} label="Primary" />
                <Swatch color={c.secondary} label="Secondary" />
                <Swatch color={c.accent} label="Accent" />
              </div>
              <ul className="mt-3 space-y-1 text-[11px] text-gray-600">
                <li>
                  <span className="font-mono">{c.primary}</span> 메인
                </li>
                <li>
                  <span className="font-mono">{c.secondary}</span> 보조
                </li>
                <li>
                  <span className="font-mono">{c.accent}</span> 강조
                </li>
              </ul>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <div
      className="flex-1"
      style={{ backgroundColor: color }}
      title={`${label} ${color}`}
      aria-label={`${label} ${color}`}
    />
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      {children}
    </div>
  )
}

function CardHeading({
  prefix,
  title,
  helper,
}: {
  prefix: string
  title: string
  helper?: string
}) {
  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
          {prefix}
        </span>
        <h3 className="text-lg font-bold text-gray-900 sm:text-xl">{title}</h3>
      </div>
      {helper && (
        <p className="mt-2 text-sm leading-relaxed text-gray-600">{helper}</p>
      )}
    </div>
  )
}
