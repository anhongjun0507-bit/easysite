// EasySite의 4가지 차별점
// PainPoints 4개와 1:1 대응 (answersPainPointId로 추적)
// 사용처: 메인 페이지 Differentiators 섹션, 추후 위저드 결과 페이지에서
//        사용자가 고른 고민에 매칭되는 답을 강조 노출 가능
//
// 톤 가이드 (CLAUDE.md §3-3):
//  - "사장님 옆에서 설명하듯" — 친근 conversational(...해요/돼요)
//  - 기술 자랑 금지 ("Next.js로 만든 PWA" X) → 결과·이득 중심
//  - 숨고 1인 시세 기준 강조 (CLAUDE.md §2-2 가격 정책)

export type Differentiator = {
  id: string
  title: string
  description: string
  /** Pain point this answers (see src/config/pain-points.ts) */
  answersPainPointId?: string
}

export const differentiators: Differentiator[] = [
  {
    id: 'fast-quote',
    title: '내일이면 견적이랑 미리보기까지 도착해요',
    description:
      '물어볼 용기가 안 났던 가격, 처음부터 다 보여드려요. 숨고 1인 프리랜서 시세 기준이라 합리적이에요.',
    answersPainPointId: 'price-fear',
  },
  {
    id: 'ai-wizard',
    title: '결정할 거 없어요. 1분만 알려주시면 돼요',
    description:
      '어떤 페이지가 필요한지, 메뉴는 어떻게 짜야 할지… AI가 비슷한 사장님들 사례 보고 알아서 추천해드려요.',
    answersPainPointId: 'unknown',
  },
  {
    id: 'ai-copy',
    title: '글 한 줄도 안 쓰셔도 돼요',
    description:
      '회사 소개, 메뉴 이름, 안내 문구. AI가 초안 다 만들어드려요. 마음에 안 드시면 그때 말씀하시면 돼요.',
    answersPainPointId: 'writing',
  },
  {
    id: 'full-features',
    title: '토스 결제, 카카오 로그인, 예약. 다 돼요',
    description:
      '다른 곳에서 안 된다고 거절당한 기능들, 우리는 처음부터 가능한 구조로 만들어요. AI 챗봇도 붙일 수 있어요.',
    answersPainPointId: 'features',
  },
]
