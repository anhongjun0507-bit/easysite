import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Json } from '@/types/database.types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const eventSchema = z.object({
  sessionId: z.string().min(1).max(120),
  eventType: z.enum([
    'wizard_started',
    'step_started',
    'step_completed',
    'step_hesitating',
    'wizard_abandoned',
    'wizard_completed',
  ]),
  payload: z.record(z.string(), z.unknown()).optional(),
  leadId: z.string().uuid().optional(),
})

/**
 * 이탈 분석 이벤트 수집 — sendBeacon · fetch keepalive 양쪽 호환.
 * RLS: service_role로 INSERT (클라이언트 IP 신뢰 X — sessionId만 수용).
 * sendBeacon은 응답을 읽지 않으므로 빠르게 200 반환.
 */
export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const parsed = eventSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const { sessionId, eventType, payload, leadId } = parsed.data

  try {
    const admin = createAdminClient()
    await admin.from('lead_events').insert({
      session_id: sessionId,
      event_type: eventType,
      payload: (payload ?? {}) as Json,
      lead_id: leadId ?? null,
    })
  } catch {
    // 분석 실패는 무시 — 사용자 경험에 영향 X
  }

  return NextResponse.json({ ok: true })
}
