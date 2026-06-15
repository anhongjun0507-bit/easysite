// 결제 관련 텔레그램 알림 — 본인 (안홍준) 전용 (Phase 2 단계 4)
//
// 기존 notifyTelegram(text) 헬퍼 재사용. 결제 완료 / 위변조 의심 두 케이스.

import { notifyTelegram } from '@/app/wizard/lib/telegram'
import { PAYMENT_TYPE_LABEL, formatWon } from '@/config/payments'
import type { PaymentWithLead } from './db'
import { SITE_URL } from '@/lib/site'

const escape = (v: string) =>
  v.replace(
    /[<>&]/g,
    (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c] ?? c,
  )

export async function notifyPaymentSuccess(p: PaymentWithLead): Promise<void> {
  const lines: string[] = []
  lines.push('💰 <b>결제 완료</b>')
  lines.push('')
  if (p.lead?.contact_name) lines.push(`• 이름: ${escape(p.lead.contact_name)}`)
  if (p.lead?.business_name) lines.push(`• 상호: ${escape(p.lead.business_name)}`)
  if (p.lead?.contact_phone)
    lines.push(`• 전화: <code>${escape(p.lead.contact_phone)}</code>`)
  lines.push('')
  lines.push(
    `• 금액: <b>${formatWon(p.amount)}</b> (${PAYMENT_TYPE_LABEL[p.payment_type]})`,
  )
  if (p.memo) lines.push(`• 메모: ${escape(p.memo)}`)
  lines.push('')
  if (p.lead?.id) {
    lines.push(
      `<a href="${SITE_URL}/admin/leads/${p.lead.id}">어드민 상세 보기</a>`,
    )
  }
  await notifyTelegram(lines.join('\n'))
}

/** 결제 콜백에서 amount/orderId 위변조 의심 시 — 즉시 알림 */
export async function notifyPaymentSuspicious(
  paymentId: string,
  reason: string,
): Promise<void> {
  const lines: string[] = []
  lines.push('🚨 <b>결제 검증 실패 — 의심 거래</b>')
  lines.push('')
  lines.push(`<b>사유</b>: ${escape(reason)}`)
  lines.push(`결제 ID: <code>${escape(paymentId)}</code>`)
  lines.push('')
  lines.push(`<a href="${SITE_URL}/admin/leads">어드민 리드 목록</a>`)
  await notifyTelegram(lines.join('\n'))
}

export async function notifyPaymentFailed(
  p: PaymentWithLead,
  reason: string,
): Promise<void> {
  const lines: string[] = []
  lines.push('⚠️ <b>결제 실패</b>')
  lines.push('')
  if (p.lead?.contact_name) lines.push(`• 이름: ${escape(p.lead.contact_name)}`)
  lines.push(
    `• 금액: ${formatWon(p.amount)} (${PAYMENT_TYPE_LABEL[p.payment_type]})`,
  )
  lines.push(`• 사유: ${escape(reason).slice(0, 200)}`)
  lines.push('')
  if (p.lead?.id) {
    lines.push(
      `<a href="${SITE_URL}/admin/leads/${p.lead.id}">어드민 상세 보기</a>`,
    )
  }
  await notifyTelegram(lines.join('\n'))
}
