/**
 * /admin 운영자 인증 — HMAC 서명 쿠키 24시간.
 * 클라이언트 사이드 검증 절대 금지. 모든 어드민 라우트/API는 서버에서 verifySession.
 */

import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const ADMIN_COOKIE_NAME = 'easysite_admin'
const TTL_MS = 24 * 60 * 60 * 1000

/** 환경변수 검증 — 누락 시 즉시 throw (배포 시 깨지게) */
function requireEnv(name: 'ADMIN_USERNAME' | 'ADMIN_PASSWORD' | 'ADMIN_SECRET'): string {
  const v = process.env[name]
  if (!v) throw new Error(`${name} not set`)
  return v
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex')
}

/** 새 세션 토큰 생성 — 쿠키 값. `${expiry_ms}:${hex_sig}` */
export function createSessionToken(): string {
  const secret = requireEnv('ADMIN_SECRET')
  const expiry = Date.now() + TTL_MS
  const payload = String(expiry)
  const sig = sign(payload, secret)
  return `${payload}:${sig}`
}

/** 토큰 검증 — HMAC + 만료 모두 통과해야 OK */
export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token || typeof token !== 'string') return false
  const idx = token.indexOf(':')
  if (idx === -1) return false
  const expiryStr = token.slice(0, idx)
  const sig = token.slice(idx + 1)
  const secret = process.env.ADMIN_SECRET
  if (!secret) return false

  const expected = sign(expiryStr, secret)
  if (sig.length !== expected.length) return false
  let same = false
  try {
    same = timingSafeEqual(Buffer.from(sig, 'utf8'), Buffer.from(expected, 'utf8'))
  } catch {
    return false
  }
  if (!same) return false

  const expiry = Number(expiryStr)
  return Number.isFinite(expiry) && expiry > Date.now()
}

export function verifyCredentials(username: string, password: string): boolean {
  const expectedU = requireEnv('ADMIN_USERNAME')
  const expectedP = requireEnv('ADMIN_PASSWORD')
  return safeStringEqual(username, expectedU) && safeStringEqual(password, expectedP)
}

function safeStringEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a ?? '', 'utf8')
  const bBuf = Buffer.from(b ?? '', 'utf8')
  if (aBuf.length !== bBuf.length) return false
  try {
    return timingSafeEqual(aBuf, bBuf)
  } catch {
    return false
  }
}

/** 서버 컴포넌트·서버 액션에서 현재 세션 유효성 확인 */
export function isAdminSessionValid(): boolean {
  const c = cookies()
  return verifySessionToken(c.get(ADMIN_COOKIE_NAME)?.value)
}

/** TTL 초 단위 (쿠키 max-age) */
export const ADMIN_COOKIE_MAX_AGE = Math.floor(TTL_MS / 1000)

/**
 * 서버 컴포넌트·서버 액션 첫 줄에 호출. invalid 세션이면 /admin/login으로 redirect.
 * redirect는 Next throw mechanism이라 이후 코드 실행 안 됨.
 */
export function requireAdmin(currentPath?: string): void {
  if (!isAdminSessionValid()) {
    const next = currentPath ? `?next=${encodeURIComponent(currentPath)}` : ''
    redirect(`/admin/login${next}`)
  }
}
