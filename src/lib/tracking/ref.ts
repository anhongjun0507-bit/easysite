// 유입 출처(ref) 추적 — ?ref=soomgo 같은 값을 쿠키(es_ref)에 저장하고,
// 상담/위저드 서버 액션이 이 쿠키를 읽어 leads.source 에 기록한다.
// 클라이언트 쿠키 심기는 RefCapture 컴포넌트가 담당.

export const REF_COOKIE = 'es_ref'
export const REF_MAX_AGE = 60 * 60 * 24 * 30 // 30일

/** ref 값 정규화 — 영문/숫자/-_ 만, 소문자, 40자. 그 외 입력은 무시(null). */
export function sanitizeRef(raw: string | null | undefined): string | null {
  if (!raw) return null
  const v = raw.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40)
  return v || null
}

/** leads.source 문자열 합성 — ref 있으면 `base:ref`, 없으면 `base`. */
export function refSource(base: string, ref: string | null | undefined): string {
  const clean = sanitizeRef(ref)
  return clean ? `${base}:${clean}` : base
}
