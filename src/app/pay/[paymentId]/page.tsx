// 사장님이 클릭하는 결제 페이지 (Phase 2 단계 4)
//
// 흐름:
//   링크 클릭 → 이 페이지 → 상태별 분기:
//     - pending + 토스 키 있음 → 결제 버튼 (PaymentButton)
//     - pending + 토스 키 없음 → "결제 시스템 준비 중" 안내
//     - paid → 결제 완료 안내
//     - failed → 실패 안내 + 본인 연락처
//     - canceled → 취소 안내

import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  PAYMENT_STATUS_LABEL,
  PAYMENT_TYPE_LABEL,
  formatWon,
} from '@/config/payments'
import { getPaymentWithLead, type PaymentWithLead } from '@/lib/payments/db'
import { getTossClientKey, hasTossKeys } from '@/lib/payments/toss'
import { PaymentButton } from './PaymentButton'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '결제',
  description: '지으리 결제 페이지',
  robots: { index: false, follow: false },
}

const UUID_RE = /^[0-9a-f-]{36}$/i

export default async function PaymentPage({
  params,
}: {
  params: { paymentId: string }
}) {
  if (!UUID_RE.test(params.paymentId)) notFound()

  const payment = await getPaymentWithLead(params.paymentId)
  if (!payment) notFound()

  return (
    <Chrome>
      {payment.status === 'paid' ? (
        <PaidView payment={payment} />
      ) : payment.status === 'canceled' ? (
        <SimpleStateView
          title="취소된 결제입니다"
          message="이 결제 요청은 취소됐어요. 새 결제 링크는 안홍준 대표가 다시 보내드릴게요."
        />
      ) : payment.status === 'failed' ? (
        <FailedView payment={payment} />
      ) : !hasTossKeys() ? (
        <NotReadyView payment={payment} />
      ) : (
        <PendingView
          payment={payment}
          clientKey={getTossClientKey() as string}
        />
      )}
    </Chrome>
  )
}

// ───────────────────────────────────────────────────────────
// 화면 wrapper — 미니멀 chrome (랜딩 헤더/푸터 미사용, LandingChrome 풀스크린)
// ───────────────────────────────────────────────────────────

function Chrome({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-5 sm:px-8">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-gray-900"
          >
            지으리
          </Link>
          <span className="text-xs font-medium text-gray-500">결제 페이지</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10 sm:px-8 sm:py-14">
        {children}
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-2xl px-6 py-6 text-center text-xs leading-relaxed text-gray-500 sm:px-8">
          프리즘 · 사업자 672-35-01596 · 대표 안홍준
          <br className="sm:hidden" />
          <span className="hidden sm:inline"> · </span>
          <a
            href="tel:01037825418"
            className="font-semibold text-gray-700 hover:text-gray-900"
          >
            010-3782-5418
          </a>
        </div>
      </footer>
    </div>
  )
}

// ───────────────────────────────────────────────────────────
// 1) Pending — 결제 진행
// ───────────────────────────────────────────────────────────

function PendingView({
  payment,
  clientKey,
}: {
  payment: PaymentWithLead
  clientKey: string
}) {
  return (
    <>
      <Greeting payment={payment} />

      <PaymentInfoCard payment={payment} />

      <div className="mt-8">
        <PaymentButton
          clientKey={clientKey}
          paymentId={payment.id}
          amount={payment.amount}
          orderId={payment.toss_order_id}
          paymentType={payment.payment_type}
          customerName={payment.lead?.contact_name ?? null}
          customerEmail={payment.lead?.contact_email ?? null}
        />
        <p className="mt-4 text-center text-xs text-gray-500">
          토스페이먼츠 결제창이 열립니다. 안전하게 결제됩니다.
        </p>
      </div>
    </>
  )
}

// ───────────────────────────────────────────────────────────
// 2) Not Ready — 토스 키 미설정 (가맹점 심사 진행 중)
// ───────────────────────────────────────────────────────────

function NotReadyView({ payment }: { payment: PaymentWithLead }) {
  return (
    <>
      <Greeting payment={payment} />

      <PaymentInfoCard payment={payment} />

      <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
        <p className="text-sm font-bold sm:text-base">결제 시스템 준비 중입니다</p>
        <p className="mt-1.5 text-sm leading-relaxed">
          현재 결제 시스템을 설정하는 중이에요. 안홍준 대표에게 직접 문의해
          주시면 다른 방법으로 결제를 도와드릴게요.
        </p>
        <a
          href="tel:01037825418"
          className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-lg bg-amber-600 px-4 text-sm font-bold text-white transition hover:bg-amber-700"
        >
          010-3782-5418 전화하기
        </a>
      </div>
    </>
  )
}

// ───────────────────────────────────────────────────────────
// 3) Paid — 결제 완료
// ───────────────────────────────────────────────────────────

function PaidView({ payment }: { payment: PaymentWithLead }) {
  return (
    <>
      <div className="text-center">
        <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
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
            <polyline points="5 12 10 17 19 8" />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
          결제가 완료되었어요
        </h1>
        <p className="mt-2 text-sm text-gray-600 sm:text-base">
          안홍준 대표가 곧 카톡으로 연락드릴게요.
        </p>
      </div>

      <div className="mt-8">
        <PaymentInfoCard payment={payment} />
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-sm font-bold text-gray-900">다음 단계</h2>
        <ol className="mt-3 space-y-2 text-sm leading-relaxed text-gray-700">
          <li>1. 본인이 카톡으로 시안과 제작 일정을 보내드려요.</li>
          <li>2. 사이트 위에서 직접 코멘트로 수정 요청하실 수 있어요.</li>
          <li>3. 검수 후 잔금 결제 안내드려요.</li>
        </ol>
      </div>
    </>
  )
}

// ───────────────────────────────────────────────────────────
// 4) Failed — 결제 실패
// ───────────────────────────────────────────────────────────

function FailedView({ payment }: { payment: PaymentWithLead }) {
  return (
    <>
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
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
          결제가 실패했어요
        </h1>
        {payment.fail_reason && (
          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            사유: {payment.fail_reason}
          </p>
        )}
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5 text-sm leading-relaxed text-gray-700">
        결제가 정상적으로 완료되지 않았어요. 안홍준 대표에게 직접 문의해
        주시면 빠르게 도와드릴게요.
        <a
          href="tel:01037825418"
          className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-lg bg-gray-900 px-4 text-sm font-bold text-white transition hover:bg-gray-700"
        >
          010-3782-5418 전화하기
        </a>
      </div>
    </>
  )
}

// ───────────────────────────────────────────────────────────
// 공통 컴포넌트
// ───────────────────────────────────────────────────────────

function Greeting({ payment }: { payment: PaymentWithLead }) {
  const name = payment.lead?.contact_name
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">
        {name ? `${name} 사장님, 안녕하세요` : '안녕하세요'}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">
        프리즘 안홍준 대표가 안내드리는 결제 페이지입니다.
      </p>
    </div>
  )
}

function PaymentInfoCard({ payment }: { payment: PaymentWithLead }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gradient-to-br from-indigo-50 to-white px-6 py-6 text-center">
        <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
          결제 금액
        </p>
        <p className="mt-1.5 text-4xl font-extrabold tabular-nums text-gray-900 sm:text-5xl">
          {formatWon(payment.amount)}
        </p>
        <p className="mt-1.5 inline-flex h-6 items-center rounded-full bg-indigo-600 px-2.5 text-[11px] font-bold uppercase tracking-wider text-white">
          {PAYMENT_TYPE_LABEL[payment.payment_type]} 결제
        </p>
      </div>

      <dl className="grid grid-cols-1 divide-y divide-gray-100 text-sm">
        {payment.lead?.contact_name && (
          <InfoRow label="이름" value={payment.lead.contact_name} />
        )}
        {payment.lead?.business_name && (
          <InfoRow label="상호" value={payment.lead.business_name} />
        )}
        {payment.lead?.contact_phone && (
          <InfoRow label="연락처" value={payment.lead.contact_phone} mono />
        )}
        <InfoRow label="상태" value={PAYMENT_STATUS_LABEL[payment.status]} />
      </dl>
    </div>
  )
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-3">
      <dt className="text-xs font-semibold text-gray-500">{label}</dt>
      <dd
        className={`truncate text-sm font-medium text-gray-900 ${mono ? 'tabular-nums' : ''}`}
      >
        {value}
      </dd>
    </div>
  )
}

function SimpleStateView({
  title,
  message,
}: {
  title: string
  message: string
}) {
  return (
    <div className="text-center">
      <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-500">
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
    </div>
  )
}
