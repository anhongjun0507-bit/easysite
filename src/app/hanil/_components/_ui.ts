// ─────────────────────────────────────────────────────────────────────────────
// /hanil 전용 타입 스케일 · 모션 · 레이아웃 토큰 — 시안 A/B/C 3안이 함께 사용한다.
// 인라인 ad-hoc 값을 한 곳으로 모아 위계·리듬·이징을 전 페이지에서 일관되게 강제한다.
// Tailwind v3: 모든 값은 정적 문자열 리터럴이라 purge 안전(동적 조립 금지).
// ─────────────────────────────────────────────────────────────────────────────

/** 3단 타이포 위계 — display(히어로) / h2(섹션) / eyebrow(영문 소제목) / body */
export const txt = {
  display: 'text-[2.5rem] font-extrabold leading-[1.05] tracking-[-0.02em] sm:text-[3.4rem] lg:text-[4.25rem]',
  h2: 'text-[1.9rem] font-bold leading-[1.15] tracking-[-0.015em] sm:text-[2.5rem]',
  h3: 'text-lg font-bold leading-snug tracking-[-0.01em]',
  eyebrow: 'text-[0.78rem] font-semibold uppercase tracking-[0.22em]',
  body: 'text-[1rem] leading-[1.85] sm:text-[1.0625rem]',
  bodySm: 'text-[0.9rem] leading-[1.8]',
  num: 'tabular-nums',
} as const

/** 모션 토큰 — 이징/지속시간을 전 인터랙션에서 통일(GNB 언더라인·버튼·리빌) */
export const motion = {
  /** transition-timing-function 클래스 (tailwind.config emphasized와 동일 커브) */
  ease: 'ease-[cubic-bezier(0.22,1,0.36,1)]',
  dur: 'duration-[450ms]',
  durFast: 'duration-[240ms]',
} as const

/** 섹션 수직 리듬 · 컨테이너 — 대기업 사이트의 넉넉한 여백 체계 */
export const layout = {
  section: 'py-24 sm:py-32',
  container: 'mx-auto w-full max-w-7xl px-6 sm:px-8',
} as const
