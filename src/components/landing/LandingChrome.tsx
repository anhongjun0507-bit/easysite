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
  // 루트(/)는 미들웨어가 / → /jieuri 로 rewrite → URL(usePathname)은 '/'지만 렌더 세그먼트는 'jieuri'.
  // 경로가 아니라 렌더 세그먼트로 판별한다.
  // 지으리 랜딩은 공용 헤더를 얹어 통합하고(견적/사전등록 동선 일관), 푸터·플로팅은 랜딩 자체 것을 쓴다.
  const isJieuri = segments[0] === 'jieuri'

  // 광고 전용 랜딩(/lp)·클라 검토용 시안(/hanil)은 자체 레이아웃을 쓰므로 공용 chrome 생략.
  // 프라이빗 아카이브(/letters)도 사이트 UI를 일절 공유하지 않는다.
  if (segments[0] === 'lp' || segments[0] === 'hanil' || (pathname?.startsWith('/letters') ?? false)) {
    return <>{children}</>
  }

  if (isJieuri) {
    return (
      <>
        <Header />
        {children}
      </>
    )
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
