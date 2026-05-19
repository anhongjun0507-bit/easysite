import type { Metadata, Viewport } from 'next'
import { LandingChrome } from '@/components/landing/LandingChrome'
import './globals.css'

const SITE_URL = 'https://easysite-sage.vercel.app'
const SITE_NAME = 'EasySite'
const SITE_TITLE = 'EasySite — 아이디어만 있으면 됩니다'
const SITE_DESCRIPTION =
  '사이트 만들기 막막하셨죠? 1분 만에 견적 받고, AI가 만든 초안을 바로 보여드려요. 운영 중인 자체 서비스 3개로 검증된 1인 프리랜서가 직접 제작합니다.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | EasySite',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: '프리즘' }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    // og:image 는 app/opengraph-image.tsx 가 자동 주입 (시안 A — 단색 indigo)
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // twitter:image 는 app/twitter-image.tsx 가 자동 주입
  },
  // icon, apple-icon 는 app/icon.tsx, app/apple-icon.tsx 가 자동 주입
  manifest: '/manifest.webmanifest',
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="relative isolate flex min-h-screen flex-col antialiased">
        <LandingChrome>{children}</LandingChrome>
      </body>
    </html>
  )
}
