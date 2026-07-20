/**
 * /letters 모션 팔레트 — 이 페이지만의 리듬. (사이트 전역 lib/motion.ts 와 의도적으로 분리)
 * 어둠 속에서 무언가 드러나는 페이지다: 등장은 길고 느리게, 도착(소인)만 짧고 단호하게.
 */

export const EASE_REVEAL = 'power3.out' // 어둠에서 드러남
export const EASE_STAMP = 'back.out(2.1)' // 소인이 찍히는 순간
export const EASE_SCRUB = 'none' // scrub 타임라인

export const DUR_REVEAL = 1.1
export const DUR_LINE = 0.95
export const DUR_STAMP = 0.45

export const STAGGER_LINE = 0.085 // 지금 쓰이는 듯한 줄 간격

/** 뷰포트 어디쯤에서 드러나기 시작할지 — 어두운 페이지라 조금 늦게 잡는다 */
export const REVEAL_START = 'top 82%'
