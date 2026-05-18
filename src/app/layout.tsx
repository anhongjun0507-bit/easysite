import type { Metadata, Viewport } from 'next'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import { FloatingContact } from '@/components/landing/FloatingContact'
import { BackToTop } from '@/components/landing/BackToTop'
import './globals.css'

const SITE_URL = 'https://easysite-sage.vercel.app'
const SITE_NAME = 'EasySite'
const SITE_TITLE = 'EasySite — 아이디어만 있으면 됩니다'
const SITE_DESCRIPTION =
  '웹사이트 제작이 처음이어도 괜찮습니다. AI가 견적부터 시안·정보 수집·제작 진행까지 자동으로 도와드려요.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s — EasySite',
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
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/og.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingContact />
        <BackToTop />
      </body>
    </html>
  )
}
