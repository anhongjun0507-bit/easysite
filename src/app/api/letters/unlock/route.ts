import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  LETTERS_COOKIE_MAX_AGE,
  LETTERS_COOKIE_NAME,
  createLettersToken,
  verifyPasscode,
} from '@/lib/letters/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const bodySchema = z.object({ code: z.string().min(1).max(120) })

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

  if (!verifyPasscode(parsed.data.code)) {
    // 무차별 대입 방지용 약간의 지연
    await new Promise((r) => setTimeout(r, 400))
    return NextResponse.json({ ok: false, error: '코드가 맞지 않아요' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set({
    name: LETTERS_COOKIE_NAME,
    value: await createLettersToken(),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: LETTERS_COOKIE_MAX_AGE,
  })
  return res
}
