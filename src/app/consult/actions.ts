'use server'

import { cookies, headers } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Json } from '@/types/database.types'
import { notifyTelegram } from '@/app/wizard/lib/telegram'
import { REF_COOKIE, refSource, sanitizeRef } from '@/lib/tracking/ref'
import {
  sanitizeMarketing,
  formatMarketing,
  type MarketingParams,
} from '@/lib/tracking/marketing'
import { consultSchema, type ConsultInput, type ConsultMeta } from './lib/schema'

export type ConsultResult =
  | { ok: true; leadId?: string }
  | { ok: false; error: string }

// ── 스팸 가드: 간단 rate limit (서버 액션, best-effort) ──────────────────
// 서버리스 인스턴스별 메모리라 완벽하진 않지만, 동일 IP 의 연속 자동제출을 눅인다.
const RL_MAX = 5 // 윈도우당 허용 횟수
const RL_WINDOW_MS = 60_000 // 1분
const rlStore = new Map<string, { count: number; resetAt: number }>()

function clientIp(): string {
  const h = headers()
  const xff = h.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]!.trim()
  return (h.get('x-real-ip') || 'unknown').trim()
}

function rateLimited(ip: string): boolean {
  const now = Date.now()
  // 메모리 누수 방지 — 비정상적으로 커지면 비운다(저빈도 best-effort)
  if (rlStore.size > 5000) rlStore.clear()
  const e = rlStore.get(ip)
  if (!e || now > e.resetAt) {
    rlStore.set(ip, { count: 1, resetAt: now + RL_WINDOW_MS })
    return false
  }
  if (e.count >= RL_MAX) return true
  e.count += 1
  return false
}

/**
 * 프로젝트 문의(상담) 제출 — 연락처 + 자격검증(유형·예산·일정)으로 leads insert + 텔레그램 알림.
 * 유입 출처(ref 쿠키)와 광고 파라미터(gclid/utm)를 함께 기록한다.
 * meta.hp(honeypot)가 채워져 있으면 봇으로 간주, 저장·알림 없이 성공처럼 응답한다.
 */
export async function submitConsult(
  input: ConsultInput,
  meta?: ConsultMeta,
): Promise<ConsultResult> {
  // 1) honeypot — 사람에겐 보이지 않는 칸. 채워져 있으면 봇 → 조용히 성공처럼(leadId 없음).
  if (typeof meta?.hp === 'string' && meta.hp.trim() !== '') {
    return { ok: true }
  }

  // 2) rate limit
  if (rateLimited(clientIp())) {
    return { ok: false, error: '요청이 많아요. 잠시 후 다시 시도해 주세요.' }
  }

  // 3) 검증
  const parsed = consultSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? '입력이 올바르지 않아요',
    }
  }

  const { name, phone, company, email, projectType, budget, timeline, kakao, message } =
    parsed.data
  const ref = sanitizeRef(cookies().get(REF_COOKIE)?.value)
  const marketing = sanitizeMarketing(meta?.marketing)
  const hasMarketing = Object.keys(marketing).length > 0
  const admin = createAdminClient()

  // 자격검증 응답·카톡·광고 파라미터는 leads 전용 컬럼이 없어 features(jsonb)에 보관.
  const features = JSON.parse(
    JSON.stringify({
      kind: 'consult',
      ref,
      kakao: kakao || null,
      projectType,
      budget,
      timeline: timeline || null,
      marketing: hasMarketing ? marketing : null,
    }),
  ) as Json

  const { data: leadRow, error } = await admin
    .from('leads')
    .insert({
      business_name: company || null,
      contact_name: name,
      contact_phone: phone,
      contact_email: email || null,
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
    payload: { ref, projectType, budget, timeline: timeline || null, marketing },
  })

  await notifyTelegram(formatConsultMessage(leadId, parsed.data, ref, marketing))

  return { ok: true, leadId }
}

const esc = (v: string) =>
  v.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c] ?? c)

function formatConsultMessage(
  leadId: string,
  d: ConsultInput,
  ref: string | null,
  marketing: MarketingParams,
): string {
  const mkt = formatMarketing(marketing)
  return [
    `🔷 <b>프로젝트 문의</b>`,
    ``,
    `<b>이름</b>: ${esc(d.name)}`,
    `<b>전화</b>: ${esc(d.phone)}`,
    d.company ? `<b>회사</b>: ${esc(d.company)}` : null,
    d.email ? `<b>이메일</b>: ${esc(d.email)}` : null,
    d.kakao ? `<b>카톡</b>: ${esc(d.kakao)}` : null,
    ``,
    `<b>유형</b>: ${esc(d.projectType)}  ·  <b>예산</b>: ${esc(d.budget)}${
      d.timeline ? `  ·  <b>일정</b>: ${esc(d.timeline)}` : ''
    }`,
    d.message ? `\n<b>요청</b>: ${esc(d.message)}` : null,
    ref ? `\n<b>유입</b>: ${esc(ref)}` : null,
    mkt ? `<b>광고</b>: ${esc(mkt)}` : null,
    ``,
    `lead_id: <code>${leadId}</code>`,
  ]
    .filter(Boolean)
    .join('\n')
}
