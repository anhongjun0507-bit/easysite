// 토스 결제 실패 콜백 — 사장님이 결제창에서 취소했거나 오류 발생 시 (Phase 2 단계 4)
//
// 토스가 failUrl 로 redirect 시 query 로 code / message / orderId 전달.

import { notFound, redirect } from 'next/navigation'
import {
  getPaymentWithLead,
  markPaymentFailed,
} from '@/lib/payments/db'

export const dynamic = 'force-dynamic'

const UUID_RE = /^[0-9a-f-]{36}$/i

type SearchParams = {
  code?: string | string[]
  message?: string | string[]
  orderId?: string | string[]
}

function pickFirst(v: string | string[] | undefined): string | null {
  if (v == null) return null
  return Array.isArray(v) ? (v[0] ?? null) : v
}

export default async function PaymentFailPage({
  params,
  searchParams,
}: {
  params: { paymentId: string }
  searchParams: SearchParams
}) {
  if (!UUID_RE.test(params.paymentId)) notFound()

  const code = pickFirst(searchParams.code)
  const message = pickFirst(searchParams.message)

  const reason =
    [code, message].filter(Boolean).join(' — ') || '사장님이 결제를 취소했어요'

  const payment = await getPaymentWithLead(params.paymentId)
  if (!payment) notFound()

  // pending 상태일 때만 failed 마킹 (paid 는 보호)
  if (payment.status === 'pending') {
    await markPaymentFailed(payment.id, reason)
  }

  // /pay/[id] 로 redirect — FailedView 또는 PaidView 자동 표시
  redirect(`/pay/${params.paymentId}`)
}
