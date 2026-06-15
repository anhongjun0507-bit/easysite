import type { Metadata, Viewport } from 'next'
import { LandingChrome } from '@/components/landing/LandingChrome'
import { RefCapture } from '@/components/RefCapture'
import './globals.css'

const SITE_URL = 'https://easysite-sage.vercel.app'
const SITE_NAME = '지으리'
const SITE_TITLE = '지으리 — 말하면, 지으리'
const SITE_DESCRIPTION =
  '코드 몰라도 됩니다. 채팅으로 웹사이트를 만들고, 막히면 현직 개발자가 대신 고쳐드려요. 1분 만에 견적부터 받아보세요.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | 지으리',
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
        <RefCapture />
        <LandingChrome>{children}</LandingChrome>
      </body>
    </html>
  )
}
