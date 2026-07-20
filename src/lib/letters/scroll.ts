'use client'

/**
 * /letters 스크롤 상태 — **문서 전체 진행도 0→1 딱 하나**를 모듈 스코프에 두고
 * HTML(GSAP)과 WebGL(useFrame)이 같은 값을 읽는다.
 *
 * React state 를 쓰지 않는 이유: 스크롤 프레임마다 리렌더가 나면 3D가 먼저 죽는다.
 * (Trionn 아키텍처의 "스크롤은 하나의 0→1 값 → 섹션별 remap → 소비처로 팬아웃" 원칙)
 */

export type ScrollState = {
  /** 문서 전체 진행도 0→1 */
  progress: number
  /** 프레임당 스크롤 속도(정규화, 부호 있음) — 흔들림·잔상 세기에 쓴다 */
  velocity: number
  /** 프롤로그(항로) 구간 진행도 0→1 */
  prologue: number
  /** 포인터 위치 -1→1 (스포트라이트) */
  pointerX: number
  pointerY: number
}

export const scrollState: ScrollState = {
  progress: 0,
  velocity: 0,
  prologue: 0,
  pointerX: 0,
  pointerY: 0,
}

/** 구간 [a,b] 안에서의 진행도를 0→1 로 다시 편다 */
export function remap(value: number, a: number, b: number): number {
  if (b === a) return 0
  return Math.min(1, Math.max(0, (value - a) / (b - a)))
}

/** 프레임률과 무관하게 같은 속도로 따라붙는 지수 보간 */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * dt))
}
