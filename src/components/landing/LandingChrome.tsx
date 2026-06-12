'use client'

import { usePathname, useSelectedLayoutSegments } from 'next/navigation'
import { BackToTop } from './BackToTop'
import { FloatingContact } from './FloatingContact'
import { Footer } from './Footer'
import { Header } from './Header'

/**
 * Wizard 진입 시 헤더·푸터·플로팅을 모두 숨김 — 풀스크린 multi-step 경험.
 * 일반 페이지에선 그대로 노출.
 */
export function LandingChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const segments = useSelectedLayoutSegments()
  // /jieuri 는 별도 브랜드(jieuri.com) — 자체 헤더/푸터를 직접 렌더하므로 EasySite 크롬을 비운다.
  // jieuri.com 호스트에선 미들웨어가 / → /jieuri 로 rewrite → URL(usePathname)은 '/'지만
  // 실제 렌더된 세그먼트는 'jieuri'. 그래서 경로가 아니라 렌더 세그먼트로 판별해야 헤더가 안 샌다.
  const isJieuri = segments[0] === 'jieuri'

  if (isJieuri) {
    return <>{children}</>
  }

  // /wizard·/admin·/pay 영역은 풀스크린 — 랜딩 헤더/푸터·플로팅 모두 숨김.
  // 단 /wizard/result는 헤더 다시 노출 (Day 4 결정).
  const isWizardForm =
    (pathname?.startsWith('/wizard') ?? false) &&
    !(pathname?.startsWith('/wizard/result') ?? false)
  const isAdmin = pathname?.startsWith('/admin') ?? false
  const isPay = pathname?.startsWith('/pay') ?? false

  if (isWizardForm || isAdmin || isPay) {
    return <main className="flex-1">{children}</main>
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingContact />
      <BackToTop />
    </>
  )
}
