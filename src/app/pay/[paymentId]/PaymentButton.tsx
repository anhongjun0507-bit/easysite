'use client'

// 토스페이먼츠 결제창 호출 — 사장님이 클릭하는 큰 버튼 (Phase 2 단계 4)
//
// 부모(server)가 hasTossKeys() / 상태 검증 후 노출. 여기서는 SDK 만 호출.

import { useState } from 'react'
import { requestTossPayment } from '@/lib/payments/toss'
import { PAYMENT_TYPE_LABEL } from '@/config/payments'
import type { PaymentType } from '@/lib/payments/types'

type Props = {
  clientKey: string
  paymentId: string
  amount: number
  orderId: string
  paymentType: PaymentType
  customerName: string | null
  customerEmail: string | null
}

export function PaymentButton({
  clientKey,
  paymentId,
  amount,
  orderId,
  paymentType,
  customerName,
  customerEmail,
}: Props) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    setError(null)
    setPending(true)
    try {
      const origin = window.location.origin
      await requestTossPayment({
        clientKey,
        amount,
        orderId,
        orderName: `프리즘 EasySite · ${PAYMENT_TYPE_LABEL[paymentType]} 결제`,
        customerName: customerName ?? undefined,
        customerEmail: customerEmail ?? undefined,
        successUrl: `${origin}/pay/${paymentId}/success`,
        failUrl: `${origin}/pay/${paymentId}/fail`,
      })
      // requestPayment 가 성공하면 페이지 자체가 토스로 redirect 됨.
      // 여기 도달했다는 건 호출은 했는데 redirect 가 안 일어났다는 뜻 — 보통 발생 안 함.
    } catch (e) {
      setPending(false)
      // 사장님 cancel 또는 SDK 에러
      const message =
        e instanceof Error
          ? e.message
          : '결제창을 열 수 없어요. 잠시 후 다시 시도해주세요.'
      setError(message)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-indigo-600 px-6 text-base font-bold text-white shadow-md transition hover:bg-indigo-700 disabled:opacity-60 sm:text-lg"
      >
        {pending ? '결제창 여는 중…' : '결제하기'}
      </button>
      {error && (
        <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}
