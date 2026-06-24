/**
 * 견적 산출 — 위저드 6단계 답변 → 정가/이벤트가 이중 가격 + 기간.
 * AI 사용 X. 순수 규칙 기반 (CLAUDE.md §2-2 — 숨고 1인 시세 기준).
 *
 * 이중 가격:
 *   - 정가(LIST): 평상시 시세
 *   - 이벤트가(EVENT): 선착순 런칭 이벤트 할인가
 *   - EVENT_ACTIVE=false 로 두면 정가만 노출(이벤트 종료 시 상수 하나로 전환).
 *
 * 산식 (정가·이벤트가 각각 동일 구조):
 *   core = base[siteType] × pageMult × rushMult + payment + admin + aiChat
 *   range = core × (1 ± 0.15), 10만원 단위 반올림
 *   ※ 디자인 톤은 가격에 영향 없음 (v2에서 가산 제거)
 */

import type { PageCount, SiteType, Timeline } from '@/app/wizard/lib/state'

/** 런칭 이벤트 — 종료. false = 정가만 노출(할인/이벤트 프레임 없음). */
export const EVENT_ACTIVE = false

export type QuoteFeatures = {
  payment?: boolean
  admin?: boolean
  aiChat?: boolean
}

export type QuoteInput = {
  siteType?: SiteType
  pageCount?: PageCount
  features?: QuoteFeatures
  timeline?: Timeline
}

export type PriceRange = { min: number; max: number; center: number }

export type QuoteBreakdownItem = {
  label: string
  /** 곱하기 multiplier 또는 가산액(만원). multiplier는 '×1.3' 형태. */
  value: string
}

export type QuoteResult = {
  /** 이벤트 진행 중이면 true → 화면에서 정가 취소선 + 이벤트가 강조 */
  eventActive: boolean
  /** 정가 범위 (만원) */
  list: PriceRange
  /** 이벤트가 범위 (만원) */
  event: PriceRange
  /** 하위호환 — 현재 적용가(이벤트 활성 시 이벤트가) 범위. 챗봇·어드민·알림이 사용. */
  priceMinManwon: number
  priceMaxManwon: number
  priceCenterManwon: number
  weeksMin: number
  weeksMax: number
  /** 산출 근거 — 현재 적용가(이벤트 활성 시 이벤트가) 기준 */
  breakdown: QuoteBreakdownItem[]
}

// ── 사이트 유형별 기준가 (만원) — 정가 / 이벤트가. /pricing·챗봇이 이 값 사용. ──
export const LIST_BASE_PRICE_MANWON: Record<SiteType, number> = {
  landing: 80,
  company: 150,
  reservation: 200,
  shop: 250,
  app: 600, // 앱 개발 — 웹 대비 고가. 1인 외주 기준 ballpark(실 단가는 상담 시 조정)
  other: 150, // 기타 — 회사·가게 소개 기준가로 가정(직접입력 내용은 상담 시 조정)
}
export const EVENT_BASE_PRICE_MANWON: Record<SiteType, number> = {
  landing: 50,
  company: 100,
  reservation: 130,
  shop: 150,
  app: 400,
  other: 100,
}

export const SITE_TYPE_LABEL: Record<SiteType, string> = {
  landing: '랜딩페이지',
  company: '회사·가게 소개',
  reservation: '예약·회원제',
  shop: '쇼핑몰',
  app: '앱 개발',
  other: '기타',
}

// ── 추가 기능 가산 (만원) — 정가 / 이벤트가 ──
export const ADDON_MANWON = {
  payment: { list: 50, event: 30 },
  admin: { list: 50, event: 30 },
  aiChat: { list: 150, event: 80 },
} as const

export const ADDON_LABEL: Record<keyof QuoteFeatures, string> = {
  payment: '온라인 결제',
  admin: '관리자 페이지',
  aiChat: 'AI 챗봇·자동화',
}

const PAGE_MULT: Record<PageCount, number> = {
  small: 1.0,
  medium: 1.3,
  large: 1.7,
  unsure: 1.2,
}

const PAGE_LABEL: Record<PageCount, string> = {
  small: '5개 이내',
  medium: '5 ~ 10개',
  large: '10개 이상',
  unsure: '미정',
}

const PAGE_BASE_WEEKS: Record<PageCount, number> = {
  small: 2,
  medium: 3,
  large: 5,
  unsure: 3,
}

export const RUSH_PRICE_MULT = 1.3 // 2주 납기 가산 (디자인 가산은 v2에서 제거)
const RUSH_WEEKS_MULT = 0.7
const PAYMENT_ADDON_WEEKS = 1
const ADMIN_ADDON_WEEKS = 0.5
const AI_ADDON_WEEKS = 2
const PRICE_RANGE_PCT = 0.15

function roundTo10(n: number): number {
  return Math.round(n / 10) * 10
}
function roundTo5(n: number): number {
  return Math.round(n / 5) * 5
}
function roundHalfWeek(n: number): number {
  return Math.round(n * 2) / 2
}

function corePrice(
  base: Record<SiteType, number>,
  tier: 'list' | 'event',
  args: { siteType: SiteType; pageCount: PageCount; isRush: boolean; f: QuoteFeatures },
): number {
  const core =
    base[args.siteType] *
    PAGE_MULT[args.pageCount] *
    (args.isRush ? RUSH_PRICE_MULT : 1.0)
  let addon = 0
  if (args.f.payment) addon += ADDON_MANWON.payment[tier]
  if (args.f.admin) addon += ADDON_MANWON.admin[tier]
  if (args.f.aiChat) addon += ADDON_MANWON.aiChat[tier]
  return core + addon
}

function rangeOf(core: number): PriceRange {
  return {
    // 중심가는 5만원 단위(정가/이벤트가 정확 표기), 범위는 10만원 단위
    min: roundTo10(core * (1 - PRICE_RANGE_PCT)),
    max: roundTo10(core * (1 + PRICE_RANGE_PCT)),
    center: roundTo5(core),
  }
}

export function calculateQuote(input: QuoteInput): QuoteResult {
  const siteType: SiteType = input.siteType ?? 'company'
  const pageCount: PageCount = input.pageCount ?? 'unsure'
  const f: QuoteFeatures = input.features ?? {}
  const isRush = input.timeline === '2w'
  const args = { siteType, pageCount, isRush, f }

  const list = rangeOf(corePrice(LIST_BASE_PRICE_MANWON, 'list', args))
  const event = rangeOf(corePrice(EVENT_BASE_PRICE_MANWON, 'event', args))

  // ── 기간 ──
  let weeks =
    PAGE_BASE_WEEKS[pageCount] +
    (f.payment ? PAYMENT_ADDON_WEEKS : 0) +
    (f.admin ? ADMIN_ADDON_WEEKS : 0) +
    (f.aiChat ? AI_ADDON_WEEKS : 0)
  if (isRush) weeks = Math.max(weeks * RUSH_WEEKS_MULT, 1.5)
  const weeksMin = Math.max(1, roundHalfWeek(weeks - 1))
  const weeksMax = roundHalfWeek(weeks + 1)

  // ── 근거 (현재 적용가 기준) ──
  const tier: 'list' | 'event' = EVENT_ACTIVE ? 'event' : 'list'
  const baseMap = EVENT_ACTIVE ? EVENT_BASE_PRICE_MANWON : LIST_BASE_PRICE_MANWON
  const shown = EVENT_ACTIVE ? event : list
  const breakdown: QuoteBreakdownItem[] = [
    { label: `기준 (${SITE_TYPE_LABEL[siteType]})`, value: `${baseMap[siteType]}만원` },
    { label: `페이지 수 (${PAGE_LABEL[pageCount]})`, value: `×${PAGE_MULT[pageCount]}` },
  ]
  if (isRush)
    breakdown.push({ label: '빠른 납기 (2주 안에)', value: `×${RUSH_PRICE_MULT}` })
  if (f.payment)
    breakdown.push({ label: ADDON_LABEL.payment, value: `+${ADDON_MANWON.payment[tier]}만원` })
  if (f.admin)
    breakdown.push({ label: ADDON_LABEL.admin, value: `+${ADDON_MANWON.admin[tier]}만원` })
  if (f.aiChat)
    breakdown.push({ label: ADDON_LABEL.aiChat, value: `+${ADDON_MANWON.aiChat[tier]}만원` })
  breakdown.push({
    label: EVENT_ACTIVE ? '이벤트가 ±15% 범위' : '합산 후 ±15% 범위',
    value: `${shown.min} ~ ${shown.max}만원`,
  })

  return {
    eventActive: EVENT_ACTIVE,
    list,
    event,
    priceMinManwon: shown.min,
    priceMaxManwon: shown.max,
    priceCenterManwon: shown.center,
    weeksMin,
    weeksMax,
    breakdown,
  }
}

/** 화면 강조 가격 = 이벤트 활성 시 이벤트가, 아니면 정가 */
export function shownPrice(q: QuoteResult): PriceRange {
  return q.eventActive ? q.event : q.list
}

/** "180 ~ 250만원" 포맷 */
export function formatPriceRange(p: PriceRange): string {
  if (p.min === p.max) return `${formatManwon(p.min)}만원`
  return `${formatManwon(p.min)} ~ ${formatManwon(p.max)}만원`
}

export function formatWeeksRange(q: QuoteResult): string {
  if (q.weeksMin === q.weeksMax) return `${formatWeek(q.weeksMin)}주`
  return `${formatWeek(q.weeksMin)} ~ ${formatWeek(q.weeksMax)}주`
}

function formatManwon(n: number): string {
  if (n >= 1000) {
    const t = Math.floor(n / 1000)
    const r = n % 1000
    return r === 0 ? `${t},000` : `${t},${String(r).padStart(3, '0')}`
  }
  return String(n)
}

function formatWeek(n: number): string {
  return n === Math.floor(n) ? String(n) : n.toFixed(1)
}
