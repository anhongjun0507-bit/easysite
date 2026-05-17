'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

// 견적 폼 검증 — react-hook-form (client) + zod 와 공유
export const wizardSchema = z.object({
  businessName: z.string().trim().min(1, '사업체 이름을 알려주세요').max(80),
  contactName: z.string().trim().min(1, '이름을 알려주세요').max(40),
  contactPhone: z
    .string()
    .trim()
    .min(9, '전화번호를 확인해 주세요')
    .max(20)
    .regex(/^[\d\-+()\s]+$/, '숫자만 입력해 주세요'),
  contactEmail: z
    .string()
    .trim()
    .email('이메일 형식이 맞지 않아요')
    .max(120)
    .optional()
    .or(z.literal('')),
  intent: z.string().trim().max(200).optional(),
  description: z.string().trim().min(5, '5자 이상 적어주세요').max(2000),
})

export type WizardInput = z.infer<typeof wizardSchema>

export type WizardResult =
  | { ok: true }
  | { ok: false; error: string }

export async function submitWizard(input: WizardInput): Promise<WizardResult> {
  // 서버측 재검증 — 클라이언트 우회 차단
  const parsed = wizardSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? '입력이 올바르지 않아요',
    }
  }

  const supabase = createClient()
  const data = parsed.data

  // wizard_answers JSONB에 원본 의도(intent)와 자유 서술(description) 보관
  const wizardAnswers: { description: string; intent?: string } = {
    description: data.description,
  }
  if (data.intent) wizardAnswers.intent = data.intent

  // anon 정책은 INSERT 만 허용 → .select() 미사용 (return=minimal).
  // RETURNING 이 트리거되면 SELECT RLS 까지 검사돼서 42501 에러가 떠요.
  const { error } = await supabase.from('leads').insert({
    business_name: data.businessName,
    contact_name: data.contactName,
    contact_phone: data.contactPhone,
    contact_email: data.contactEmail || null,
    wizard_answers: wizardAnswers,
    status: 'new',
    source: 'landing-wizard',
  })

  if (error) {
    return { ok: false, error: '저장 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.' }
  }

  return { ok: true }
}
