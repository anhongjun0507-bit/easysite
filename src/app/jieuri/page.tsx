import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { ArrowUpRight } from 'lucide-react'
import { Hero } from './Hero'
import { FeaturedWork } from './FeaturedWork'

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
        <FeaturedWork />
      </main>

      {/* 컨택 + 사업자 정보 (경량 — 본격 컨택 섹션은 다음 단계) */}
      <footer id="contact" className="scroll-mt-24 border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="flex flex-col items-start gap-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-indigo-600">
                Contact
              </p>
              <h2 className="mt-3 text-[28px] font-extrabold leading-[1.05] tracking-[-0.03em] text-gray-950 sm:text-[42px]">
                프로젝트,
                <br className="hidden sm:block" /> 같이 만들어요.
              </h2>
            </div>
            <a
              href="tel:01037825418"
              data-cursor="hover"
              className="group inline-flex items-center gap-2.5 rounded-full bg-gray-950 px-8 py-4 text-[15px] font-semibold text-white transition-colors duration-300 hover:bg-gray-800 sm:text-[16px]"
            >
              프로젝트 문의
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>

          <div className="mt-14 flex flex-col gap-2 border-t border-gray-100 pt-8 text-[13px] leading-relaxed text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              지으리 · 프리즘 · 대표 안홍준 · 사업자등록번호 672-35-01596 ·{' '}
              <a href="tel:01037825418" data-cursor="hover" className="transition hover:text-gray-800">
                010-3782-5418
              </a>
            </p>
            <p className="text-gray-400">© 2026 지으리</p>
          </div>
        </div>
      </footer>
    </>
  )
}
