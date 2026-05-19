import { ImageResponse } from 'next/og'

// iOS 홈 화면 아이콘 — 180x180 PNG.
// Next.js 14 가 자동으로 <link rel="apple-touch-icon" href="/apple-icon?<hash>" /> 메타 주입.
//
// iOS 가 정사각형을 자동으로 둥글게 처리하므로 둥근 모서리 별도 지정 안 함.
// favicon (icon.tsx) 과 동일 디자인을 180px viewBox 에 그대로 확대.

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
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
        <svg width="180" height="180" viewBox="0 0 32 32">
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
