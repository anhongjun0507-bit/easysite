/**
 * 챗봇 상담 진행 시 본인 텔레그램 알림 포맷터.
 * 트리거: 5턴+ OR 의향 키워드 OR 연락처 입력 (OR 조건).
 */

import type { ChatLeadContext } from './chat-prompt'
import { SITE_URL } from '@/lib/site'

export type ChatNotifyInput = {
  leadId: string
  reasons: string[]
  contact: {
    name?: string | null
    phone?: string | null
    email?: string | null
  }
  context: ChatLeadContext
  /** 직전까지의 대화 — user/assistant 메시지 시퀀스 (최대 마지막 5턴 = 10개) */
  recentMessages: Array<{ role: 'user' | 'assistant'; content: string }>
}

const escape = (v: string) =>
  v.replace(
    /[<>&]/g,
    (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c] ?? c,
  )

const SITE_TYPE_LABEL: Record<string, string> = {
  company: '회사·가게 소개',
  shop: '쇼핑몰',
  reservation: '예약·회원제',
  landing: '랜딩페이지',
  other: '기타',
}
const PAGE_LABEL: Record<string, string> = {
  small: '5개 이내',
  medium: '5~10개',
  large: '10개 이상',
  unsure: '미정',
}
const YN_LABEL: Record<string, string> = {
  yes: '필요',
  no: '불필요',
  unsure: '미정',
}
const TONE_LABEL: Record<string, string> = {
  modern: '모던·심플',
  luxury: '럭셔리',
  friendly: '친근',
  auto: '알아서',
}
const TIMELINE_LABEL: Record<string, string> = {
  '2w': '2주',
  '1m': '1개월',
  '2m': '2개월',
  flex: '여유',
}
const BUDGET_LABEL: Record<string, string> = {
  lt200: '200만원 미만',
  '200-500': '200~500',
  '500-1000': '500~1000',
  '1000+': '1000+',
  unsure: '미정',
}

export function formatChatNotification(input: ChatNotifyInput): string {
  const { leadId, reasons, contact, context, recentMessages } = input
  const lines: string[] = []

  lines.push('🔔 <b>새 챗봇 상담 진행</b>')
  lines.push('')
  lines.push('<b>알림 사유</b>')
  for (const r of reasons) lines.push(`• ${escape(r)}`)
  lines.push('')

  // 사장님 정보
  lines.push('<b>사장님</b>')
  if (contact.name) lines.push(`• 이름: ${escape(contact.name)}`)
  if (contact.phone) lines.push(`• 전화: <code>${escape(contact.phone)}</code>`)
  if (contact.email) lines.push(`• 이메일: ${escape(contact.email)}`)
  if (context.businessName)
    lines.push(`• 상호: ${escape(context.businessName)}`)
  if (context.industry) lines.push(`• 업종: ${escape(context.industry)}`)
  lines.push('')

  // 위저드 요약
  const w = context.wizard
  lines.push('<b>위저드 답변</b>')
  lines.push(`• 유형: ${labelOr(SITE_TYPE_LABEL, w.siteType)}`)
  lines.push(`• 페이지: ${labelOr(PAGE_LABEL, w.pageCount)}`)
  lines.push(`• 결제: ${labelOr(YN_LABEL, w.payment)}`)
  lines.push(`• AI: ${formatAiChat(w.aiChat)}`)
  lines.push(`• 디자인 톤: ${labelOr(TONE_LABEL, w.designTone)}`)
  lines.push(`• 납기: ${labelOr(TIMELINE_LABEL, w.timeline)}`)
  lines.push(`• 예산: ${labelOr(BUDGET_LABEL, w.budget)}`)
  lines.push('')

  // 견적
  const q = context.quote
  lines.push('<b>견적</b>')
  lines.push(`• 가격: <b>${q.priceMinManwon}~${q.priceMaxManwon}만원</b>`)
  lines.push(`• 기간: ${q.weeksMin}~${q.weeksMax}주`)
  lines.push('')

  // 챗봇 대화 — 마지막 5턴 (10개)
  if (recentMessages.length > 0) {
    lines.push('<b>최근 챗봇 대화</b>')
    for (const m of recentMessages.slice(-10)) {
      const role = m.role === 'user' ? '사장님' : 'AI'
      const content = escape(truncate(m.content, 300))
      lines.push(`<b>${role}:</b> ${content}`)
    }
    lines.push('')
  }

  lines.push(
    `<b>리드 ID</b>: <code>${escape(leadId)}</code>\n<a href="${SITE_URL}/wizard/result?leadId=${encodeURIComponent(leadId)}">사장님 결과 페이지 보기</a>`,
  )

  return lines.join('\n')
}

// ─────────────────────────────────────────────────────────────
// 통화 시간대 응답 — 의향 표시 후 시간대 칩 클릭 시 별도 알림 (P2-13)
// ─────────────────────────────────────────────────────────────

export type ChatTimeSlotInput = {
  leadId: string
  timeSlot: string
  contact: {
    name?: string | null
    phone?: string | null
    email?: string | null
  }
  businessName?: string | null
  industry?: string | null
}

export function formatChatTimeSlotNotification(
  input: ChatTimeSlotInput,
): string {
  const { leadId, timeSlot, contact, businessName, industry } = input
  const lines: string[] = []

  lines.push('💬 <b>챗봇 의향 표시 + 통화 시간대</b>')
  lines.push('')

  if (contact.name) lines.push(`<b>사장님</b>: ${escape(contact.name)}`)
  if (businessName) lines.push(`<b>상호</b>: ${escape(businessName)}`)
  if (industry) lines.push(`<b>업종</b>: ${escape(industry)}`)
  if (contact.phone)
    lines.push(`<b>전화</b>: <code>${escape(contact.phone)}</code>`)
  if (contact.email) lines.push(`<b>이메일</b>: ${escape(contact.email)}`)
  lines.push('')

  lines.push(`📞 <b>통화 시간대</b>: ${escape(timeSlot)}`)
  lines.push('')

  lines.push(
    `<b>리드 ID</b>: <code>${escape(leadId)}</code>\n<a href="${SITE_URL}/admin/leads/${encodeURIComponent(leadId)}">어드민 상세 보기</a>`,
  )

  return lines.join('\n')
}

const labelOr = (map: Record<string, string>, v?: string) =>
  v ? (map[v] ?? v) : '미응답'

function formatAiChat(v?: ChatLeadContext['wizard']['aiChat']): string {
  if (!v || v.needed === undefined) return '미응답'
  if (v.needed === true) {
    const d = v.detail?.trim()
    return d ? `필요 — ${escape(truncate(d, 120))}` : '필요'
  }
  if (v.needed === false) return '불필요'
  return '미정'
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s
  return s.slice(0, n - 1) + '…'
}
