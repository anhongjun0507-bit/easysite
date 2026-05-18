import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { callAnthropic, extractJson } from '@/lib/ai/anthropic'
import { AI_COPY_SYSTEM_PROMPT, buildAiUserPrompt } from '@/lib/ai/prompts'
import { aiCopyResultSchema, type AiCopyResult } from '@/lib/ai/types'
import type { Json } from '@/types/database.types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const bodySchema = z.object({
  leadId: z.string().uuid(),
  /** true면 ai_generated_at 무관하게 새로 생성 */
  force: z.boolean().optional(),
})

const AI_TIMEOUT_MS = 30_000

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: '잘못된 요청' }, { status: 400 })
  }
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: '잘못된 요청' }, { status: 400 })
  }
  const { leadId, force } = parsed.data

  const admin = createAdminClient()
  const { data: lead, error: fetchErr } = await admin
    .from('leads')
    .select(
      'id, business_name, industry, wizard_answers, ai_menu_structure, ai_hero_copy, ai_about_draft, ai_colors, ai_generated_at',
    )
    .eq('id', leadId)
    .maybeSingle()

  if (fetchErr || !lead) {
    return NextResponse.json(
      { ok: false, error: '견적 정보를 찾을 수 없어요' },
      { status: 404 },
    )
  }

  // 캐시 — 이미 생성됐고 force가 아니면 그대로 반환
  if (
    !force &&
    lead.ai_generated_at &&
    lead.ai_menu_structure &&
    lead.ai_hero_copy &&
    lead.ai_about_draft &&
    lead.ai_colors
  ) {
    return NextResponse.json({
      ok: true,
      cached: true,
      result: {
        menuStructure: lead.ai_menu_structure,
        heroCopy: lead.ai_hero_copy,
        aboutDraft: lead.ai_about_draft,
        colors: lead.ai_colors,
      },
    })
  }

  // Claude 호출 — 30초 timeout
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), AI_TIMEOUT_MS)

  let parsedResult: AiCopyResult
  try {
    const { text } = await callAnthropic({
      system: AI_COPY_SYSTEM_PROMPT,
      userMessage: buildAiUserPrompt(lead),
      signal: controller.signal,
    })
    const json = extractJson<unknown>(text)
    const validated = aiCopyResultSchema.safeParse(json)
    if (!validated.success) {
      return NextResponse.json(
        {
          ok: false,
          error: 'AI 응답 형식이 맞지 않아요. 다시 시도해 주세요.',
        },
        { status: 502 },
      )
    }
    parsedResult = validated.data
  } catch (err) {
    const message =
      err instanceof Error && err.name === 'AbortError'
        ? 'AI 응답이 늦어요. 잠시 후 다시 시도해 주세요.'
        : 'AI 호출에 실패했어요. 잠시 후 다시 시도해 주세요.'
    return NextResponse.json({ ok: false, error: message }, { status: 504 })
  } finally {
    clearTimeout(timer)
  }

  // 결과 저장
  await admin
    .from('leads')
    .update({
      ai_menu_structure: parsedResult.menuStructure as unknown as Json,
      ai_hero_copy: parsedResult.heroCopy as unknown as Json,
      ai_about_draft: parsedResult.aboutDraft,
      ai_colors: parsedResult.colors as unknown as Json,
      ai_generated_at: new Date().toISOString(),
    })
    .eq('id', leadId)

  return NextResponse.json({
    ok: true,
    cached: false,
    result: parsedResult,
  })
}
