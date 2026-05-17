import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Check = { ok: true } | { ok: false; error: string }

export async function GET() {
  const supabase = createClient()
  const checks: Record<string, Check> = {}

  // 1. Auth 엔드포인트 도달 가능 여부 (URL + anon 키 검증)
  try {
    const { error } = await supabase.auth.getSession()
    checks.auth = error ? { ok: false, error: error.message } : { ok: true }
  } catch (e) {
    checks.auth = { ok: false, error: e instanceof Error ? e.message : String(e) }
  }

  // 2. leads 테이블 존재 여부 (RLS는 익명 SELECT를 막으므로 PGRST116=빈 결과로 와도 정상)
  try {
    const { error } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
    if (error && error.code !== 'PGRST116') {
      checks.leads_table = { ok: false, error: `${error.code}: ${error.message}` }
    } else {
      checks.leads_table = { ok: true }
    }
  } catch (e) {
    checks.leads_table = {
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    }
  }

  const allOk = Object.values(checks).every((c) => c.ok)

  return NextResponse.json(
    {
      status: allOk ? 'ok' : 'degraded',
      checks,
      timestamp: new Date().toISOString(),
    },
    { status: allOk ? 200 : 503 },
  )
}
