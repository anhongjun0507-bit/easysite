import type { Metadata } from 'next'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'EasySite - 아이디어만 있으면 됩니다',
  description:
    '웹사이트 제작이 처음이어도 괜찮습니다. AI가 견적부터 시안·정보 수집·제작 진행까지 자동으로 도와드려요.',
  metadataBase: new URL('https://easysite-sage.vercel.app'),
  openGraph: {
    title: 'EasySite - 아이디어만 있으면 됩니다',
    description:
      '웹사이트 제작이 처음이어도 괜찮습니다. AI가 견적부터 시안·정보 수집·제작 진행까지 자동으로 도와드려요.',
    locale: 'ko_KR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="relative isolate flex min-h-screen flex-col antialiased">
        {/* Subtle global accent — Hero owns its stronger mesh; this just keeps brand tone on other pages */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[480px] bg-gradient-to-b from-indigo-50/40 via-transparent to-transparent"
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
