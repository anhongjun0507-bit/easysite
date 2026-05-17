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
      <body className="flex min-h-screen flex-col antialiased">
        <div className="relative isolate flex-1 overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] bg-gradient-to-b from-indigo-100/60 via-indigo-50/30 to-transparent"
          />
          <Header />
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
