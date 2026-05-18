'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import type { Json } from '@/types/database.types'
import { notifyTelegram } from './lib/telegram'
import {
  estimateBudget,
  estimatePageCount,
  submitSchema,
  type SubmitInput,
} from './lib/schema'

export type WizardSubmitResult =
  | { ok: true; leadId: string }
  | { ok: false; error: string }

/**
 * Wizard 최종 제출 — leads insert + lead_events 연결 + 텔레그램 알림.
 *
 * RLS: anon insert만 허용된 상황이라 RETURNING이 막혀, RLS를 우회하는
 * service_role 클라이언트(`createAdminClient`)를 서버에서만 사용.
 */
export async function submitWizard(input: SubmitInput): Promise<WizardSubmitResult> {
  const parsed = submitSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? '입력이 올바르지 않아요',
    }
  }

  const { answers, contact, sessionId } = parsed.data
  const admin = createAdminClient()

  // 1. leads insert — RETURNING id 회수
  const { min: budgetMin, max: budgetMax } = estimateBudget(answers.budget)
  // JSON.parse(JSON.stringify(...))로 undefined 제거 → Json 타입 호환
  const features = JSON.parse(JSON.stringify(buildFeatures(answers))) as Json
  const wizardAnswersJson = JSON.parse(JSON.stringify(answers)) as Json

  const { data: leadRow, error: insertErr } = await admin
    .from('leads')
    .insert({
      business_name: answers.businessName ?? null,
      contact_name: contact.name,
      contact_phone: contact.phone,
      contact_email: contact.email || null,
      industry: answers.industry ?? null,
      page_count: estimatePageCount(answers.pageCount),
      estimated_price_min: budgetMin,
      estimated_price_max: budgetMax,
      features,
      wizard_answers: wizardAnswersJson,
      status: 'new',
      source: 'wizard-v1',
    })
    .select('id')
    .single()

  if (insertErr || !leadRow) {
    return {
      ok: false,
      error: '저장 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.',
    }
  }

  const leadId = leadRow.id

  // 2. 이전 이벤트들에 lead_id 채워넣기 (이탈 분석 연결)
  await admin
    .from('lead_events')
    .update({ lead_id: leadId })
    .eq('session_id', sessionId)
    .is('lead_id', null)

  // 3. wizard_completed 이벤트 (서버측에서 직접 기록 — 클라이언트 누락 대비)
  await admin.from('lead_events').insert({
    lead_id: leadId,
    session_id: sessionId,
    event_type: 'wizard_completed',
    payload: { kakao: contact.kakao || null },
  })

  // 4. 텔레그램 알림 (실패해도 OK)
  await notifyTelegram(formatTelegramMessage(leadId, parsed.data))

  return { ok: true, leadId }
}

function buildFeatures(answers: SubmitInput['answers']): Record<string, unknown> {
  return {
    siteType: answers.siteType ?? null,
    payment: answers.payment ?? null,
    aiChat: answers.aiChat ?? null,
    designTone: answers.designTone ?? null,
    timeline: answers.timeline ?? null,
    budget: answers.budget ?? null,
    tagline: answers.tagline ?? null,
    rawIntent: answers.rawIntent ?? null,
  }
}

function formatTelegramMessage(leadId: string, input: SubmitInput): string {
  const a = input.answers
  const c = input.contact
  const lines = [
    `🆕 <b>새 견적 요청</b>`,
    ``,
    `<b>이름</b>: ${escape(c.name)}`,
    `<b>전화</b>: ${escape(c.phone)}`,
    c.email ? `<b>이메일</b>: ${escape(c.email)}` : null,
    c.kakao ? `<b>카톡</b>: ${escape(c.kakao)}` : null,
    a.businessName ? `<b>상호</b>: ${escape(a.businessName)}` : null,
    a.industry ? `<b>업종</b>: ${escape(a.industry)}` : null,
    ``,
    `<b>유형</b>: ${labelSiteType(a.siteType)}`,
    `<b>페이지</b>: ${labelPageCount(a.pageCount)}`,
    `<b>결제</b>: ${labelYesNo(a.payment)}`,
    `<b>AI 챗봇</b>: ${labelAiChat(a.aiChat)}`,
    `<b>디자인 톤</b>: ${labelDesignTone(a.designTone)}`,
    `<b>납기</b>: ${labelTimeline(a.timeline)}`,
    `<b>예산</b>: ${labelBudget(a.budget)}`,
    a.tagline ? `\n<b>한 줄 소개</b>: ${escape(a.tagline)}` : null,
    ``,
    `lead_id: <code>${leadId}</code>`,
  ].filter(Boolean)
  return lines.join('\n')
}

const escape = (v: string) => v.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c] ?? c)

const labelSiteType = (v?: string) =>
  ({ company: '회사·가게 소개', shop: '쇼핑몰', reservation: '예약·회원제', landing: '랜딩페이지', other: '기타' })[
    v ?? ''
  ] ?? '미선택'
const labelPageCount = (v?: string) =>
  ({ small: '5개 이내', medium: '5~10개', large: '10개 이상', unsure: '잘 모르겠음' })[v ?? ''] ?? '미선택'
const labelYesNo = (v?: string) =>
  ({ yes: '필요', no: '불필요', unsure: '잘 모르겠음' })[v ?? ''] ?? '미선택'
const labelAiChat = (v: SubmitInput['answers']['aiChat']) => {
  if (!v) return '미선택'
  if (v.needed === true) return `필요${v.detail ? ` — ${escape(v.detail)}` : ''}`
  if (v.needed === false) return '불필요'
  return '잘 모르겠음'
}
const labelDesignTone = (v?: string) =>
  ({ modern: '모던·심플', luxury: '럭셔리', friendly: '친근', auto: '알아서' })[v ?? ''] ?? '미선택'
const labelTimeline = (v?: string) =>
  ({ '2w': '2주', '1m': '1개월', '2m': '2개월', flex: '여유' })[v ?? ''] ?? '미선택'
const labelBudget = (v?: string) =>
  ({ lt200: '200만원 미만', '200-500': '200~500', '500-1000': '500~1000', '1000+': '1000+', unsure: '잘 모르겠음' })[
    v ?? ''
  ] ?? '미선택'
