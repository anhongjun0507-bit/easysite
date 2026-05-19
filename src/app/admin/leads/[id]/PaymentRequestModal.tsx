'use client'

// 어드민 결제 요청 생성 모달 (Phase 2 단계 3)
//
// 흐름:
//   1. 입력 단계: 총액·결제 유형·1차 비율·메모
//   2. 같은 paymentType 이미 있을 경우 confirm 한 번
//   3. 서버 액션 성공 → 결과 화면 전환 → 결제 링크 + 복사 버튼

import { useEffect, useId, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  FIRST_PAYMENT_DEFAULT_RATIO,
  PAYMENT_TYPE_HELP,
  PAYMENT_TYPE_LABEL,
  formatWon,
} from '@/config/payments'
import type { PaymentType } from '@/lib/payments/types'
import { createPaymentRequestAction } from './actions'
import { showToast } from './Toaster'

type Props = {
  leadId: string
  existingTypes: PaymentType[]
}

const PAYMENT_TYPE_OPTIONS: PaymentType[] = ['first', 'final', 'full']

export function PaymentRequestModal({ leadId, existingTypes }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 items-center gap-1.5 rounded-md bg-indigo-600 px-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <rect x="3" y="6" width="18" height="13" rx="2" />
          <path d="M3 10h18" />
          <path d="M7 15h3" />
        </svg>
        결제 요청 생성
      </button>

      {open && (
        <ModalInner
          leadId={leadId}
          existingTypes={existingTypes}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

function ModalInner({
  leadId,
  existingTypes,
  onClose,
}: Props & { onClose: () => void }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  // 입력 상태
  const [totalManwon, setTotalManwon] = useState('') // 만원 단위 입력 (UI 단순화)
  const [paymentType, setPaymentType] = useState<PaymentType>('first')
  const [firstRatio, setFirstRatio] = useState<number>(
    FIRST_PAYMENT_DEFAULT_RATIO,
  )
  const [memo, setMemo] = useState('')
  const [error, setError] = useState<string | null>(null)

  // 결과 상태 (성공 시 표시)
  const [result, setResult] = useState<{ paymentUrl: string } | null>(null)

  // ESC 로 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const totalWon = parseManwonToWon(totalManwon)

  const computedPayment = useMemo(() => {
    if (totalWon == null || totalWon <= 0) return null
    if (paymentType === 'full') return totalWon
    if (paymentType === 'first') {
      return Math.round(totalWon * firstRatio)
    }
    // final: 잔금 기본 50% (사장님 운영 단순화 — 필요 시 슬라이더 추가)
    return Math.round(totalWon * (1 - FIRST_PAYMENT_DEFAULT_RATIO))
  }, [totalWon, paymentType, firstRatio])

  const submit = (skipConfirm = false) => {
    setError(null)
    if (totalWon == null || totalWon <= 0) {
      setError('총 견적 금액을 정확히 입력해주세요')
      return
    }
    if (computedPayment == null || computedPayment <= 0) {
      setError('결제 금액이 0보다 커야 해요')
      return
    }
    if (totalWon > 100_000_000) {
      setError('1억원 초과는 별도 협의로 처리해주세요')
      return
    }
    // 중복 유형 경고
    if (!skipConfirm && existingTypes.includes(paymentType)) {
      const label = PAYMENT_TYPE_LABEL[paymentType]
      const ok = window.confirm(
        `이미 "${label}" 결제 요청이 있어요. 그래도 새로 만들까요?`,
      )
      if (!ok) return
    }

    startTransition(async () => {
      const res = await createPaymentRequestAction(leadId, {
        amount: computedPayment,
        paymentType,
        memo: memo.trim() || null,
      })
      if (!res.ok) {
        setError(res.error)
        return
      }
      setResult({ paymentUrl: res.paymentUrl })
      router.refresh() // PaymentsCard 갱신
    })
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-gray-900/50 p-0 sm:items-center sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        {result ? (
          <ResultView paymentUrl={result.paymentUrl} onClose={onClose} />
        ) : (
          <FormView
            paymentType={paymentType}
            setPaymentType={setPaymentType}
            totalManwon={totalManwon}
            setTotalManwon={setTotalManwon}
            firstRatio={firstRatio}
            setFirstRatio={setFirstRatio}
            memo={memo}
            setMemo={setMemo}
            error={error}
            pending={pending}
            computedPayment={computedPayment}
            existingTypes={existingTypes}
            onClose={onClose}
            onSubmit={() => submit(false)}
          />
        )}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// Form (입력 단계)
// ────────────────────────────────────────────────────────────

function FormView({
  paymentType,
  setPaymentType,
  totalManwon,
  setTotalManwon,
  firstRatio,
  setFirstRatio,
  memo,
  setMemo,
  error,
  pending,
  computedPayment,
  existingTypes,
  onClose,
  onSubmit,
}: {
  paymentType: PaymentType
  setPaymentType: (v: PaymentType) => void
  totalManwon: string
  setTotalManwon: (v: string) => void
  firstRatio: number
  setFirstRatio: (v: number) => void
  memo: string
  setMemo: (v: string) => void
  error: string | null
  pending: boolean
  computedPayment: number | null
  existingTypes: PaymentType[]
  onClose: () => void
  onSubmit: () => void
}) {
  const totalId = useId()
  const typeId = useId()
  const ratioId = useId()
  const memoId = useId()

  return (
    <>
      <header className="flex items-start justify-between gap-3 border-b border-gray-200 px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
        <div>
          <h2
            id="payment-modal-title"
            className="text-lg font-bold text-gray-900 sm:text-xl"
          >
            결제 요청 생성
          </h2>
          <p className="mt-0.5 text-xs text-gray-500">
            링크를 만들어 사장님에게 카톡으로 보낼 수 있어요
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </header>

      <div className="space-y-5 px-5 py-5 sm:px-6">
        {/* 총 견적 금액 */}
        <div>
          <label
            htmlFor={totalId}
            className="block text-sm font-semibold text-gray-900"
          >
            총 견적 금액 <span className="text-gray-500">(만원 단위)</span>
          </label>
          <div className="mt-1.5 flex items-center gap-2">
            <input
              id={totalId}
              type="text"
              inputMode="numeric"
              value={totalManwon}
              onChange={(e) =>
                setTotalManwon(e.target.value.replace(/[^\d]/g, ''))
              }
              placeholder="예: 200"
              className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-base font-medium tabular-nums text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <span className="shrink-0 text-sm font-semibold text-gray-700">
              만원
            </span>
          </div>
        </div>

        {/* 결제 유형 */}
        <div>
          <label
            htmlFor={typeId}
            className="block text-sm font-semibold text-gray-900"
          >
            결제 유형
          </label>
          <div
            id={typeId}
            role="radiogroup"
            aria-label="결제 유형"
            className="mt-1.5 grid grid-cols-3 gap-2"
          >
            {PAYMENT_TYPE_OPTIONS.map((t) => {
              const selected = t === paymentType
              const isDup = existingTypes.includes(t)
              return (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setPaymentType(t)}
                  className={`inline-flex h-11 items-center justify-center rounded-md border px-3 text-sm font-semibold transition ${
                    selected
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-gray-300 bg-white text-gray-800 hover:border-gray-400'
                  }`}
                >
                  {PAYMENT_TYPE_LABEL[t]}
                  {isDup && (
                    <span
                      aria-label="이미 생성됨"
                      className={`ml-1 inline-block h-1.5 w-1.5 rounded-full ${
                        selected ? 'bg-white' : 'bg-amber-400'
                      }`}
                    />
                  )}
                </button>
              )
            })}
          </div>
          <p className="mt-1.5 text-xs text-gray-500">
            {PAYMENT_TYPE_HELP[paymentType]}
            {existingTypes.includes(paymentType) && (
              <span className="ml-1 font-semibold text-amber-700">
                · 같은 유형이 이미 있어요
              </span>
            )}
          </p>
        </div>

        {/* 1차 비율 — 1차일 때만 */}
        {paymentType === 'first' && (
          <div>
            <div className="flex items-baseline justify-between">
              <label
                htmlFor={ratioId}
                className="block text-sm font-semibold text-gray-900"
              >
                1차 비율
              </label>
              <span className="text-sm font-bold tabular-nums text-indigo-700">
                {Math.round(firstRatio * 100)}%
              </span>
            </div>
            <input
              id={ratioId}
              type="range"
              min={10}
              max={100}
              step={5}
              value={Math.round(firstRatio * 100)}
              onChange={(e) => setFirstRatio(Number(e.target.value) / 100)}
              className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-indigo-600"
            />
          </div>
        )}

        {/* 결제 금액 (자동 계산) */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            이번 결제 금액 (자동 계산)
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-gray-900">
            {computedPayment != null && computedPayment > 0
              ? formatWon(computedPayment)
              : '—'}
          </p>
        </div>

        {/* 메모 */}
        <div>
          <label
            htmlFor={memoId}
            className="block text-sm font-semibold text-gray-900"
          >
            메모 <span className="font-normal text-gray-500">(어드민용, 사장님 비노출)</span>
          </label>
          <textarea
            id={memoId}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="예: 한식당 사이트 1차, 5월 25일 결제 약속"
            rows={3}
            maxLength={500}
            className="mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      <footer className="flex flex-col gap-2 border-t border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row-reverse sm:px-6">
        <button
          type="button"
          onClick={onSubmit}
          disabled={pending}
          className="inline-flex h-12 items-center justify-center rounded-md bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {pending ? '생성 중…' : '결제 링크 생성'}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={pending}
          className="inline-flex h-12 items-center justify-center rounded-md border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:border-gray-400"
        >
          취소
        </button>
      </footer>
    </>
  )
}

// ────────────────────────────────────────────────────────────
// Result (성공 화면)
// ────────────────────────────────────────────────────────────

function ResultView({
  paymentUrl,
  onClose,
}: {
  paymentUrl: string
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(paymentUrl)
      setCopied(true)
      showToast('결제 링크 복사됨')
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast('복사 실패. 직접 선택해서 복사해주세요', 'error')
    }
  }

  return (
    <>
      <header className="px-5 pb-1 pt-6 text-center sm:px-6">
        <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <polyline points="5 12 10 17 19 8" />
          </svg>
        </div>
        <h2 className="mt-3 text-lg font-bold text-gray-900 sm:text-xl">
          결제 링크가 만들어졌어요
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          이 링크를 사장님에게 카톡으로 보내주세요.
        </p>
      </header>

      <div className="px-5 py-5 sm:px-6">
        <a
          href={paymentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block break-all rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-center text-sm font-medium text-indigo-700 underline-offset-2 hover:bg-gray-100 hover:underline"
        >
          {paymentUrl}
        </a>
      </div>

      <footer className="flex flex-col gap-2 border-t border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row-reverse sm:px-6">
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {copied ? '복사됨' : '링크 복사'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-12 items-center justify-center rounded-md border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:border-gray-400"
        >
          닫기
        </button>
      </footer>
    </>
  )
}

// ────────────────────────────────────────────────────────────
// 헬퍼
// ────────────────────────────────────────────────────────────

function parseManwonToWon(raw: string): number | null {
  if (!raw) return null
  const n = Number(raw)
  if (!Number.isFinite(n) || n <= 0) return null
  return n * 10_000
}
