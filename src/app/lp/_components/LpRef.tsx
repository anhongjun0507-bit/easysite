'use client'

import { useEffect } from 'react'
import { REF_COOKIE, REF_MAX_AGE, sanitizeRef } from '@/lib/tracking/ref'

/**
 * 광고 랜딩 유입을 leads.source 에 태깅하기 위한 기본 ref 세터.
 * - URL 에 ?ref= 가 있으면 그쪽(RefCapture)이 우선 → 아무것도 안 함.
 * - 이미 ref 쿠키가 있으면 유지(앞선 캠페인 출처 보존).
 * - 둘 다 없을 때만 기본값(lpweb/lpapp)을 심어, LP 출처 리드를 구분한다.
 */
export function LpRef({ source }: { source: string }) {
  useEffect(() => {
    try {
      const fromUrl = new URLSearchParams(window.location.search).get('ref')
      if (sanitizeRef(fromUrl)) return // 명시적 ref 는 RefCapture 가 처리
      if (document.cookie.includes(`${REF_COOKIE}=`)) return
      const ref = sanitizeRef(source)
      if (!ref) return
      document.cookie = `${REF_COOKIE}=${ref}; path=/; max-age=${REF_MAX_AGE}; samesite=lax`
      window.sessionStorage.setItem(REF_COOKIE, ref)
    } catch {
      // 추적 실패는 조용히 무시
    }
  }, [source])
  return null
}
