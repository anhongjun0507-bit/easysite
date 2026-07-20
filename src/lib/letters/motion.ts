/**
 * /letters 모션 팔레트 — 이 페이지만의 리듬. (사이트 전역 lib/motion.ts 와 의도적으로 분리)
 * 편지는 급하지 않다: 등장은 길고 느리게, 도착(스탬프)만 짧고 단호하게.
 */

export const EASE_IN_VIEW = 'power3.out' // 종이·본문 등장
export const EASE_STAMP = 'back.out(2.2)' // 소인이 찍히는 순간
export const EASE_SCRUB = 'none' // scrub 타임라인

export const DUR_PAPER = 1.0 // 종이 한 장이 떠오르는 시간
export const DUR_LINE = 0.9 // 본문 한 줄
export const DUR_STAMP = 0.5

export const STAGGER_LINE = 0.09 // 손글씨가 지금 쓰이는 듯한 줄 간격

export const REVEAL_START = 'top 78%'
