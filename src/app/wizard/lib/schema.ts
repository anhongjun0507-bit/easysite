import { z } from 'zod'

export const SITE_TYPE = ['company', 'shop', 'reservation', 'landing', 'other'] as const
export const PAGE_COUNT = ['small', 'medium', 'large', 'unsure'] as const
export const YES_NO_UNSURE = ['yes', 'no', 'unsure'] as const
export const DESIGN_TONE = ['modern', 'luxury', 'friendly', 'auto'] as const
export const TIMELINE = ['2w', '1m', '2m', 'flex'] as const
export const BUDGET = ['lt200', '200-500', '500-1000', '1000+', 'unsure'] as const

const phoneRegex = /^[\d\-+()\s]+$/

export const wizardAnswersSchema = z.object({
  siteType: z.enum(SITE_TYPE).optional(),
  industry: z.string().trim().max(80).optional(),
  businessName: z.string().trim().max(80).optional(),
  tagline: z.string().trim().max(200).optional(),
  pageCount: z.enum(PAGE_COUNT).optional(),
  payment: z.enum(YES_NO_UNSURE).optional(),
  aiChat: z
    .union([
      z.object({ needed: z.literal(true), detail: z.string().trim().max(500).optional() }),
      z.object({ needed: z.literal(false) }),
      z.object({ needed: z.literal('unsure') }),
    ])
    .optional(),
  designTone: z.enum(DESIGN_TONE).optional(),
  timeline: z.enum(TIMELINE).optional(),
  budget: z.enum(BUDGET).optional(),
  rawIntent: z.string().trim().max(200).optional(),
})

export const contactSchema = z.object({
  name: z.string().trim().min(1, '이름을 알려주세요').max(40),
  phone: z
    .string()
    .trim()
    .min(9, '전화번호를 확인해 주세요')
    .max(20)
    .regex(phoneRegex, '숫자만 입력해 주세요'),
  email: z
    .string()
    .trim()
    .max(120)
    .email('이메일 형식이 맞지 않아요')
    .optional()
    .or(z.literal('')),
  kakao: z.string().trim().max(60).optional().or(z.literal('')),
  consent: z
    .boolean()
    .refine((v) => v === true, { message: '개인정보 수집·이용에 동의해 주세요' }),
})

export const submitSchema = z.object({
  answers: wizardAnswersSchema,
  contact: contactSchema,
  sessionId: z.string().min(1).max(120),
})

export type SubmitInput = z.infer<typeof submitSchema>

/** 페이지 수 라벨 → 숫자 추정 (DB page_count 컬럼용) */
export function estimatePageCount(value: SubmitInput['answers']['pageCount']): number | null {
  switch (value) {
    case 'small':
      return 5
    case 'medium':
      return 8
    case 'large':
      return 15
    default:
      return null
  }
}

/** 예산 라벨 → min/max(만원) 추정. 숨고 1인 시세 기준 (CLAUDE.md §2-2). */
export function estimateBudget(value: SubmitInput['answers']['budget']): {
  min: number | null
  max: number | null
} {
  switch (value) {
    case 'lt200':
      return { min: 0, max: 200 }
    case '200-500':
      return { min: 200, max: 500 }
    case '500-1000':
      return { min: 500, max: 1000 }
    case '1000+':
      return { min: 1000, max: null }
    default:
      return { min: null, max: null }
  }
}
