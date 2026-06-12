import { ImageResponse } from 'next/og'

// /jieuri 전용 OG 이미지 — 지으리 브랜드 기준(루트 EasySite OG와 별개).
// 이 파일이 있으면 /jieuri 의 og:image / twitter:image 가 지으리 버전으로 자동 주입됨.
export const alt = '코드 몰라도 됩니다. 말하면, 지으리 — jieuri.com'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Google Fonts CSS API 에서 사용 글리프만 subset 으로 로드 (루트 OG와 동일 방식)
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
const BOLD_TEXT = '지으리 코드 몰라도 됩니다. 말하면,'
const MEDIUM_TEXT = 'jieuri.com · 채팅으로 만드는 웹사이트'

export default async function JieuriOgImage() {
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
          backgroundColor: '#4f46e5',
          color: '#ffffff',
          fontFamily: 'NotoSansKR',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -180,
            left: -120,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background: '#818cf8',
            opacity: 0.18,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -200,
            right: -180,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: '#312e81',
            opacity: 0.45,
          }}
        />

        {/* 로고 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '64px 64px 0' }}>
          <div style={{ width: 18, height: 18, borderRadius: 9999, background: '#a5b4fc' }} />
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: -0.5, color: '#ffffff' }}>
            지으리
          </div>
        </div>

        {/* 메인 카피 */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            fontWeight: 800,
            fontSize: 100,
            lineHeight: 1.16,
            letterSpacing: -2,
            color: '#ffffff',
          }}
        >
          <div>코드 몰라도 됩니다.</div>
          <div style={{ color: '#c7d2fe' }}>말하면, 지으리.</div>
        </div>

        {/* 하단 보조 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '0 64px 54px',
            color: '#c7d2fe',
            fontSize: 26,
            fontWeight: 500,
          }}
        >
          jieuri.com · 채팅으로 만드는 웹사이트
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'NotoSansKR', data: bold, weight: 800, style: 'normal' },
        { name: 'NotoSansKR', data: medium, weight: 500, style: 'normal' },
      ],
    },
  )
}
