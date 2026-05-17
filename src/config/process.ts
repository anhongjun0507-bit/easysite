// EasySite 제작 과정 3단계
// 사용처: 메인 페이지 HowItWorks 섹션. 추후 위저드 완료 페이지에서
//        "다음 단계 안내"로도 재사용 가능
//
// 톤 가이드 (CLAUDE.md §3-3):
//  - "사장님 옆에서 설명하듯" 친근체 (...해요 / ...돼요)
//  - 기술 용어 X — 결과·시간 중심
//  - duration은 사장님이 "내가 얼마 기다리면 되지?"를 즉시 알 수 있게

export type ProcessStep = {
  number: string
  title: string
  description: string
  duration: string
}

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: '1분 위저드 작성',
    description:
      'AI가 짧게 여쭤봐요. 잘 모르시면 “잘 모르겠어요” 누르시면 돼요.',
    duration: '약 1분',
  },
  {
    number: '02',
    title: '24시간 안에 견적·미리보기 도착',
    description:
      '카톡으로 알려드려요. 가격이랑 사이트 시안을 같이 보내드리니까, 마음에 드시면 결제해서 본격 제작 시작.',
    duration: '24시간 안에',
  },
  {
    number: '03',
    title: '사이트 위에서 코멘트로 수정',
    description:
      '카톡 핑퐁 없이, 사이트 화면 위에 동그라미 치고 “여기 바꿔주세요” 한 마디면 반영해드려요.',
    duration: '본 제작 1~2주',
  },
]
