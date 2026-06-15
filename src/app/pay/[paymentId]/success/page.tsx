// 토스 결제 성공 콜백 — 우리 서버에서 승인 처리 후 완료 화면 (Phase 2 단계 4)
//
// 토스가 successUrl 로 redirect 시 query 로 paymentKey / orderId / amount 전달.
// 검증 흐름:
//   1. UUID 형식 검증
//   2. query 필수 값 검증
//   3. DB 의 toss_order_id 와 query orderId 일치 확인
//   4. DB 의 amount 와 query amount 일치 확인 (위변조 차단)
//   5. confirmTossPayment() 호출 — 토스 측에서도 amount 매칭
//   6. status='paid' UPDATE (race-safe: pending → paid)
//   7. 본인 텔레그램 알림

import type { ReactNode } from 'react'
import { notFound, redirect } from 'next/navigation'
import {
  getPaymentWithLead,
  markPaymentFailed,
  markPaymentPaid,
} from '@/lib/payments/db'
import {
  notifyPaymentSuccess,
  notifyPaymentSuspicious,
} from '@/lib/payments/notify'
import { confirmTossPayment } from '@/lib/payments/toss'

export const dynamic = 'force-dynamic'

const UUID_RE = /^[0-9a-f-]{36}$/i

type SearchParams = {
  paymentKey?: string | string[]
  orderId?: string | string[]
  amount?: string | string[]
}

function pickFirst(v: string | string[] | undefined): string | null {
  if (v == null) return null
  return Array.isArray(v) ? (v[0] ?? null) : v
}

export default async function PaymentSuccessPage({
  params,
  searchParams,
}: {
  params: { paymentId: string }
  searchParams: SearchParams
}) {
  if (!UUID_RE.test(params.paymentId)) notFound()

  const paymentKey = pickFirst(searchParams.paymentKey)
  const orderId = pickFirst(searchParams.orderId)
  const amountStr = pickFirst(searchParams.amount)

  if (!paymentKey || !orderId || !amountStr) {
    return (
      <CallbackError
        title="결제 정보가 누락됐어요"
        message="토스에서 받은 정보가 부족합니다. 새 결제 링크를 받아 다시 시도해주세요."
      />
    )
  }
  const amountNum = Number(amountStr)
  if (!Number.isFinite(amountNum) || amountNum <= 0) {
    return (
      <CallbackError
        title="결제 금액이 잘못됐어요"
        message="결제 금액 형식이 올바르지 않습니다."
      />
    )
  }

  const payment = await getPaymentWithLead(params.paymentId)
  if (!payment) notFound()

  // 이미 처리됐다면 결제 페이지로 (paid 화면 표시)
  if (payment.status === 'paid') {
    redirect(`/pay/${params.paymentId}`)
  }
  if (payment.status === 'canceled' || payment.status === 'failed') {
    return (
      <CallbackError
        title="이미 처리된 결제예요"
        message={`이 결제는 이미 "${payment.status}" 상태입니다. 안홍준 대표에게 문의해주세요.`}
      />
    )
  }

  // ── 검증 1: orderId 일치 ──
  if (payment.toss_order_id !== orderId) {
    const reason = `orderId 불일치 (요청 ${orderId} vs DB ${payment.toss_order_id})`
    await markPaymentFailed(payment.id, reason)
    await notifyPaymentSuspicious(payment.id, reason)
    return (
      <CallbackError
        title="결제 정보가 일치하지 않아요"
        message="결제 검증에 실패했어요. 안홍준 대표가 확인 후 연락드릴게요."
      />
    )
  }

  // ── 검증 2: amount 일치 (위변조 차단) ──
  if (payment.amount !== amountNum) {
    const reason = `amount 위변조 (요청 ${amountNum} vs DB ${payment.amount})`
    await markPaymentFailed(payment.id, reason)
    await notifyPaymentSuspicious(payment.id, reason)
    return (
      <CallbackError
        title="결제 금액이 일치하지 않아요"
        message="결제 검증에 실패했어요. 안홍준 대표가 확인 후 연락드릴게요."
      />
    )
  }

  // ── 토스 승인 ──
  try {
    const result = await confirmTossPayment({
      paymentKey,
      orderId,
      amount: amountNum,
    })
    const paidAt = result.approvedAt ?? new Date().toISOString()
    const updateResult = await markPaymentPaid(payment.id, paymentKey, paidAt)
    if (!updateResult.ok) {
      // race condition (다른 요청이 먼저 처리) — 단순히 결제 페이지로
      redirect(`/pay/${params.paymentId}`)
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : '결제 승인 실패'
    await markPaymentFailed(payment.id, message)
    return (
      <CallbackError
        title="결제 승인에 실패했어요"
        message="토스 결제 승인 처리 중 문제가 발생했어요. 안홍준 대표가 확인 후 연락드릴게요."
      />
    )
  }

  // 알림 — 최신 상태로 다시 조회
  const refreshed = await getPaymentWithLead(payment.id)
  if (refreshed) {
    await notifyPaymentSuccess(refreshed)
  }

  // 결제 페이지(/pay/[id])로 redirect — PaidView 자동 표시
  redirect(`/pay/${params.paymentId}`)
}

// ───────────────────────────────────────────────────────────
// 콜백 에러 화면 (검증 실패 등)
// ───────────────────────────────────────────────────────────

function CallbackError({
  title,
  message,
}: {
  title: string
  message: string
}): ReactNode {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-2xl px-6 py-5 sm:px-8">
          <span className="text-lg font-bold tracking-tight text-gray-900">
            지으리
          </span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10 sm:px-8 sm:py-14">
        <div className="text-center">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">
            {message}
          </p>
          <a
            href="tel:01037825418"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-gray-900 px-6 text-sm font-bold text-white transition hover:bg-gray-700"
          >
            010-3782-5418 전화하기
          </a>
        </div>
      </main>
    </div>
  )
}
