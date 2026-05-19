// 어드민 리드 상세의 결제 내역 카드 (Phase 2 단계 3)
//
// 서버 컴포넌트 — payments 목록을 props 로 받아 렌더링.
// 각 행의 "링크 다시 복사" 만 클라이언트 컴포넌트.

import { formatDetailDate } from '@/lib/admin/leads'
import {
  PAYMENT_STATUS_CHIP,
  PAYMENT_STATUS_LABEL,
  PAYMENT_TYPE_LABEL,
  formatWon,
} from '@/config/payments'
import type { Payment } from '@/lib/payments/types'
import { PaymentLinkCopyButton } from './PaymentLinkCopyButton'

// 사장님이 도메인 연결 후 한 번에 교체 — layout.tsx / actions.ts 와 동일
const SITE_URL = 'https://easysite-sage.vercel.app'

export function PaymentsCard({ payments }: { payments: Payment[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <header>
        <h2 className="text-base font-bold text-gray-900">결제 내역</h2>
        <p className="mt-0.5 text-xs text-gray-500">
          이 리드의 결제 요청·승인 기록
        </p>
      </header>

      <div className="mt-4">
        {payments.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
            아직 결제 요청이 없어요.
            <p className="mt-1 text-xs text-gray-400">
              상단의 “결제 요청 생성” 버튼으로 첫 결제 링크를 만들어보세요.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {payments.map((p) => (
              <PaymentRow key={p.id} payment={p} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function PaymentRow({ payment }: { payment: Payment }) {
  const isPending = payment.status === 'pending'
  const paymentUrl = `${SITE_URL}/pay/${payment.id}`
  const dateLabel =
    payment.status === 'paid' && payment.paid_at
      ? `결제 ${formatDetailDate(payment.paid_at)}`
      : `생성 ${formatDetailDate(payment.created_at)}`

  return (
    <li className="py-4 first:pt-0 last:pb-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-6 items-center rounded-full bg-indigo-50 px-2.5 text-[11px] font-bold uppercase tracking-wider text-indigo-700">
              {PAYMENT_TYPE_LABEL[payment.payment_type]}
            </span>
            <span
              className={`inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-bold ring-1 ring-inset ${PAYMENT_STATUS_CHIP[payment.status]}`}
            >
              {PAYMENT_STATUS_LABEL[payment.status]}
            </span>
          </div>

          <p className="mt-1.5 text-xl font-bold tabular-nums text-gray-900">
            {formatWon(payment.amount)}
          </p>

          <p className="mt-1 text-xs tabular-nums text-gray-500">{dateLabel}</p>

          {payment.memo && (
            <p className="mt-2 rounded-md bg-gray-50 px-2.5 py-1.5 text-xs leading-relaxed text-gray-700">
              {payment.memo}
            </p>
          )}

          {payment.status === 'failed' && payment.fail_reason && (
            <p className="mt-2 rounded-md bg-red-50 px-2.5 py-1.5 text-xs leading-relaxed text-red-700">
              실패 사유: {payment.fail_reason}
            </p>
          )}
        </div>

        {isPending && (
          <div className="shrink-0">
            <PaymentLinkCopyButton paymentUrl={paymentUrl} />
          </div>
        )}
      </div>
    </li>
  )
}
