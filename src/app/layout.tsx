import type { Metadata, Viewport } from 'next'
import { LandingChrome } from '@/components/landing/LandingChrome'
import { RefCapture } from '@/components/RefCapture'
import { JsonLd } from '@/components/JsonLd'
import { SITE_URL, SITE_NAME, SITE_OPERATOR } from '@/lib/site'
import './globals.css'

const SITE_TITLE = '지으리 — 말하면, 지으리'
const SITE_DESCRIPTION =
  '코드 없이 채팅으로 웹사이트를 만드는 AI 웹사이트 제작 서비스, 지으리. 막히면 현직 개발자가 대신 고쳐드려요. 1분 만에 견적부터 받아보세요.'

// 검색엔진용 구조화 데이터 — Organization(운영주체 프리즘) + WebSite(지으리).
const ORG_JSONLD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: ['jieuri', '지으리 AI 웹사이트 빌더'],
      url: SITE_URL,
      logo: `${SITE_URL}/icon-512.png`,
      image: `${SITE_URL}/icon-512.png`,
      description: SITE_DESCRIPTION,
      founder: { '@type': 'Person', name: '안홍준' },
      parentOrganization: { '@type': 'Organization', name: SITE_OPERATOR },
      knowsAbout: [
        'AI 웹사이트 제작',
        '채팅으로 홈페이지 만들기',
        '코드 없이 사이트 제작',
        '웹사이트 견적',
        '홈페이지 제작 대행',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: 'ko-KR',
      description: SITE_DESCRIPTION,
      publisher: { '@id': `${SITE_URL}/#organization` },
      keywords:
        'AI 웹사이트 제작, 채팅으로 홈페이지 만들기, 코드 없이 사이트 제작, 지으리, 홈페이지 제작',
    },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | 지으리',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_OPERATOR }],
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
  icons: {
    icon: [
      { url: '/jieuri-icon.svg', type: 'image/svg+xml' },
      { url: '/jieuri-favicon.ico', sizes: '32x32' },
    ],
    shortcut: '/jieuri-favicon.ico',
    apple: '/jieuri-apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
  robots: { index: true, follow: true },
  // 검색엔진 사이트 소유확인 — 네이버 서치어드바이저
  verification: {
    other: {
      'naver-site-verification': '2ef1b27b4c50f634aaaba45dd00576bb52278bc3',
    },
  },
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
        <JsonLd data={ORG_JSONLD} />
        <RefCapture />
        <LandingChrome>{children}</LandingChrome>
      </body>
    </html>
  )
}
