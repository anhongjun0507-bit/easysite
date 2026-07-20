import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './letters.css'

// 큰 제목 — 나눔명조(OFL). letters-copy.ts 에 실제로 쓰인 글자만 남긴 초경량 서브셋이라
// 첫 화면(LCP)에 preload 해도 부담이 없다. 문구를 고치면 scripts/subset-display-font.py 재실행.
const display = localFont({
  src: [
    { path: '../../../../public/fonts/display/NanumMyeongjo-Regular.subset.woff2', weight: '400' },
    { path: '../../../../public/fonts/display/NanumMyeongjo-ExtraBold.subset.woff2', weight: '800' },
  ],
  display: 'swap',
  variable: '--font-display',
  preload: true,
  fallback: ['Pretendard Variable', 'serif'],
})

// 편지·답장 본문 — 나눔손글씨 다행체(OFL). KS X 1001 2,350자 서브셋.
// 딥블랙 위에서도 획이 버티도록 '펜'체가 아니라 굵기가 고른 '다행체'를 쓴다.
// 첫 화면에는 안 나오므로 preload 하지 않는다(LCP 보호).
const handwriting = localFont({
  src: '../../../../public/fonts/handwriting/NanumDaHaeng.subset.woff2',
  display: 'swap',
  variable: '--font-hand',
  preload: false,
  fallback: ['Pretendard Variable', 'sans-serif'],
})

export const metadata: Metadata = {
  title: { absolute: '보관함' },
  description: '',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  alternates: {},
  openGraph: undefined,
  twitter: undefined,
}

export const viewport: Viewport = {
  themeColor: '#0a0a0b',
  colorScheme: 'dark',
}

export default function LettersLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${display.variable} ${handwriting.variable} letters-root`}>{children}</div>
}
