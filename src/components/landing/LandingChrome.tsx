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
  // /wizard 와 /wizard?step=… 만 풀스크린. /wizard/result는 Header 다시 노출.
  const isWizardForm =
    (pathname?.startsWith('/wizard') ?? false) &&
    !(pathname?.startsWith('/wizard/result') ?? false)

  if (isWizardForm) {
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
