// 잠재 클라이언트가 처음 사이트 만들 때 가지는 4가지 고민
// 사용처: 메인 페이지 PainPoints 섹션. 추후 위저드 인트로/마케팅에서 재사용 가능
//
// 톤 가이드 (CLAUDE.md §3-3):
//  - "사장님 목소리" 그대로. 따옴표 안에 한 마디
//  - 기술 용어 금지 (워드프레스, SSR 등 등장 X)
//  - 결과·감정 중심

export type PainPoint = {
  id: string
  quote: string
  context?: string
}

export const painPoints: PainPoint[] = [
  {
    id: 'price-fear',
    quote: '외주 견적 물어보기가 무서워요',
    context:
      '얼마 부를지, 중간에 잠수타진 않을지… 묻지도 못하고 자꾸 미루게 돼요.',
  },
  {
    id: 'unknown',
    quote: '사이트 만들고 싶은데 뭐가 필요한지 모르겠어요',
    context: '메뉴는 몇 개? 페이지는? 디자인은? 결정할 게 너무 많아 보여요.',
  },
  {
    id: 'writing',
    quote: '회사 소개나 메뉴 글 쓰는 게 막막해요',
    context: '글 쓰는 거 자신 없어요. AI가 초안만 만들어줘도 좋을 것 같은데요.',
  },
  {
    id: 'features',
    quote: '결제나 예약 기능까지 같이 넣고 싶어요',
    context:
      '다른 곳에서는 어렵다고 거절당했는데, 우리 같은 작은 가게도 가능한가요?',
  },
]
