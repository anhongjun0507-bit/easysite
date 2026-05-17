// 사장님 자기 인지 섹션 — 4가지 axes(Differentiators)와 1:1 매칭
// 사용처: 메인 PainPoints 섹션. 추후 위저드 인트로/마케팅 재사용 가능
//
// 톤 가이드 (CLAUDE.md §3-3):
//  - "사장님 목소리" 그대로 — 따옴표 안 한 마디
//  - 기술 용어 X
//  - context 필드는 의도적으로 비움 (큰 인용부호와 quote만으로 충분, 픽셀 보고 추가 결정)

export type PainPoint = {
  id: string
  quote: string
  context?: string
}

export const painPoints: PainPoint[] = [
  {
    id: 'slow-quote',
    quote: '외주 견적 받기까지 2주씩 걸려서 답답해요',
  },
  {
    id: 'writing-hard',
    quote: '회사 소개 글 쓰라는데 글쓰기 자신 없어요',
  },
  {
    id: 'revision-pain',
    quote: '수정 요청을 카톡으로 일일이 하는 게 너무 답답해요',
  },
  {
    id: 'price-opaque',
    quote: '도대체 얼마 들지 견적 받아봐야 알아서 답답해요',
  },
]
