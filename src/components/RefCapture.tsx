'use client'

import { useEffect } from 'react'
import { REF_COOKIE, REF_MAX_AGE, sanitizeRef } from '@/lib/tracking/ref'
import { captureMarketingParams } from '@/lib/tracking/marketing'

/**
 * 유입 출처 캡처 — URL 의 ?ref= 값을 쿠키(es_ref)+sessionStorage 에 저장한다.
 * 숨고 등에서 `?ref=soomgo` 링크로 들어오면, 이후 상담/위저드 제출 시
 * 서버 액션이 쿠키를 읽어 leads.source 에 기록한다. 화면엔 아무것도 그리지 않음.
 * 함께 광고 클릭 식별자(gclid)·utm_* 도 보존(captureMarketingParams) → 폼 제출 시 leads 에 기록.
 */
export function RefCapture() {
  useEffect(() => {
    try {
      const ref = sanitizeRef(
        new URLSearchParams(window.location.search).get('ref'),
      )
      if (ref) {
        document.cookie = `${REF_COOKIE}=${ref}; path=/; max-age=${REF_MAX_AGE}; samesite=lax`
        window.sessionStorage.setItem(REF_COOKIE, ref)
      }
    } catch {
      // 추적 실패는 조용히 무시 — 사용자 경험에 영향 X
    }
    // gclid·utm_* 보존(자체 try/catch) — ref 유무와 독립적으로 항상 시도
    captureMarketingParams()
  }, [])
  return null
}
