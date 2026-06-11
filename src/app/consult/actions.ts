'use server'

import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Json } from '@/types/database.types'
import { notifyTelegram } from '@/app/wizard/lib/telegram'
import { REF_COOKIE, refSource, sanitizeRef } from '@/lib/tracking/ref'
import { consultSchema, type ConsultInput } from './lib/schema'

export type ConsultResult =
  | { ok: true; leadId: string }
  | { ok: false; error: string }

/**
 * 바로 상담 신청 — 위저드 없이 연락처만으로 leads insert + 텔레그램 알림.
 * 이미 마음을 정한(숨고 등에서 견적 보고 온) 리드를 위한 빠른 경로.
 * 유입 출처(ref 쿠키)를 leads.source 에 함께 기록한다.
 */
export async function submitConsult(input: ConsultInput): Promise<ConsultResult> {
  const parsed = consultSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? '입력이 올바르지 않아요',
    }
  }

  const { name, phone, kakao, businessName, message } = parsed.data
  const ref = sanitizeRef(cookies().get(REF_COOKIE)?.value)
  const admin = createAdminClient()

  // kakao 는 leads 컬럼이 없어 features 에 보관 (위저드는 lead_events 에 보관)
  const features = JSON.parse(
    JSON.stringify({ kind: 'consult', ref, kakao: kakao || null }),
  ) as Json

  const { data: leadRow, error } = await admin
    .from('leads')
    .insert({
      business_name: businessName || null,
      contact_name: name,
      contact_phone: phone,
      status: 'new',
      source: refSource('consult', ref),
      notes: message || null,
      features,
    })
    .select('id')
    .single()

  if (error || !leadRow) {
    return {
      ok: false,
      error: '저장 중 문제가 생겼어요. 급하시면 010-3782-5418 로 전화 주세요.',
    }
  }

  const leadId = leadRow.id

  await admin.from('lead_events').insert({
    lead_id: leadId,
    event_type: 'consult_submitted',
    payload: { ref },
  })

  await notifyTelegram(formatConsultMessage(leadId, parsed.data, ref))

  return { ok: true, leadId }
}

const esc = (v: string) =>
  v.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c] ?? c)

function formatConsultMessage(
  leadId: string,
  d: ConsultInput,
  ref: string | null,
): string {
  return [
    `🔥 <b>바로 상담 신청</b>`,
    ``,
    `<b>이름</b>: ${esc(d.name)}`,
    `<b>전화</b>: ${esc(d.phone)}`,
    d.kakao ? `<b>카톡</b>: ${esc(d.kakao)}` : null,
    d.businessName ? `<b>상호</b>: ${esc(d.businessName)}` : null,
    d.message ? `\n<b>요청</b>: ${esc(d.message)}` : null,
    ref ? `\n<b>유입</b>: ${esc(ref)}` : null,
    ``,
    `lead_id: <code>${leadId}</code>`,
  ]
    .filter(Boolean)
    .join('\n')
}
