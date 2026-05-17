import type { Metadata } from 'next'
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
      <body className="antialiased">{children}</body>
    </html>
  )
}
