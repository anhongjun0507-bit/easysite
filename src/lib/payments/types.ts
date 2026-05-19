// payments 테이블 + 토스페이먼츠 연동 타입 정의 (Phase 2)
//
// 서버·클라이언트 양쪽에서 공유. SDK 미연결 상태에서도 import 안전.

export type PaymentType = 'first' | 'final' | 'full'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'canceled'

/** Supabase payments 테이블 행 — DB 스키마와 1:1 매핑 */
export type Payment = {
  id: string
  lead_id: string
  amount: number
  payment_type: PaymentType
  status: PaymentStatus
  toss_order_id: string
  toss_payment_key: string | null
  memo: string | null
  created_at: string
  updated_at: string
  paid_at: string | null
  fail_reason: string | null
}

/** 결제 요청 생성 input (어드민 모달에서 받음) */
export type CreatePaymentInput = {
  leadId: string
  amount: number
  paymentType: PaymentType
  memo?: string | null
}

// ───────────────────────────────────────────────────────────
// 토스페이먼츠 API 타입
// ───────────────────────────────────────────────────────────

/** 결제창에서 successUrl 으로 토스가 redirect 시 query 로 받는 값 */
export type TossSuccessQuery = {
  paymentKey: string
  orderId: string
  amount: string // 토스가 문자열로 보냄 — 서버에서 number 변환
}

/** 우리 서버 → 토스 결제 승인 API body */
export type TossConfirmRequest = {
  paymentKey: string
  orderId: string
  amount: number
}

/**
 * 토스 결제 승인 응답 (간략화 — 사용 필드만)
 * 전체 응답: https://docs.tosspayments.com/reference#payment-객체
 */
export type TossConfirmResponse = {
  paymentKey: string
  orderId: string
  status:
    | 'READY'
    | 'IN_PROGRESS'
    | 'WAITING_FOR_DEPOSIT'
    | 'DONE'
    | 'CANCELED'
    | 'PARTIAL_CANCELED'
    | 'ABORTED'
    | 'EXPIRED'
  totalAmount: number
  approvedAt: string | null
  method: string | null
  // 카드/가상계좌 등 method 별 상세 — 필요 시 확장
  card?: { number?: string; company?: string } | null
}

/** 토스 API 에러 응답 */
export type TossErrorBody = {
  code?: string
  message?: string
}
