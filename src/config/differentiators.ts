// EasySite 4가지 차별점 — CLAUDE.md §1-4 4가지 축 그대로
// PainPoints 4개와 1:1 대응 (answersPainPointId)
//
// 톤 가이드 (CLAUDE.md §3-3):
//  - "사장님 옆에서 설명하듯" 친근체 (...해요/돼요)
//  - description은 한 줄 핵심 + 부연 (50자 내외)
//  - example은 구체 시나리오 한 줄 (예: 형식)

export type Differentiator = {
  id: string
  title: string
  description: string
  example?: string
  /** 아이콘 이름 — Differentiators.tsx의 iconMap에서 매칭 */
  icon: 'clock' | 'sparkles' | 'comment' | 'tag'
  /** Pain point this answers (see src/config/pain-points.ts) */
  answersPainPointId?: string
}

export const differentiators: Differentiator[] = [
  {
    id: 'fast-quote',
    title: '24시간 안에 견적이랑 미리보기까지',
    description:
      '다른 곳은 견적 받는 데만 2주씩 걸려요. 우리는 다음 날 사이트 미리보기까지 함께 보내드려요.',
    example: '예: 평일 오후 신청 → 다음 날 오전 견적·시안 도착',
    icon: 'clock',
    answersPainPointId: 'slow-quote',
  },
  {
    id: 'ai-copy',
    title: '글 쓸 일이 없어요',
    description:
      '회사 소개, 메뉴 이름, 안내 문구. AI가 초안 다 만들어드려요. 마음에 안 드시면 그때 말씀하세요.',
    example: '예: “30년 된 한식당이에요” 한 줄 → 회사 소개 3안 자동 생성',
    icon: 'sparkles',
    answersPainPointId: 'writing-hard',
  },
  {
    id: 'in-place-comments',
    title: '사이트 위에서 직접 수정 요청',
    description:
      '카톡 핑퐁 안 해요. 사이트 화면 위에 동그라미 치고 “여기 색 바꿔주세요” 한 마디면 끝.',
    example: '예: “이 버튼 더 크게” 댓글로 알려주시면 끝',
    icon: 'comment',
    answersPainPointId: 'revision-pain',
  },
  {
    id: 'open-pricing',
    title: '가격을 처음부터 공개',
    description:
      '얼마 들지 모르면 답답하잖아요. 숨고 1인 프리랜서 시세 기준으로 처음부터 다 공개합니다.',
    example: '예: 위저드 답변하면서 실시간으로 시세 확인',
    icon: 'tag',
    answersPainPointId: 'price-opaque',
  },
]
