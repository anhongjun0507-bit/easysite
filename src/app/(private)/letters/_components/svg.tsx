/**
 * /letters 전용 SVG 조각 — 소인·종이비행기.
 * 전부 순수 마크업(모션 없음). 애니메이션은 각 씬 컴포넌트가 GSAP 으로 건다.
 * 색은 CSS 변수(currentColor 포함)를 타므로 여기서 색을 박지 않는다.
 */

/** 날짜 소인 — 원형 스탬프. 어두운 배경 위에 잉크가 한 번 눌린 자국. */
export function Postmark({ date, className }: { date: string; className?: string }) {
  const [y, m, d] = date.split('-')
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label={`${y}년 ${Number(m)}월 ${Number(d)}일 소인`}>
      <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
      <circle cx="60" cy="60" r="44" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
      <text
        x="60"
        y="52"
        textAnchor="middle"
        fill="currentColor"
        fontSize="21"
        letterSpacing="1.5"
        fontFamily="var(--font-display), serif"
      >
        {Number(m)}.{Number(d)}
      </text>
      <line x1="26" y1="62" x2="94" y2="62" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      <text
        x="60"
        y="80"
        textAnchor="middle"
        fill="currentColor"
        fontSize="12"
        letterSpacing="3"
        opacity="0.75"
        fontFamily="var(--font-display), serif"
      >
        {y}
      </text>
    </svg>
  )
}

/** 종이비행기 실루엣 — 진행 인디케이터와 항목 사이 연결선에 쓴다 */
export function PaperPlane({ className }: { className?: string }) {
  return (
    <svg viewBox="-10 -7 20 14" className={className} aria-hidden>
      <path d="M-8 0 8 -4.6 2.2 0 8 4.6Z" fill="currentColor" />
    </svg>
  )
}
