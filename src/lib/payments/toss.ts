// 토스페이먼츠 추상화 레이어 (Phase 2 단계 2)
//
// 구조:
//   - 서버 사이드: 환경변수 접근 + 결제 승인/취소 API 호출
//   - 클라이언트 사이드: SDK dynamic import + 결제창 호출
//
// 환경변수 미설정 상태(가맹점 심사 진행 중)에서도 빌드 통과.
// 결제 페이지 진입 시 hasTossKeys() 로 키 유무 확인 → 없으면 안내 UI 표시.

import type {
  TossConfirmRequest,
  TossConfirmResponse,
  TossErrorBody,
} from './types'

const TOSS_API_BASE = 'https://api.tosspayments.com/v1'

// ───────────────────────────────────────────────────────────
// 환경변수 핸들링 (서버 사이드)
// ───────────────────────────────────────────────────────────

/**
 * 토스 키가 설정되어 있는지 — 결제 페이지에서 진입 가드용.
 * 키 placeholder (test_ck_DEMO 등) 도 미설정으로 간주.
 */
export function hasTossKeys(): boolean {
  const clientKey = process.env.TOSS_CLIENT_KEY
  const secretKey = process.env.TOSS_SECRET_KEY
  if (!clientKey || !secretKey) return false
  // 의미 있는 키만 인정
  if (!clientKey.startsWith('test_ck_') && !clientKey.startsWith('live_ck_'))
    return false
  if (!secretKey.startsWith('test_sk_') && !secretKey.startsWith('live_sk_'))
    return false
  return true
}

/**
 * 결제 페이지(server component)에서 호출해 client 컴포넌트로 props 전달.
 * NEXT_PUBLIC_ 접두사 없이도 server → client props 경로로 노출 OK.
 * 키 미설정 시 null 반환 — 호출자가 처리.
 */
export function getTossClientKey(): string | null {
  const k = process.env.TOSS_CLIENT_KEY
  return k && (k.startsWith('test_ck_') || k.startsWith('live_ck_')) ? k : null
}

class TossKeysMissingError extends Error {
  constructor() {
    super('TOSS_KEYS_MISSING: TOSS_CLIENT_KEY / TOSS_SECRET_KEY 환경변수가 설정되지 않았습니다.')
    this.name = 'TossKeysMissingError'
  }
}

export class TossApiError extends Error {
  code: string
  status: number
  constructor(message: string, code: string, status: number) {
    super(message)
    this.name = 'TossApiError'
    this.code = code
    this.status = status
  }
}

function getSecretKeyOrThrow(): string {
  const secretKey = process.env.TOSS_SECRET_KEY
  if (!secretKey) throw new TossKeysMissingError()
  return secretKey
}

function buildAuthHeader(secretKey: string): string {
  // 토스 Basic Auth: base64("{secretKey}:")
  return 'Basic ' + Buffer.from(`${secretKey}:`).toString('base64')
}

// ───────────────────────────────────────────────────────────
// 서버 사이드 — 결제 승인 / 취소
// ───────────────────────────────────────────────────────────

/**
 * 토스 결제 승인 — successUrl 콜백에서 호출.
 * 사장님이 결제창에서 결제 완료 후 토스가 우리 successUrl 로 redirect 하면
 * paymentKey/orderId/amount 를 받아 이 함수로 승인 처리.
 */
export async function confirmTossPayment(
  input: TossConfirmRequest,
): Promise<TossConfirmResponse> {
  const secretKey = getSecretKeyOrThrow()

  const res = await fetch(`${TOSS_API_BASE}/payments/confirm`, {
    method: 'POST',
    headers: {
      Authorization: buildAuthHeader(secretKey),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
    // 콜백에서 호출되므로 캐시 비활성화
    cache: 'no-store',
  })

  if (!res.ok) {
    const err: TossErrorBody = await res.json().catch(() => ({}))
    throw new TossApiError(
      err.message ?? '결제 승인에 실패했습니다.',
      err.code ?? `HTTP_${res.status}`,
      res.status,
    )
  }

  return (await res.json()) as TossConfirmResponse
}

/**
 * 토스 결제 취소 — Phase 2-2 (환불) 또는 어드민에서 사용.
 * paymentKey 는 토스가 발급한 키 (payments.toss_payment_key 컬럼).
 */
export async function cancelTossPayment(
  paymentKey: string,
  reason: string,
): Promise<TossConfirmResponse> {
  const secretKey = getSecretKeyOrThrow()

  const res = await fetch(`${TOSS_API_BASE}/payments/${paymentKey}/cancel`, {
    method: 'POST',
    headers: {
      Authorization: buildAuthHeader(secretKey),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cancelReason: reason }),
    cache: 'no-store',
  })

  if (!res.ok) {
    const err: TossErrorBody = await res.json().catch(() => ({}))
    throw new TossApiError(
      err.message ?? '결제 취소에 실패했습니다.',
      err.code ?? `HTTP_${res.status}`,
      res.status,
    )
  }

  return (await res.json()) as TossConfirmResponse
}

// ───────────────────────────────────────────────────────────
// 클라이언트 사이드 — SDK dynamic import
// ───────────────────────────────────────────────────────────

/**
 * 토스 결제창 호출 input — 결제 페이지의 'use client' 컴포넌트에서 사용.
 * customerKey 는 동일 사장님의 결제를 묶기 위한 식별자 (옵션: lead_id 활용).
 */
export type RequestTossPaymentInput = {
  clientKey: string
  amount: number
  orderId: string
  orderName: string
  customerName?: string
  customerEmail?: string
  successUrl: string
  failUrl: string
}

/**
 * 결제창 호출 (클라이언트 전용).
 * SDK 는 window 객체 의존이라 dynamic import — 서버 번들에 포함 안 됨.
 *
 * 호출 후 토스가 사장님 화면을 결제창으로 redirect → 결제 완료 시
 * successUrl 으로 돌아옴 (paymentKey, orderId, amount query 포함).
 */
export async function requestTossPayment(
  input: RequestTossPaymentInput,
): Promise<void> {
  const { loadTossPayments } = await import('@tosspayments/payment-sdk')
  const tossPayments = await loadTossPayments(input.clientKey)

  await tossPayments.requestPayment('카드', {
    amount: input.amount,
    orderId: input.orderId,
    orderName: input.orderName,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    successUrl: input.successUrl,
    failUrl: input.failUrl,
  })
}
