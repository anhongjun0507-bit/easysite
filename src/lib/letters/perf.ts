'use client'

/**
 * /letters 성능 티어 — 사지방 구형 PC에서도 감상할 수 있게.
 *
 *  'high' : 전체 연출 (별밭 밀도 100%, Bloom+Vignette, DPR ≤ 1.5)
 *  'low'  : DPR 1.0, 포스트프로세싱 off, 별 개수 1/4  (구형 GPU·저사양 기기)
 *  'none' : WebGL 자체를 못 쓰는 환경 → 캔버스를 아예 마운트하지 않고 CSS 폴백만
 *
 * `?perf=low` / `?perf=none` 쿼리로 강제할 수 있다(검증·스크린샷용).
 */

export type PerfTier = 'high' | 'low' | 'none'

export type PerfProfile = {
  tier: PerfTier
  /** R3F <Canvas dpr> */
  dpr: [number, number]
  /** 별 개수 */
  stars: number
  postprocessing: boolean
}

const PROFILES: Record<PerfTier, PerfProfile> = {
  high: { tier: 'high', dpr: [1, 1.5], stars: 2600, postprocessing: true },
  low: { tier: 'low', dpr: [1, 1], stars: 700, postprocessing: false },
  none: { tier: 'none', dpr: [1, 1], stars: 0, postprocessing: false },
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

/** 렌더러 문자열로 소프트웨어 렌더링(SwiftShader/llvmpipe 등)을 잡아낸다 */
function isSoftwareRenderer(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') as WebGLRenderingContext | null
    if (!gl) return true
    const ext = gl.getExtension('WEBGL_debug_renderer_info')
    if (!ext) return false
    const name = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) ?? '').toLowerCase()
    return /swiftshader|llvmpipe|software|basic render/.test(name)
  } catch {
    return false
  }
}

export function detectPerf(): PerfProfile {
  if (typeof window === 'undefined') return PROFILES.high

  const forced = new URLSearchParams(window.location.search).get('perf')
  if (forced === 'low' || forced === 'none' || forced === 'high') return PROFILES[forced]

  if (!hasWebGL()) return PROFILES.none

  const cores = navigator.hardwareConcurrency ?? 4
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4
  const smallScreen = window.matchMedia('(max-width: 480px)').matches

  if (isSoftwareRenderer() || cores <= 4 || memory <= 2 || (smallScreen && cores <= 6)) {
    return PROFILES.low
  }
  return PROFILES.high
}
