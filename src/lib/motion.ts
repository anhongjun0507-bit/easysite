// 모션 팔레트 — 사이트 전체가 "한 손에서 나온" 느낌이 나도록 이징·리듬을 한 곳에서 통일.
// 등장은 power4.out, hover 는 power2.out, 섹션 리빌 트리거는 top 80% 로 일관.

export const EASE = 'power4.out' // 등장(entrance) — 자신감 있는 감속
export const EASE_HOVER = 'power2.out' // hover 전환
export const EASE_NONE = 'none' // scrub(스테이트먼트 채움·케이스 패럴랙스)

export const DUR = 1.1 // 주 등장(헤드라인·메인 리빌)
export const DUR_SUB = 0.9 // 보조 등장(메타·서브카피·CTA)
export const DUR_HOVER = 0.4 // hover 전환

export const STAGGER = 0.1 // 등장 stagger 리듬

export const REVEAL_START = 'top 80%' // 1회 섹션 리빌 ScrollTrigger start

export const MAGNET = 0.4 // 마그네틱 강도(히어로·컨택·네비 공통)
