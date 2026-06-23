import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { Hero } from './Hero'
import { StatementSection } from './StatementSection'
import { FeaturedWork } from './FeaturedWork'
import { ContactSection } from './ContactSection'

const TITLE = '지으리 — Interactive Digital Studio'
const DESCRIPTION =
  '보는 순간 기억에 남는 인터랙티브 웹을 만듭니다. 디자인부터 모션, 개발까지 — 지으리.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: SITE_URL },
  icons: {
    icon: [
      { url: '/jieuri-icon.svg', type: 'image/svg+xml' },
      { url: '/jieuri-favicon.ico', sizes: '32x32' },
    ],
    shortcut: '/jieuri-favicon.ico',
    apple: '/jieuri-apple-touch-icon.png',
  },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '지으리',
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
}

export default function JieuriPage() {
  return (
    <>
      <main className="flex-1">
        <Hero />
        <StatementSection />
        <FeaturedWork />
        <ContactSection />
      </main>

      {/* 경량 푸터 (다크 — 컨택 섹션 이어서). 로고 + 사업자 정보 */}
      <footer className="bg-gray-950 text-white/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-white/10 px-6 py-8 text-[13px] sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[15px] font-extrabold tracking-tight text-white">지으리</span>
          <p className="leading-relaxed">
            프리즘 · 대표 안홍준 · 사업자등록번호 672-35-01596 ·{' '}
            <a href="tel:01037825418" data-cursor="hover" className="transition hover:text-white/80">
              010-3782-5418
            </a>{' '}
            · © 2026 지으리
          </p>
        </div>
      </footer>
    </>
  )
}
