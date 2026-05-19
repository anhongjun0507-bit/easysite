// EasySite 자주 묻는 질문 6개 — 계약 전 사장님이 가장 많이 묻는 항목
// 사용처: 메인 페이지 FAQ 섹션 (HowItWorks 다음, FinalCta 직전)
//
// 톤 가이드 (CLAUDE.md §3-3):
//  - 친근체 (...해요 / ...드려요)
//  - 사업자/금액 정보는 §2-1, §2-2 기준
//  - 60대도 이해 가능한 단어만 사용 (기술 용어 X)

export type FaqItem = {
  id: string
  question: string
  answer: string
}

export const faqItems: FaqItem[] = [
  {
    id: 'payment-timing',
    question: '결제는 언제 하나요?',
    answer:
      '계약 시 50% 선결제, 검수 후 잔금 50% 결제예요.',
  },
  {
    id: 'revision-limit',
    question: '수정은 몇 번까지 가능한가요?',
    answer:
      '1차 시안 후 무제한 코멘트 가능해요. 사이트 위에 직접 표시하시면 반영해드려요.',
  },
  {
    id: 'refund-policy',
    question: '환불 정책이 어떻게 되나요?',
    answer:
      '1차 시안이 마음에 안 드시면 추가 비용 없이 종료 가능해요. 단 착수금은 작업 시간 보상으로 비환불입니다.',
  },
  {
    id: 'domain-hosting',
    question: '도메인·호스팅 비용은 별도인가요?',
    answer:
      '네, 도메인은 사장님이 직접 구매하세요 (가비아 등 연 2~3만원). 호스팅은 Vercel 무료 티어로 시작 가능, 트래픽 증가 시 별도 안내드려요.',
  },
  {
    id: 'maintenance',
    question: '납품 후 유지보수는 어떻게 되나요?',
    answer:
      '납품 후 1개월간 무상으로 버그 수정해드려요. 이후엔 협의 후 진행해요.',
  },
  {
    id: 'tax-invoice',
    question: '세금계산서 발행 가능한가요?',
    answer:
      '네, 프리즘 사업자(672-35-01596)로 정식 발행해드려요.',
  },
]
