// 결제 메타데이터 — UI 라벨·색상 매핑 (Phase 2)
//
// payments 테이블의 enum 값 (영문 키) → 한국어 라벨·Tailwind 클래스
// 어드민 결제 카드 / 결제 페이지 / 텔레그램 알림에서 공통 사용

import type { PaymentStatus, PaymentType } from '@/lib/payments/types'

export const PAYMENT_TYPE_LABEL: Record<PaymentType, string> = {
  first: '1차',
  final: '잔금',
  full: '전액',
}

/** 결제 유형 짧은 설명 — 어드민 모달 도움말 */
export const PAYMENT_TYPE_HELP: Record<PaymentType, string> = {
  first: '계약 시 50% 선결제',
  final: '검수 후 잔금 50%',
  full: '한 번에 전액',
}

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  pending: '대기',
  paid: '결제완료',
  failed: '실패',
  canceled: '취소',
}

/** 어드민 결제 카드 status chip — 기존 LEAD_STATUS_CHIP 톤과 일관 */
export const PAYMENT_STATUS_CHIP: Record<PaymentStatus, string> = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  paid: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  failed: 'bg-red-50 text-red-700 ring-red-200',
  canceled: 'bg-gray-100 text-gray-600 ring-gray-200',
}

/** 1차 결제 기본 비율 (어드민 모달 디폴트값) */
export const FIRST_PAYMENT_DEFAULT_RATIO = 0.5

/**
 * 금액(원) 포맷 — 1,200,000 → "120만원"
 * 어드민·결제 페이지·텔레그램 알림에서 사용
 */
export function formatManwon(amount: number): string {
  if (!Number.isFinite(amount) || amount < 0) return '-'
  const manwon = Math.round(amount / 10_000)
  return `${manwon.toLocaleString('ko-KR')}만원`
}

/** 금액(원) 풀 포맷 — 1,200,000 → "1,200,000원" (영수증·정식 표기용) */
export function formatWon(amount: number): string {
  if (!Number.isFinite(amount) || amount < 0) return '-'
  return `${amount.toLocaleString('ko-KR')}원`
}
