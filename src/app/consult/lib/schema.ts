import { z } from 'zod'

const phoneRegex = /^[\d\-+()\s]+$/

/**
 * 바로 상담 신청 — 위저드보다 가벼운 입력.
 * 연락처(이름·전화)만 필수, 나머지는 "잘 모르셔도 됨" 톤으로 모두 선택.
 */
export const consultSchema = z.object({
  name: z.string().trim().min(1, '성함을 알려주세요').max(40),
  phone: z
    .string()
    .trim()
    .min(9, '연락처를 한 번만 확인해 주세요')
    .max(20)
    .regex(phoneRegex, '숫자로 입력해 주세요'),
  kakao: z.string().trim().max(60).optional().or(z.literal('')),
  businessName: z.string().trim().max(80).optional().or(z.literal('')),
  message: z.string().trim().max(500).optional().or(z.literal('')),
  consent: z
    .boolean()
    .refine((v) => v === true, { message: '개인정보 수집·이용에 동의해 주세요' }),
})

export type ConsultInput = z.infer<typeof consultSchema>
