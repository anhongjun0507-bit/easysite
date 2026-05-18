import type { SiteType } from './state'

/** Hero "자주 찾는 분야" 칩 — 직접 매핑 (정확) */
const CHIP_MAP: Record<string, SiteType> = {
  '학원·교육': 'company',
  '쇼핑몰': 'shop',
  '회사 소개': 'company',
  '주문·예약': 'reservation',
}

/** 자유 입력 키워드 매칭 — 우선순위 순서 유지 */
const KEYWORD_MAP: Array<{ type: SiteType; keywords: string[] }> = [
  { type: 'shop', keywords: ['쇼핑', '커머스', '상품', '판매', '스토어', '몰'] },
  {
    type: 'reservation',
    keywords: ['예약', '회원', '주문', '배달', '클래스', '레슨'],
  },
  {
    type: 'company',
    keywords: [
      '학원',
      '교육',
      '회사',
      '소개',
      '병원',
      '클리닉',
      '카페',
      '식당',
      '한식',
      '한식당',
      '음식',
    ],
  },
  { type: 'landing', keywords: ['랜딩', '이벤트', '캠페인', '프로모션'] },
]

/**
 * Hero에서 들어온 intent 문자열을 siteType으로 매핑.
 * - chip 정확 매칭 우선
 * - 키워드 부분 매칭 fallback
 * - 매칭 실패 시 undefined → step 1에서 직접 선택
 */
export function mapIntent(raw: string | undefined): SiteType | undefined {
  if (!raw) return undefined
  const trimmed = raw.trim()
  if (!trimmed) return undefined

  if (CHIP_MAP[trimmed]) return CHIP_MAP[trimmed]
  // chip 텍스트가 " 사이트" 같은 suffix를 가진 경우 (Hero 칩 링크)
  for (const [chip, type] of Object.entries(CHIP_MAP)) {
    if (trimmed.startsWith(chip)) return type
  }

  for (const { type, keywords } of KEYWORD_MAP) {
    if (keywords.some((kw) => trimmed.includes(kw))) return type
  }
  return undefined
}
