// 결제 페이지·콜백용 서버 사이드 헬퍼 (Phase 2 단계 4)
//
// 사장님이 클릭하는 /pay 라우트 · 어드민 페이지 양쪽에서 사용.
// 모든 read/write 는 service_role 클라이언트 — RLS 우회.

import { createAdminClient } from '@/lib/supabase/admin'
import type { Payment, PaymentStatus } from './types'

export type PaymentWithLead = Payment & {
  lead: {
    id: string
    contact_name: string | null
    contact_phone: string | null
    contact_email: string | null
    business_name: string | null
    industry: string | null
  } | null
}

export async function getPaymentWithLead(
  paymentId: string,
): Promise<PaymentWithLead | null> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('payments')
    .select(
      `id, lead_id, amount, payment_type, status, toss_order_id, toss_payment_key, memo, created_at, updated_at, paid_at, fail_reason,
       lead:leads(id, contact_name, contact_phone, contact_email, business_name, industry)`,
    )
    .eq('id', paymentId)
    .maybeSingle()
  if (error || !data) return null
  return data as unknown as PaymentWithLead
}

export async function markPaymentPaid(
  paymentId: string,
  paymentKey: string,
  paidAt: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = createAdminClient()
  const { error } = await admin
    .from('payments')
    .update({
      status: 'paid' satisfies PaymentStatus,
      toss_payment_key: paymentKey,
      paid_at: paidAt,
    })
    .eq('id', paymentId)
    .eq('status', 'pending') // race-condition 보호: pending → paid 만 허용
  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function markPaymentFailed(
  paymentId: string,
  reason: string,
): Promise<void> {
  const admin = createAdminClient()
  await admin
    .from('payments')
    .update({
      status: 'failed' satisfies PaymentStatus,
      fail_reason: reason.slice(0, 500),
    })
    .eq('id', paymentId)
    .eq('status', 'pending')
}
