// 광고 클릭 식별자(gclid) + utm_* 캠페인 파라미터 보존.
// RefCapture 가 첫 진입 시 URL 에서 읽어 sessionStorage(es_mkt)에 저장하고,
// 상담 폼 제출 시 이 값을 서버 액션으로 함께 보내 leads.features.marketing 에 기록한다.
// → 광고로 들어온 리드의 클릭을 구글애즈 전환과 사후 대조할 수 있게 한다(오프라인 전환 보정 등).

export const MARKETING_KEYS = [
  'gclid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const

export type MarketingKey = (typeof MARKETING_KEYS)[number]
export type MarketingParams = Partial<Record<MarketingKey, string>>

const STORAGE_KEY = 'es_mkt'
const MAX_LEN = 200 // 값 길이 상한 — 비정상적으로 긴 주입 방어

/**
 * 클라이언트: 현재 URL 의 gclid·utm_* 를 sessionStorage 에 보존한다.
 * 전환되는 "마지막 클릭"이 기준이 되도록, URL 에 값이 있으면 최신 값으로 덮어쓴다.
 * 화면에 영향 없음. 실패는 조용히 무시.
 */
export function captureMarketingParams(): void {
  if (typeof window === 'undefined') return
  try {
    const sp = new URLSearchParams(window.location.search)
    const next: MarketingParams = { ...readMarketingParams() }
    let changed = false
    for (const k of MARKETING_KEYS) {
      const v = sp.get(k)
      if (v) {
        next[k] = v.slice(0, MAX_LEN)
        changed = true
      }
    }
    if (changed) window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // sessionStorage 접근 불가 등 — 추적 실패는 사용자 경험에 영향 없음
  }
}

/** 클라이언트: 보존된 마케팅 파라미터를 읽는다(없으면 빈 객체). */
export function readMarketingParams(): MarketingParams {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? (parsed as MarketingParams) : {}
  } catch {
    return {}
  }
}

/**
 * 서버: 클라이언트가 보낸(=신뢰 불가) 값에서 허용 키만 추려 정제한다.
 * 문자열·trim·길이 제한만 적용하고 화이트리스트 외 키는 버린다.
 */
export function sanitizeMarketing(input: unknown): MarketingParams {
  if (!input || typeof input !== 'object') return {}
  const src = input as Record<string, unknown>
  const out: MarketingParams = {}
  for (const k of MARKETING_KEYS) {
    const v = src[k]
    if (typeof v === 'string') {
      const clean = v.trim().slice(0, MAX_LEN)
      if (clean) out[k] = clean
    }
  }
  return out
}

/** 텔레그램·로그용 한 줄 요약 — 값이 없으면 null. */
export function formatMarketing(m: MarketingParams): string | null {
  const parts = MARKETING_KEYS.filter((k) => m[k]).map((k) => `${k}=${m[k]}`)
  return parts.length ? parts.join(' · ') : null
}
