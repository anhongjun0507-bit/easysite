import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  ADMIN_COOKIE_MAX_AGE,
  ADMIN_COOKIE_NAME,
  createSessionToken,
  verifyCredentials,
} from '@/lib/admin/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const bodySchema = z.object({
  username: z.string().min(1).max(120),
  password: z.string().min(1).max(200),
})

export async function POST(request: Request) {
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: '잘못된 요청' }, { status: 400 })
  }
  const parsed = bodySchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: '잘못된 요청' }, { status: 400 })
  }

  if (!verifyCredentials(parsed.data.username, parsed.data.password)) {
    // 무차별 대입 방지용 약간의 지연
    await new Promise((r) => setTimeout(r, 400))
    return NextResponse.json(
      { ok: false, error: '아이디 또는 비밀번호가 맞지 않아요' },
      { status: 401 },
    )
  }

  const token = createSessionToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_COOKIE_MAX_AGE,
  })
  return res
}
