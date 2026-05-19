// 어드민용 payments 조회 헬퍼 (Phase 2 단계 3)
import { createAdminClient } from '@/lib/supabase/admin'
import type { Payment, PaymentType } from '@/lib/payments/types'

export async function getLeadPayments(leadId: string): Promise<Payment[]> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('payments')
    .select(
      'id, lead_id, amount, payment_type, status, toss_order_id, toss_payment_key, memo, created_at, updated_at, paid_at, fail_reason',
    )
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data as Payment[]
}

/** 어드민 모달에서 "같은 유형 중복 생성" 경고용 — 기존 결제 유형 목록 */
export function getExistingPaymentTypes(payments: Payment[]): PaymentType[] {
  return Array.from(new Set(payments.map((p) => p.payment_type)))
}
