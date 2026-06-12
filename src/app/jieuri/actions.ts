'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { notifyTelegram } from '@/app/wizard/lib/telegram'
import { preregisterSchema, type PreregisterInput } from './lib/schema'

export type PreregisterResult =
  | { ok: true }
  | { ok: false; reason: 'duplicate' | 'error'; message: string }

/**
 * 지으리 사전등록 제출 — service_role 로 jieuri_preregistrations INSERT (RLS 우회).
 * 같은 contact 재제출 시 unique 위반(23505)을 잡아 "이미 등록되어 있어요" 로 안내.
 * 등록 성공 시 본인 텔레그램으로 best-effort 알림 (실패해도 등록은 성공).
 */
export async function submitPreregistration(
  input: PreregisterInput,
): Promise<PreregisterResult> {
  const parsed = preregisterSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      reason: 'error',
      message: parsed.error.issues[0]?.message ?? '입력을 한 번만 확인해 주세요',
    }
  }

  const d = parsed.data
  const blocker = d.blocker?.trim() ? d.blocker.trim() : null
  const admin = createAdminClient()

  const { error } = await admin.from('jieuri_preregistrations').insert({
    business_type: d.businessType,
    want_type: d.wantType,
    experience: d.experience,
    blocker,
    urgency: d.urgency,
    current_site: d.currentSite,
    willingness_to_pay: d.willingnessToPay,
    contact: d.contact,
    // 개인정보 수집·이용 동의 시각 (동의 없이는 스키마 검증에서 막힘)
    consented_at: new Date().toISOString(),
  })

  if (error) {
    // 23505 = unique_violation → 같은 contact 로 이미 등록됨
    if (error.code === '23505') {
      return { ok: false, reason: 'duplicate', message: '이미 등록되어 있어요' }
    }
    return {
      ok: false,
      reason: 'error',
      message: '잠시 문제가 생겼어요. 다시 한 번 눌러주세요.',
    }
  }

  await notifyTelegram(formatPreregisterMessage({ ...d, blocker }))

  return { ok: true }
}

const esc = (v: string) =>
  v.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c] ?? c)

function formatPreregisterMessage(
  d: Omit<PreregisterInput, 'blocker'> & { blocker: string | null },
): string {
  return [
    `🌱 <b>지으리 사전등록</b>`,
    ``,
    `<b>연락처</b>: ${esc(d.contact)}`,
    d.businessType ? `<b>업종</b>: ${esc(d.businessType)}` : null,
    d.wantType ? `<b>만들 것</b>: ${esc(d.wantType)}` : null,
    d.experience ? `<b>시도</b>: ${esc(d.experience)}` : null,
    d.urgency ? `<b>시기</b>: ${esc(d.urgency)}` : null,
    d.currentSite ? `<b>현재 사이트</b>: ${esc(d.currentSite)}` : null,
    d.willingnessToPay ? `<b>지불 의향</b>: ${esc(d.willingnessToPay)}` : null,
    d.blocker ? `\n<b>막혔던 점</b>: ${esc(d.blocker)}` : null,
  ]
    .filter(Boolean)
    .join('\n')
}
