'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { isAdminSessionValid } from '@/lib/admin/auth'
import { isLeadStatusKey } from '@/lib/admin/status'
import { createAdminClient } from '@/lib/supabase/admin'
import type { PaymentType } from '@/lib/payments/types'
import { SITE_URL } from '@/lib/site'

const UUID_RE = /^[0-9a-f-]{36}$/i
const MEMO_MAX = 5000
const PAYMENT_TYPES: ReadonlySet<PaymentType> = new Set<PaymentType>([
  'first',
  'final',
  'full',
])

export type ActionResult = { ok: true } | { ok: false; error: string }

/** 어드민 인증 + UUID 검증 공통 가드 — 거부 케이스만 리턴 */
function guard(id: string): { ok: false; error: string } | null {
  if (!isAdminSessionValid()) return { ok: false, error: '인증이 만료됐어요. 다시 로그인해주세요.' }
  if (!UUID_RE.test(id)) return { ok: false, error: '잘못된 리드 ID' }
  return null
}

export async function updateLeadStatusAction(
  id: string,
  status: string,
): Promise<ActionResult> {
  const denied = guard(id)
  if (denied) return denied
  if (!isLeadStatusKey(status)) {
    return { ok: false, error: '잘못된 상태 값' }
  }
  const admin = createAdminClient()
  const { error } = await admin
    .from('leads')
    .update({ status })
    .eq('id', id)
  if (error) {
    // CHECK 제약 위반 등 — 사용자에게 friendly 메시지
    return {
      ok: false,
      error:
        error.code === '23514'
          ? 'DB 상태 제약이 옛 값이라 막혔어요. supabase/migrations/20260519000001_leads_status_canonical.sql 적용 필요'
          : '저장 실패: ' + error.message,
    }
  }
  revalidatePath(`/admin/leads/${id}`)
  revalidatePath('/admin/leads')
  revalidatePath('/admin')
  return { ok: true }
}

export async function updateLeadMemoAction(
  id: string,
  memo: string,
): Promise<ActionResult> {
  const denied = guard(id)
  if (denied) return denied
  if (typeof memo !== 'string') return { ok: false, error: '잘못된 입력' }
  if (memo.length > MEMO_MAX) {
    return { ok: false, error: `메모는 ${MEMO_MAX}자 이내로 적어주세요` }
  }
  const admin = createAdminClient()
  const { error } = await admin
    .from('leads')
    .update({ admin_memo: memo })
    .eq('id', id)
  if (error) {
    return { ok: false, error: '저장 실패: ' + error.message }
  }
  // 메모는 list 페이지엔 안 보이므로 detail만 revalidate
  revalidatePath(`/admin/leads/${id}`)
  return { ok: true }
}

// ────────────────────────────────────────────────────────────
// payments — Phase 2 단계 3
// ────────────────────────────────────────────────────────────

export type CreatePaymentActionResult =
  | { ok: true; paymentId: string; paymentUrl: string }
  | { ok: false; error: string }

const PAYMENT_MEMO_MAX = 500

export async function createPaymentRequestAction(
  leadId: string,
  input: { amount: number; paymentType: PaymentType; memo?: string | null },
): Promise<CreatePaymentActionResult> {
  const denied = guard(leadId)
  if (denied) return denied

  // 입력 검증
  if (!Number.isFinite(input.amount) || !Number.isInteger(input.amount)) {
    return { ok: false, error: '결제 금액은 정수만 입력 가능해요' }
  }
  if (input.amount <= 0) {
    return { ok: false, error: '결제 금액이 0보다 커야 해요' }
  }
  if (input.amount > 100_000_000) {
    return { ok: false, error: '1억원 초과 결제는 별도 협의로 처리해주세요' }
  }
  if (!PAYMENT_TYPES.has(input.paymentType)) {
    return { ok: false, error: '잘못된 결제 유형' }
  }
  if (input.memo != null) {
    if (typeof input.memo !== 'string') {
      return { ok: false, error: '메모 형식이 잘못됐어요' }
    }
    if (input.memo.length > PAYMENT_MEMO_MAX) {
      return {
        ok: false,
        error: `메모는 ${PAYMENT_MEMO_MAX}자 이내로 적어주세요`,
      }
    }
  }

  const tossOrderId = randomUUID()
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('payments')
    .insert({
      lead_id: leadId,
      amount: input.amount,
      payment_type: input.paymentType,
      toss_order_id: tossOrderId,
      memo: input.memo?.trim() || null,
    })
    .select('id')
    .single()

  if (error || !data) {
    return {
      ok: false,
      error: '결제 요청 생성 실패: ' + (error?.message ?? '알 수 없음'),
    }
  }

  revalidatePath(`/admin/leads/${leadId}`)

  return {
    ok: true,
    paymentId: data.id,
    paymentUrl: `${SITE_URL}/pay/${data.id}`,
  }
}
