import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './letters.css'

/**
 * 제목·UI 서체 — 동글동글한 한글 무료 폰트 3종 비교 중. (`?font=1|2|3`)
 *
 * 한 후보당 두 벌을 쓴다.
 *  · display — letters-copy.ts 에 쓰인 글자만 남긴 10~18KB 서브셋. 첫 화면(LCP)이라 preload.
 *  · ui      — 상용 한글 2,350자(118~181KB). 날짜·버튼·우편함처럼 문구가 바뀌는 자리. preload 안 함.
 *
 * 문구를 고치면 `python3 scripts/subset-letters-font.py` 재실행.
 * 후보가 확정되면 고른 1종만 남기고 나머지와 스위처를 지운다.
 */
const jua = localFont({
  src: '../../../../public/fonts/ui/jua.display.subset.woff2',
  display: 'swap',
  variable: '--font-d1',
  preload: true,
  fallback: ['Pretendard Variable', 'sans-serif'],
})
const juaUi = localFont({
  src: '../../../../public/fonts/ui/jua.ui.subset.woff2',
  display: 'swap',
  variable: '--font-u1',
  preload: false,
  fallback: ['Pretendard Variable', 'sans-serif'],
})
const ssurround = localFont({
  src: '../../../../public/fonts/ui/ssurround.display.subset.woff2',
  display: 'swap',
  variable: '--font-d2',
  preload: true,
  fallback: ['Pretendard Variable', 'sans-serif'],
})
const ssurroundUi = localFont({
  src: '../../../../public/fonts/ui/ssurround.ui.subset.woff2',
  display: 'swap',
  variable: '--font-u2',
  preload: false,
  fallback: ['Pretendard Variable', 'sans-serif'],
})
const dongdong = localFont({
  src: '../../../../public/fonts/ui/dongdong.display.subset.woff2',
  display: 'swap',
  variable: '--font-d3',
  preload: true,
  fallback: ['Pretendard Variable', 'sans-serif'],
})
const dongdongUi = localFont({
  src: '../../../../public/fonts/ui/dongdong.ui.subset.woff2',
  display: 'swap',
  variable: '--font-u3',
  preload: false,
  fallback: ['Pretendard Variable', 'sans-serif'],
})

const FONT_VARS = [jua, juaUi, ssurround, ssurroundUi, dongdong, dongdongUi]
  .map((f) => f.variable)
  .join(' ')

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
  return <div className={`${FONT_VARS} ${handwriting.variable} letters-root`}>{children}</div>
}
