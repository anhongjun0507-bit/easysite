'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import {
  GA_ID,
  GOOGLE_ADS_ID,
  GA_GTAG_ID,
  HAS_GTAG,
  HAS_NAVER,
  NAVER_WCS_ID,
  pageview,
  trackEvent,
} from '@/lib/tracking/analytics'

/**
 * 광고·분석 스크립트 로더 + SPA 페이지뷰 추적 + tel: 클릭 이벤트.
 * 측정 ID(env)가 하나도 없으면 아무 스크립트도 로드하지 않는다(완전 무동작).
 * RefCapture 와 함께 layout 의 <body> 에 마운트된다.
 */
export function Analytics() {
  const pathname = usePathname()
  const first = useRef(true)

  // 라우트 변경 시 페이지뷰 — 최초 로드는 gtag config / 네이버 onLoad 가 이미 보냄
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    pageview(window.location.href)
  }, [pathname])

  // tel: 링크 클릭을 '전화 문의' 이벤트로 기록 (위임 리스너 — 위치 무관하게 잡힘)
  useEffect(() => {
    if (!HAS_GTAG) return
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null
      if (target?.closest?.('a[href^="tel:"]')) trackEvent('tel_click')
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  return (
    <>
      {HAS_GTAG && (
        <>
          <Script
            id="gtag-src"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_GTAG_ID}`}
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              ${GA_ID ? `gtag('config', '${GA_ID}');` : ''}
              ${GOOGLE_ADS_ID ? `gtag('config', '${GOOGLE_ADS_ID}');` : ''}
            `}
          </Script>
        </>
      )}

      {HAS_NAVER && (
        <Script
          id="naver-wcs"
          strategy="afterInteractive"
          src="//wcs.naver.net/wcslog.js"
          onLoad={() => {
            try {
              window.wcs_add = window.wcs_add || {}
              window.wcs_add['wa'] = NAVER_WCS_ID
              if (window.wcs && typeof window.wcs.inflow === 'function') {
                window.wcs.inflow()
              }
              if (typeof window.wcs_do === 'function') window.wcs_do()
            } catch {
              // 무시
            }
          }}
        />
      )}
    </>
  )
}
