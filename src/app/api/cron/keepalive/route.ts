import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Supabase 무료요금제 keep-alive (자동중지 방지).
 *
 * 무료 플랜은 7일 무활동 시 프로젝트를 일시중지(INACTIVE)하고, 그동안 사이트의
 * 모든 폼 제출(견적·상담·사전등록)이 "저장 오류"로 실패한다(= 광고 클릭/리드 유실).
 * Vercel Cron(vercel.json)이 매일 1회 이 라우트를 호출 → leads 테이블에 가벼운
 * count 쿼리를 보내 DB 활동을 발생시켜 idle 타이머를 리셋한다.
 *
 * 보안: CRON_SECRET 이 설정돼 있으면 Vercel Cron 이 Authorization 헤더를 자동
 *       첨부하므로 그 경우에만 검증한다. 미설정 시엔 무해한 read-only 핑이라 공개 허용.
 */
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
    }
  }

  const startedAt = Date.now()
  try {
    const admin = createAdminClient()
    // head:true → 행 데이터 전송 없이 Postgres 에 실제 쿼리만 보내 활동 기록.
    const { count, error } = await admin
      .from('leads')
      .select('id', { count: 'exact', head: true })

    if (error) {
      return NextResponse.json(
        { ok: false, error: `${error.code}: ${error.message}` },
        { status: 503 },
      )
    }

    return NextResponse.json({
      ok: true,
      pinged: 'leads',
      leadCount: count ?? null,
      ms: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    })
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 503 },
    )
  }
}
