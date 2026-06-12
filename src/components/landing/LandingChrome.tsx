'use client'

import { usePathname } from 'next/navigation'
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
  // /wizard·/admin·/pay 영역은 풀스크린 — 랜딩 헤더/푸터·플로팅 모두 숨김.
  // 단 /wizard/result는 헤더 다시 노출 (Day 4 결정).
  const isWizardForm =
    (pathname?.startsWith('/wizard') ?? false) &&
    !(pathname?.startsWith('/wizard/result') ?? false)
  const isAdmin = pathname?.startsWith('/admin') ?? false
  const isPay = pathname?.startsWith('/pay') ?? false
  // /jieuri 는 별도 브랜드(jieuri.com 예정) — 자체 헤더/푸터를 직접 렌더하므로
  // EasySite 크롬을 전부 비우고 페이지 트리만 그대로 통과시킨다.
  const isJieuri = pathname?.startsWith('/jieuri') ?? false

  if (isJieuri) {
    return <>{children}</>
  }

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
