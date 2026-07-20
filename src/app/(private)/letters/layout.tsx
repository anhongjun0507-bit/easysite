import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './letters.css'

// 손글씨 — 나눔손글씨 펜(OFL). KS X 1001 2,350자 서브셋 woff2 (scripts/subset-handwriting-font.py)
// 편지·답장 본문에만 쓴다. UI 텍스트는 레포 공용 Pretendard 그대로.
const handwriting = localFont({
  src: '../../../../public/fonts/handwriting/NanumPen.subset.woff2',
  display: 'swap',
  variable: '--font-hand',
  // 첫 화면(봉투)은 Pretendard 로만 그려지므로 preload 하지 않는다 — LCP 보호
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
  themeColor: '#F1E7D2',
  colorScheme: 'light',
}

export default function LettersLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${handwriting.variable} letters-root`}>{children}</div>
}
