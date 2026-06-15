import { ImageResponse } from 'next/og'

// Next.js 14 App Router: 이 파일은 빌드/요청 시 OG 이미지 PNG 를 자동 생성하고
// 루트 metadata 의 og:image 를 자동 주입합니다 (layout 의 openGraph.images 보다 우선).
//
// 시안 A — 단색 indigo 미니멀 (사장님 결정, 2026-05-19)
//   배경:      indigo-600 솔리드 + 후광 블롭 2개
//   메인 카피: "1분 만에 견적, / AI가 만든 초안까지."  104px / 800
//   보조:      "지으리 · 사장님 사이트 제작"      26px / 500
//   로고:      흰 점 + "지으리"  36px / 800

// runtime 은 기본값(nodejs) 사용. 빌드 시 한 번 렌더링되어 정적 PNG 로 캐시됨
// (edge 런타임은 next start 표준 서버에서 라우팅 불안정 → nodejs 가 안전)
export const alt = '1분 만에 견적, AI가 만든 초안까지 — 지으리'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Google Fonts API 에서 글리프 subset 만 로드 (CDN, 매 빌드 1회)
// text= 로 사용 글자만 지정 → 파일 크기 수 KB 수준
async function loadGoogleFont(family: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`
  const css = await (
    await fetch(url, {
      // Google CSS API 는 UA 에 따라 woff2/ttf 응답 분기 — UA 명시로 ttf 받아옴
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })
  ).text()
  const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/)
  if (!match) throw new Error('OG: font src not found in Google CSS')
  const fontRes = await fetch(match[1])
  if (!fontRes.ok) throw new Error('OG: font fetch failed')
  return await fontRes.arrayBuffer()
}

const FAMILY = 'Noto+Sans+KR'

// Bold 글리프 — 메인 카피 + 로고
const BOLD_TEXT = '1분 만에 견적, AI가 만든 초안까지. 지으리'
// Medium 글리프 — 하단 보조 라인
const MEDIUM_TEXT = '지으리 · 사장님 사이트 제작'

export default async function OgImage() {
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
        {/* 후광 — 좌상 indigo-400 18% */}
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
        {/* 후광 — 우하 indigo-900 45% */}
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

        {/* 좌상단 로고 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            padding: '64px 64px 0',
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9999,
              background: '#ffffff',
            }}
          />
          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: -0.5,
              color: '#ffffff',
            }}
          >
            지으리
          </div>
        </div>

        {/* 메인 카피 — 가운데 정렬, flex grow 로 수직 중앙 */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            fontWeight: 800,
            fontSize: 104,
            lineHeight: 1.15,
            letterSpacing: -2,
            color: '#ffffff',
          }}
        >
          <div>1분 만에 견적,</div>
          <div>AI가 만든 초안까지.</div>
        </div>

        {/* 하단 보조 — 우정렬 */}
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
          지으리 · 사장님 사이트 제작
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
