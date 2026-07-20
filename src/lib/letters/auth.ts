/**
 * /letters 패스코드 게이트 — HMAC 서명 쿠키.
 *
 * ⚠️ 이 모듈은 **미들웨어(Edge 런타임)에서도 임포트**되므로 node:crypto 를 쓰면 안 된다.
 *    (Next 14 는 Node 런타임 미들웨어 미지원) → Web Crypto(crypto.subtle) 로만 구현.
 *    같은 이유로 admin(src/lib/admin/auth.ts, node:crypto)과 코드를 공유하지 않는다.
 */

export const LETTERS_COOKIE_NAME = 'letters_pass'
const TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30일 — 사지방에서 매번 코드 넣지 않게
export const LETTERS_COOKIE_MAX_AGE = Math.floor(TTL_MS / 1000)

/** 서명 시크릿 — 전용 값이 없으면 어드민 시크릿을 재사용(운영 env 하나로도 동작) */
function secret(): string | null {
  return process.env.LETTERS_SECRET || process.env.ADMIN_SECRET || null
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function sign(payload: string, key: string): Promise<string> {
  const enc = new TextEncoder()
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  return toHex(await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(payload)))
}

/** 길이 노출 없이 상수시간 비교 (Web Crypto 환경엔 timingSafeEqual 이 없음) */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

/** 입력 코드가 LETTERS_PASSCODE 와 일치하는지 */
export function verifyPasscode(input: string): boolean {
  const expected = process.env.LETTERS_PASSCODE
  if (!expected) return false
  return safeEqual(input.trim(), expected)
}

/** 새 세션 쿠키 값 — `${만료ms}:${hex서명}` */
export async function createLettersToken(): Promise<string> {
  const key = secret()
  if (!key) throw new Error('LETTERS_SECRET (또는 ADMIN_SECRET) not set')
  const expiry = String(Date.now() + TTL_MS)
  return `${expiry}:${await sign(expiry, key)}`
}

/** 쿠키 값 검증 — 서명·만료 모두 통과해야 true */
export async function verifyLettersToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false
  const idx = token.indexOf(':')
  if (idx === -1) return false
  const key = secret()
  if (!key) return false

  const expiryStr = token.slice(0, idx)
  const sig = token.slice(idx + 1)
  if (!safeEqual(sig, await sign(expiryStr, key))) return false

  const expiry = Number(expiryStr)
  return Number.isFinite(expiry) && expiry > Date.now()
}
