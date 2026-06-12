import { z } from 'zod'

/**
 * 지으리 사전등록 설문.
 * 필수: Q1·Q2·Q3·Q5 라디오 + Q6 연락처 + 개인정보 동의.
 * 선택: Q4(막혔던 점) textarea.
 * 라디오 값은 DB·텔레그램·어드민에서 바로 읽히도록 한글 라벨 그대로 저장한다.
 * (blocker 만 nullable, 동의 시각은 consented_at 컬럼에 별도 기록)
 */

// Q1 어떤 일을 하세요?
export const BUSINESS_TYPES = [
  '자영업-매장',
  '자영업-온라인',
  '프리랜서·전문직',
  '회사·단체',
  '기타',
] as const

// Q2 만들고 싶은 것
export const WANT_TYPES = [
  '홈페이지',
  '예약 사이트',
  '쇼핑몰',
  '포트폴리오',
  '기타',
] as const

// Q3 시도 경험
export const EXPERIENCES = [
  '외주 견적만 받음',
  '노코드 툴 써봤다',
  '직접 하다 포기',
  '처음',
] as const

// Q5 월 지불 의향
export const WILLINGNESS_TO_PAY = [
  '1만원 이하',
  '1~3만원',
  '3~5만원',
  '5만원 이상',
  '사람이 고쳐주는 거 포함이면 더 낼 수 있다',
] as const

export const preregisterSchema = z.object({
  businessType: z.enum(BUSINESS_TYPES, {
    message: '어떤 일을 하시는지 하나만 골라주세요',
  }),
  wantType: z.enum(WANT_TYPES, {
    message: '무엇을 만들고 싶은지 하나만 골라주세요',
  }),
  experience: z.enum(EXPERIENCES, {
    message: '전에 시도해본 적 있는지 하나만 골라주세요',
  }),
  blocker: z.string().trim().max(1000).optional().or(z.literal('')),
  willingnessToPay: z.enum(WILLINGNESS_TO_PAY, {
    message: '한 달에 얼마면 좋을지 하나만 골라주세요',
  }),
  contact: z
    .string()
    .trim()
    .min(2, '연락받을 이메일 또는 카톡 ID를 적어주세요')
    .max(100, '너무 길어요. 100자 안으로 적어주세요'),
  consent: z
    .boolean()
    .refine((v) => v === true, { message: '개인정보 수집·이용에 동의해 주세요' }),
})

export type PreregisterInput = z.infer<typeof preregisterSchema>
