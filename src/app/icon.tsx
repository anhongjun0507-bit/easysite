import { ImageResponse } from 'next/og'

// 브라우저 탭 favicon — 32x32 PNG.
// Next.js 14 가 자동으로 <link rel="icon" href="/icon?<hash>" /> 메타 주입.
//
// 디자인: indigo 솔리드 + 흰색 중심 점 + 외곽 링
//   → about 페이지 동심원 분광 톤과 OG indigo 톤의 미니멀 압축

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#4f46e5',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="4" fill="#ffffff" />
          <circle
            cx="16"
            cy="16"
            r="9.5"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.6"
            opacity="0.7"
          />
        </svg>
      </div>
    ),
    { ...size },
  )
}
