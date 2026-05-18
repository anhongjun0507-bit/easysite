import type { Database } from '@/types/database.types'

type LeadRow = Database['public']['Tables']['leads']['Row']
/** prompt 생성에 필요한 부분만 — route에서 select한 컬럼과 일치 */
type LeadForPrompt = Pick<
  LeadRow,
  'business_name' | 'industry' | 'wizard_answers'
>

const SITE_TYPE_LABEL: Record<string, string> = {
  company: '회사·가게 소개',
  shop: '쇼핑몰',
  reservation: '예약·회원제',
  landing: '랜딩페이지',
  other: '기타',
}
const DESIGN_TONE_LABEL: Record<string, string> = {
  modern: '모던·심플',
  luxury: '럭셔리',
  friendly: '친근',
  auto: '알아서',
}
const PAGE_COUNT_LABEL: Record<string, string> = {
  small: '5개 이내',
  medium: '5~10개',
  large: '10개 이상',
  unsure: '미정',
}

export const AI_COPY_SYSTEM_PROMPT = `당신은 한국 소상공인 대상 웹사이트 컨설턴트입니다. 사장님이 위저드로 답해주신 정보를 바탕으로, 사장님 사이트의 초안을 만들어주세요.

[엄수 원칙]
- 모든 출력은 자연스러운 한국어로 작성
- 60대 사장님도 이해할 수 있게 어려운 영어 용어 금지 (e.g. CTA, USP, target, persona 같은 단어 사용 금지)
- 브랜드명·고유명사 외 영어 단어 섞지 마세요
- 정확히 JSON 형식으로만 응답. 인사·설명·\`\`\`json 코드 블록 일체 금지
- 첫 글자가 \`{\` 마지막 글자가 \`}\`인 JSON 객체 하나만 출력
- 디자인 톤 답변을 반영해 카피·About 글의 분위기를 조정

[응답 JSON 스키마]
{
  "menuStructure": [
    { "label": "메뉴명", "description": "이 메뉴에 들어갈 내용 한 줄 요약" }
  ],
  "heroCopy": [
    { "headline": "사이트 첫 화면 메인 카피 한 줄", "subhead": "메인 아래 한두 줄 부연", "tone": "이 안의 분위기를 한 단어로 (예: 따뜻함)" }
  ],
  "aboutDraft": "회사 소개 페이지 초안 — 한 문단, 200자 내외, 사장님이 직접 다듬을 수 있게 자연스럽게",
  "colors": [
    { "name": "톤 이름 (예: 모던, 럭셔리)", "primary": "#RRGGBB", "secondary": "#RRGGBB", "accent": "#RRGGBB", "recommended": true|false }
  ]
}

[수량]
- menuStructure: 5~7개
- heroCopy: 정확히 3개 (서로 다른 분위기)
- colors: 정확히 3개 (사장님 디자인 톤이 첫번째, recommended=true. 나머지 2개는 recommended=false)`

export function buildAiUserPrompt(lead: LeadForPrompt): string {
  const a = (lead.wizard_answers ?? {}) as Record<string, unknown>
  const aiChat = a.aiChat as { needed?: boolean | 'unsure'; detail?: string } | undefined
  const aiNeeded =
    aiChat?.needed === true ? '필요' : aiChat?.needed === false ? '불필요' : '미정'
  const aiDetail = aiChat?.detail ? ` — "${aiChat.detail}"` : ''

  const lines = [
    `# 사장님 정보`,
    lead.business_name ? `- 상호: ${lead.business_name}` : null,
    lead.industry ? `- 업종: ${lead.industry}` : null,
    a.tagline ? `- 한 줄 소개: ${a.tagline}` : null,
    ``,
    `# 사이트 정보`,
    `- 유형: ${SITE_TYPE_LABEL[a.siteType as string] ?? '미정'}`,
    `- 페이지 수: ${PAGE_COUNT_LABEL[a.pageCount as string] ?? '미정'}`,
    `- 결제 기능: ${labelYN(a.payment as string)}`,
    `- AI 챗봇·자동화: ${aiNeeded}${aiDetail}`,
    `- 원하는 디자인 톤: ${DESIGN_TONE_LABEL[a.designTone as string] ?? '알아서'}`,
    ``,
    `위 정보로 사이트 초안(메뉴·첫 화면 카피 3안·About·컬러 팔레트 3종)을 JSON으로 만들어주세요.`,
    a.designTone && a.designTone !== 'auto'
      ? `컬러 팔레트는 사장님 선택 톤 "${DESIGN_TONE_LABEL[a.designTone as string]}"을 첫번째(recommended=true)에 두세요.`
      : `사장님이 톤을 안 정하셨으니, 업종에 가장 잘 맞는 톤을 첫번째(recommended=true)에 두세요.`,
  ].filter(Boolean)

  return lines.join('\n')
}

const labelYN = (v?: string) =>
  v === 'yes' ? '필요' : v === 'no' ? '불필요' : '미정'
