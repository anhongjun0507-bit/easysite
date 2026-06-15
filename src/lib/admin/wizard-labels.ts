/**
 * 위저드 답변 코드 → 한국어 라벨.
 * 출처: src/app/wizard/lib/state.ts enum + src/app/wizard/actions.ts 텔레그램 라벨과 동일 매핑.
 * 상세 페이지의 "위저드 답변" 카드에서 사용.
 */

export const SITE_TYPE_LABEL_MAP: Record<string, string> = {
  company: '회사·가게 소개',
  shop: '쇼핑몰',
  reservation: '예약·회원제',
  landing: '랜딩페이지',
  other: '기타',
}

export const PAGE_COUNT_LABEL_MAP: Record<string, string> = {
  small: '5개 이내',
  medium: '5~10개',
  large: '10개 이상',
  unsure: '잘 모르겠음',
}

export const YES_NO_UNSURE_LABEL_MAP: Record<string, string> = {
  yes: '필요',
  no: '불필요',
  unsure: '잘 모르겠음',
}

export const DESIGN_TONE_LABEL_MAP: Record<string, string> = {
  modern: '모던·심플',
  luxury: '럭셔리',
  friendly: '친근',
  auto: '알아서',
  other: '기타',
}

/** 추가 기능 복수선택 → 라벨. v2 features {payment,admin,aiChat}. */
export function labelFeatures(
  f?: { payment?: boolean; admin?: boolean; aiChat?: boolean } | null,
): string {
  if (!f) return '미응답'
  const on: string[] = []
  if (f.payment) on.push('온라인 결제')
  if (f.admin) on.push('관리자 페이지')
  if (f.aiChat) on.push('AI 챗봇·자동화')
  return on.length ? on.join(' · ') : '없음'
}

export const TIMELINE_LABEL_MAP: Record<string, string> = {
  '2w': '2주 안에',
  '1m': '1개월',
  '2m': '2개월',
  flex: '여유롭게',
}

export const BUDGET_LABEL_MAP: Record<string, string> = {
  lt200: '200만원 미만',
  '200-500': '200~500만원',
  '500-1000': '500~1,000만원',
  '1000+': '1,000만원 이상',
  unsure: '잘 모르겠음',
}

export type AiChatAnswer =
  | { needed: true; detail?: string | null }
  | { needed: false }
  | { needed: 'unsure' }
  | null
  | undefined

export function labelAiChat(v: AiChatAnswer): string {
  if (!v || typeof v !== 'object') return '미응답'
  if (v.needed === true) {
    return v.detail ? `필요 — ${v.detail}` : '필요'
  }
  if (v.needed === false) return '불필요'
  return '잘 모르겠음'
}

/** 매핑 없거나 빈 값이면 "미응답" — 회색 처리에 활용 */
export function labelOrEmpty(
  map: Record<string, string>,
  v: string | null | undefined,
): { value: string; missing: boolean } {
  if (!v) return { value: '미응답', missing: true }
  const hit = map[v]
  if (!hit) return { value: v, missing: false }
  return { value: hit, missing: false }
}
