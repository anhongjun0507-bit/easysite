import { z } from 'zod'

const phoneRegex = /^[\d\-+()\s]+$/
// 가벼운 이메일 형식(선택 입력) — 비어 있으면 통과, 입력 시에만 형식 확인
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * 프로젝트 문의(상담) — 자격검증형.
 * 연락처(이름·전화)와 프로젝트 유형·예산은 필수, 회사·이메일·일정·메시지는 선택.
 * 기업·에이전시 리드를 거르되, 예산 '미정'도 열어 진입 장벽은 낮춘다.
 */

// 프로젝트 유형 (필수)
export const PROJECT_TYPES = ['웹사이트', '앱', '웹+앱'] as const
// 예산대 (필수) — 낮은 구간까지 열되 카피·디자인은 프리미엄 유지
export const BUDGET_BANDS = [
  '~500만원',
  '500–1,000만원',
  '1,000–3,000만원',
  '3,000만원+',
  '미정',
] as const
// 일정 (선택)
export const TIMELINES = ['급함', '3개월 내', '유연'] as const

export type ProjectType = (typeof PROJECT_TYPES)[number]
export type BudgetBand = (typeof BUDGET_BANDS)[number]
export type Timeline = (typeof TIMELINES)[number]

export const consultSchema = z.object({
  name: z.string().trim().min(1, '성함을 알려주세요').max(40),
  phone: z
    .string()
    .trim()
    .min(9, '연락처를 한 번만 확인해 주세요')
    .max(20)
    .regex(phoneRegex, '숫자로 입력해 주세요'),
  company: z.string().trim().max(80).optional().or(z.literal('')),
  email: z
    .string()
    .trim()
    .max(120)
    .refine((v) => v === '' || emailRegex.test(v), '이메일 형식을 확인해 주세요')
    .optional()
    .or(z.literal('')),
  projectType: z.enum(PROJECT_TYPES, { message: '어떤 프로젝트인지 선택해 주세요' }),
  budget: z.enum(BUDGET_BANDS, { message: '예산 범위를 선택해 주세요' }),
  timeline: z.enum(TIMELINES).optional().or(z.literal('')),
  kakao: z.string().trim().max(60).optional().or(z.literal('')),
  message: z.string().trim().max(500).optional().or(z.literal('')),
  consent: z
    .boolean()
    .refine((v) => v === true, { message: '개인정보 수집·이용에 동의해 주세요' }),
})

export type ConsultInput = z.infer<typeof consultSchema>

/** 폼 제출과 함께 보내는 부가 메타 — 스팸 가드(honeypot) + 광고 파라미터(gclid/utm). */
export type ConsultMeta = {
  hp?: string
  marketing?: unknown
}
