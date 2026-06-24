import { ImageResponse } from 'next/og'

// 공용 브랜드 OG (1200×630) — 루트·지으리 OG 가 함께 사용.
// 인터랙티브 디지털 스튜디오 포지션. 다크·미니멀·여백 중심, 텍스트형(케이스 비주얼 X).
// runtime 기본값(nodejs) — 빌드 시 1회 렌더 후 정적 PNG 캐시(edge 라우팅 불안정 회피).

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_ALT = '지으리 — Interactive Digital Studio · 웹·앱 제작'
export const OG_CONTENT_TYPE = 'image/png'

// Google Fonts CSS API 에서 사용 글리프만 subset 으로 로드(매 빌드 1회, 수 KB)
async function loadGoogleFont(family: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`
  const css = await (
    await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  ).text()
  const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/)
  if (!match) throw new Error('OG: font src not found in Google CSS')
  const fontRes = await fetch(match[1])
  if (!fontRes.ok) throw new Error('OG: font fetch failed')
  return await fontRes.arrayBuffer()
}

const FAMILY = 'Noto+Sans+KR'

// 렌더되는 글자(이 문자열 합집합만 subset 으로 다운로드 → 누락 글리프 없음)
const LOGO = '지으리'
const HEADLINE = '경험을 짓습니다'
const EYEBROW = 'INTERACTIVE DIGITAL STUDIO'
const SUBLINE = '웹 · 앱을 디자인 · 모션 · 개발로'
const SITE = 'jieuri.com'

const BOLD_TEXT = LOGO + HEADLINE
const MEDIUM_TEXT = EYEBROW + SUBLINE + SITE

export async function renderBrandOg() {
  const [bold, medium] = await Promise.all([
    loadGoogleFont(FAMILY, 800, BOLD_TEXT),
    loadGoogleFont(FAMILY, 500, MEDIUM_TEXT),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          backgroundColor: '#0b0b14',
          color: '#ffffff',
          fontFamily: 'NotoSansKR',
          overflow: 'hidden',
        }}
      >
        {/* 인디고 글로우 — 우상단 */}
        <div
          style={{
            position: 'absolute',
            top: -240,
            right: -180,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background: '#4f46e5',
            opacity: 0.28,
          }}
        />
        {/* 인디고 글로우 — 좌하단(약하게) */}
        <div
          style={{
            position: 'absolute',
            bottom: -260,
            left: -200,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background: '#6366f1',
            opacity: 0.14,
          }}
        />

        {/* 로고 — 좌상단 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '70px 72px 0' }}>
          <div style={{ width: 16, height: 16, borderRadius: 9999, background: '#ffffff' }} />
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -0.5, color: '#ffffff' }}>
            {LOGO}
          </div>
        </div>

        {/* 본문 — 수직 중앙, 좌정렬 */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 72px',
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: 8,
              color: '#a5b4fc',
            }}
          >
            {EYEBROW}
          </div>
          <div
            style={{
              marginTop: 22,
              fontSize: 116,
              fontWeight: 800,
              letterSpacing: -3,
              lineHeight: 1.04,
              color: '#ffffff',
            }}
          >
            {HEADLINE}
          </div>
        </div>

        {/* 하단 — 한 줄 설명 + 도메인 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 72px 60px',
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 500, color: '#d4d4d8' }}>{SUBLINE}</div>
          <div style={{ fontSize: 26, fontWeight: 500, color: '#818cf8' }}>{SITE}</div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'NotoSansKR', data: bold, weight: 800, style: 'normal' },
        { name: 'NotoSansKR', data: medium, weight: 500, style: 'normal' },
      ],
    },
  )
}
