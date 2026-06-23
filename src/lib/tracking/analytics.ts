// 광고·분석 측정 — GA4 + 구글애즈 전환 + 네이버(프리미엄 로그분석) 전환.
//
// 모든 ID는 NEXT_PUBLIC_* 환경변수로 주입한다. 값이 없으면 해당 추적은 자동으로
// 비활성(무동작)되므로, 키를 넣기 전까지는 사이트 동작에 전혀 영향이 없다.
//   - 광고 시작 시: Vercel 환경변수에 아래 값들을 넣고 재배포만 하면 켜진다.
//   - 스크립트 로드는 components/Analytics.tsx 가 담당한다.

/** 전환 액션 이름 — 광고 최적화의 기준이 되는 핵심 행동 */
export type ConversionName = 'quote' | 'register'

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '' // GA4 측정 ID (G-XXXXXXXXXX)
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || '' // 구글애즈 ID (AW-XXXXXXXXX)
export const NAVER_WCS_ID = process.env.NEXT_PUBLIC_NAVER_WCS_ID || '' // 네이버 프리미엄 로그분석 ID

// 구글애즈 전환 라벨(send_to) — 액션별로 구글애즈에서 발급받아 통째로 넣는다.
//   예: "AW-123456789/AbC-D_efGh1234"
const GOOGLE_ADS_CONVERSIONS: Record<ConversionName, string> = {
  quote: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONV_QUOTE || '',
  register: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONV_REGISTER || '',
}

// 네이버 전환 유형 코드 — 광고관리시스템에서 설정한 값과 맞춰야 한다.
//   1=회원가입 2=신청/예약 3=구매완료 4=장바구니 5=기타
const NAVER_CONV_TYPE: Record<ConversionName, string> = {
  quote: '2', // 견적 신청
  register: '1', // 사전등록(회원가입 성격)
}

/** gtag.js 로더에 쓸 대표 ID — GA4 우선, 없으면 구글애즈 ID */
export const GA_GTAG_ID = GA_ID || GOOGLE_ADS_ID
export const HAS_GTAG = Boolean(GA_ID || GOOGLE_ADS_ID)
export const HAS_NAVER = Boolean(NAVER_WCS_ID)
export const ANALYTICS_ENABLED = HAS_GTAG || HAS_NAVER

type GtagFn = (...args: unknown[]) => void

declare global {
  interface Window {
    gtag?: GtagFn
    dataLayer?: unknown[]
    wcs?: { cnv: (type: string, value: string) => string; inflow?: (host?: string) => void }
    wcs_add?: Record<string, string>
    wcs_do?: (nasa?: Record<string, string>) => void
  }
}

function gtag(...args: unknown[]) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag(...args)
}

/** 네이버 페이지뷰 — wa 계정 세팅 후 wcs_do() 호출 */
export function naverPageview() {
  if (typeof window === 'undefined' || !HAS_NAVER) return
  try {
    window.wcs_add = window.wcs_add || {}
    window.wcs_add['wa'] = NAVER_WCS_ID
    if (typeof window.wcs_do === 'function') window.wcs_do()
  } catch {
    // 추적 실패는 사용자 경험에 영향 없음 — 조용히 무시
  }
}

/** SPA 라우트 변경 시 페이지뷰 — GA4 + 네이버 모두 재전송 */
export function pageview(url: string) {
  if (typeof window === 'undefined') return
  if (GA_ID) gtag('event', 'page_view', { page_location: url })
  naverPageview()
}

/** 임의 이벤트(GA4) — 분석/오디언스용 */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!GA_ID) return
  gtag('event', name, params || {})
}

/**
 * 전환 — 구글애즈 + 네이버에 동시에 보낸다(설정된 채널만).
 * dedupeKey 를 주면 같은 키로는 세션 내 1회만 전송(새로고침 중복 방지).
 */
export function trackConversion(
  name: ConversionName,
  opts?: { value?: number; dedupeKey?: string },
) {
  if (typeof window === 'undefined') return

  if (opts?.dedupeKey) {
    const k = `cv:${name}:${opts.dedupeKey}`
    try {
      if (window.sessionStorage.getItem(k)) return
      window.sessionStorage.setItem(k, '1')
    } catch {
      // sessionStorage 차단 환경 — 중복 방지만 포기하고 전송은 진행
    }
  }

  // 1) 구글애즈 전환
  const sendTo = GOOGLE_ADS_CONVERSIONS[name]
  if (sendTo) {
    gtag('event', 'conversion', {
      send_to: sendTo,
      ...(opts?.value != null ? { value: opts.value, currency: 'KRW' } : {}),
    })
  }

  // 2) GA4 전환 이벤트(분석·오디언스용) — GA4 콘솔에서 '전환'으로 표시 가능
  trackEvent(`cv_${name}`, opts?.value != null ? { value: opts.value } : undefined)

  // 3) 네이버 전환
  if (HAS_NAVER) {
    try {
      const nasa: Record<string, string> = {}
      if (window.wcs) {
        nasa['cnv'] = window.wcs.cnv(NAVER_CONV_TYPE[name], String(opts?.value ?? ''))
      }
      if (typeof window.wcs_do === 'function') window.wcs_do(nasa)
    } catch {
      // 무시
    }
  }
}
