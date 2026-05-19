/**
 * 견적·기간 산출 로직 — 위저드 8단계 답변을 입력으로 받아 가격 범위와 기간 범위를 계산.
 * AI 사용 X. 순수 규칙 기반 (CLAUDE.md §2-2 — 숨고 1인 시세 기준).
 *
 * 산식:
 *   base = baseBySiteType
 *   priceCore = base × pageMult × designMult × timelineMult + paymentAddon + aiAddon
 *   range = priceCore × (1 ± 0.15)
 *
 *   weeks = pageBaseWeeks + paymentWeeks + aiWeeks + luxuryWeeks
 *   timeline 2w 옵션 시 weeks × 0.7 (최소 1.5주)
 *   minWeeks/maxWeeks = weeks ± 1 (최소 1주)
 */

import type {
  DesignTone,
  PageCount,
  SiteType,
  Timeline,
  YesNoUnsure,
} from '@/app/wizard/lib/state'

export type QuoteInput = {
  siteType?: SiteType
  pageCount?: PageCount
  payment?: YesNoUnsure
  aiChatNeeded?: boolean | 'unsure'
  designTone?: DesignTone
  timeline?: Timeline
}

export type QuoteBreakdownItem = {
  label: string
  /** 곱하기 multiplier 또는 가산액(만원). multiplier는 'x1.3' 형태 라벨로. */
  value: string
}

export type QuoteResult = {
  /** 가격 범위 (만원 단위) */
  priceMinManwon: number
  priceMaxManwon: number
  /** 중심가 (만원 단위, 반올림) */
  priceCenterManwon: number
  /** 기간 범위 (주) */
  weeksMin: number
  weeksMax: number
  /** 산출 근거 — UI 토글에 그대로 표시 */
  breakdown: QuoteBreakdownItem[]
}

/**
 * 사이트 유형별 기준가 (만원) — 숨고 1인 시세.
 * /pricing 가격표가 이 값을 import하므로, 가격을 바꿀 때 여기 한 곳만 수정.
 */
export const BASE_PRICE_MANWON: Record<SiteType, number> = {
  landing: 100,
  company: 200,
  reservation: 350,
  shop: 450,
  other: 200,
}

export const SITE_TYPE_LABEL: Record<SiteType, string> = {
  landing: '랜딩페이지',
  company: '회사·가게 소개',
  reservation: '예약·회원제',
  shop: '쇼핑몰',
  other: '기타',
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

/** /pricing 옵션 가산표가 이 값들을 import. 변경 시 한 곳만 수정. */
export const PAYMENT_ADDON_MANWON = 80
export const AI_ADDON_MANWON = 150
const PAYMENT_ADDON_WEEKS = 1
const AI_ADDON_WEEKS = 2
const LUXURY_ADDON_WEEKS = 0.5
export const LUXURY_MULT = 1.2
export const RUSH_PRICE_MULT = 1.3 // 2주 납기 가산
const RUSH_WEEKS_MULT = 0.7
const PRICE_RANGE_PCT = 0.15

function roundTo10(n: number): number {
  return Math.round(n / 10) * 10
}

function roundHalfWeek(n: number): number {
  return Math.round(n * 2) / 2
}

export function calculateQuote(input: QuoteInput): QuoteResult {
  const siteType: SiteType = input.siteType ?? 'company'
  const pageCount: PageCount = input.pageCount ?? 'unsure'
  const isPayment = input.payment === 'yes'
  const isAi = input.aiChatNeeded === true
  const isLuxury = input.designTone === 'luxury'
  const isRush = input.timeline === '2w'

  // ── 가격 ──────────────────────────────────────────
  const base = BASE_PRICE_MANWON[siteType]
  const pageMult = PAGE_MULT[pageCount]
  const designMult = isLuxury ? LUXURY_MULT : 1.0
  const timelineMult = isRush ? RUSH_PRICE_MULT : 1.0
  const paymentAddon = isPayment ? PAYMENT_ADDON_MANWON : 0
  const aiAddon = isAi ? AI_ADDON_MANWON : 0

  const priceCore = base * pageMult * designMult * timelineMult + paymentAddon + aiAddon
  const priceMin = roundTo10(priceCore * (1 - PRICE_RANGE_PCT))
  const priceMax = roundTo10(priceCore * (1 + PRICE_RANGE_PCT))
  const priceCenter = roundTo10(priceCore)

  // ── 기간 ──────────────────────────────────────────
  const pageWeeks = PAGE_BASE_WEEKS[pageCount]
  const paymentWeeks = isPayment ? PAYMENT_ADDON_WEEKS : 0
  const aiWeeks = isAi ? AI_ADDON_WEEKS : 0
  const luxuryWeeks = isLuxury ? LUXURY_ADDON_WEEKS : 0
  let weeks = pageWeeks + paymentWeeks + aiWeeks + luxuryWeeks
  if (isRush) {
    weeks = Math.max(weeks * RUSH_WEEKS_MULT, 1.5)
  }
  const weeksMin = Math.max(1, roundHalfWeek(weeks - 1))
  const weeksMax = roundHalfWeek(weeks + 1)

  // ── 근거 ──────────────────────────────────────────
  const breakdown: QuoteBreakdownItem[] = [
    { label: `기준 (${SITE_TYPE_LABEL[siteType]})`, value: `${base}만원` },
    { label: `페이지 수 (${PAGE_LABEL[pageCount]})`, value: `×${pageMult}` },
  ]
  if (isLuxury) breakdown.push({ label: '럭셔리 디자인 톤', value: `×${LUXURY_MULT}` })
  if (isRush)
    breakdown.push({
      label: '빠른 납기 (2주 안에)',
      value: `×${RUSH_PRICE_MULT}`,
    })
  if (isPayment)
    breakdown.push({ label: '결제 기능', value: `+${PAYMENT_ADDON_MANWON}만원` })
  if (isAi) breakdown.push({ label: 'AI 챗봇·자동화', value: `+${AI_ADDON_MANWON}만원` })
  breakdown.push({
    label: '합산 후 ±15% 범위',
    value: `${priceMin} ~ ${priceMax}만원`,
  })

  return {
    priceMinManwon: priceMin,
    priceMaxManwon: priceMax,
    priceCenterManwon: priceCenter,
    weeksMin,
    weeksMax,
    breakdown,
  }
}

/** "180~250만원" 같은 한국어 포맷 */
export function formatPriceRange(q: QuoteResult): string {
  if (q.priceMinManwon === q.priceMaxManwon) {
    return `${formatManwon(q.priceMinManwon)}만원`
  }
  return `${formatManwon(q.priceMinManwon)} ~ ${formatManwon(q.priceMaxManwon)}만원`
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
