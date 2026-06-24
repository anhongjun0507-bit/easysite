import type { Metadata, Viewport } from 'next'
import { LandingChrome } from '@/components/landing/LandingChrome'
import { SmoothScrollProvider } from '@/components/SmoothScrollProvider'
import { CustomCursor } from '@/components/CustomCursor'
import { RefCapture } from '@/components/RefCapture'
import { Analytics } from '@/components/Analytics'
import { GtagScripts } from '@/components/GtagScripts'
import { JsonLd } from '@/components/JsonLd'
import { SITE_URL, SITE_NAME, SITE_OPERATOR } from '@/lib/site'
import './globals.css'
// Pretendard 동적 서브셋(자체호스팅) — unicode-range 조각 woff2. 실제 쓰인 글자 범위만 다운로드(2MB→수십KB).
import './pretendard-subset.css'

const SITE_TITLE = '지으리 — 인터랙티브 디지털 스튜디오'
const SITE_DESCRIPTION =
  '프리즘이 운영하는 인터랙티브 디지털 스튜디오, 지으리. 웹사이트 제작부터 앱 개발까지 — 전략·디자인·모션·개발을 한 흐름으로 풀어, 보는 순간 기억에 남는 프리미엄 브랜드 웹·앱을 만듭니다.'

// 검색엔진용 구조화 데이터 — Organization(운영주체 프리즘) + WebSite(지으리).
const ORG_JSONLD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: ['jieuri', '지으리 스튜디오'],
      url: SITE_URL,
      logo: `${SITE_URL}/icon-512.png`,
      image: `${SITE_URL}/icon-512.png`,
      description: SITE_DESCRIPTION,
      founder: { '@type': 'Person', name: '안홍준' },
      parentOrganization: { '@type': 'Organization', name: SITE_OPERATOR },
      knowsAbout: [
        '웹사이트 제작',
        '앱 개발',
        '인터랙티브 웹 제작',
        '브랜드 웹사이트 디자인',
        '웹·모션 개발',
        '프리미엄 웹사이트',
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
        '웹사이트 제작, 앱 개발, 웹·앱 개발 외주, 인터랙티브 웹사이트 제작, 프리미엄 웹사이트, 모션 웹, 브랜드 웹사이트, 스타트업 웹앱 개발, 인터랙티브 디지털 스튜디오, 지으리',
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
    // og:image 는 app/opengraph-image.tsx 가 자동 주입 (다크 스튜디오 brand OG — lib/og.tsx)
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
  // 검색엔진 사이트 소유확인 — 구글 서치콘솔 + 네이버 서치어드바이저
  verification: {
    google: 'fnKn21sXGvdYnJrDKjoX7e5vnV5sw8HK5QyLFR6Ph14',
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
        <GtagScripts />
        <JsonLd data={ORG_JSONLD} />
        <RefCapture />
        <Analytics />
        <CustomCursor />
        <SmoothScrollProvider>
          <LandingChrome>{children}</LandingChrome>
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
