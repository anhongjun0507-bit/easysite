import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { callAnthropicStream } from '@/lib/ai/anthropic'
import {
  CHAT_SYSTEM_PROMPT,
  buildChatContextBlock,
  type ChatLeadContext,
} from '@/lib/ai/chat-prompt'
import { aiCopyResultSchema } from '@/lib/ai/types'
import { calculateQuote } from '@/lib/quote/calculate'
import { matchPortfolio } from '@/lib/quote/match-portfolio'
import type { Json } from '@/types/database.types'
import type {
  SiteType,
  PageCount,
  YesNoUnsure,
  DesignTone,
  Timeline,
  Budget,
} from '@/app/wizard/lib/state'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const MAX_USER_TURNS = 20

const bodySchema = z.object({
  leadId: z.string().uuid(),
  sessionId: z.string().min(1).max(120),
  message: z.string().trim().min(1).max(2000),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1).max(8000),
      }),
    )
    .max(40)
    .default([]),
})

export async function POST(request: Request) {
  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: '잘못된 요청' }, { status: 400 })
  }
  const parsed = bodySchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: '잘못된 요청' }, { status: 400 })
  }
  const { leadId, sessionId, message, history } = parsed.data

  // 사용자 턴 수 — history는 (user, assistant) 쌍이라 user 메시지만 카운트
  const userTurns = history.filter((m) => m.role === 'user').length
  if (userTurns >= MAX_USER_TURNS) {
    return NextResponse.json(
      {
        ok: false,
        error:
          '대화가 길어졌어요. 더 자세한 상담은 010-3782-5418로 전화 주시거나 입력창에 연락처 남겨주세요.',
        code: 'limit_reached',
      },
      { status: 429 },
    )
  }

  const admin = createAdminClient()
  const { data: lead, error: fetchErr } = await admin
    .from('leads')
    .select(
      'id, business_name, industry, wizard_answers, ai_menu_structure, ai_hero_copy, ai_about_draft, ai_colors',
    )
    .eq('id', leadId)
    .maybeSingle()

  if (fetchErr || !lead) {
    return NextResponse.json(
      { ok: false, error: '견적 정보를 찾을 수 없어요' },
      { status: 404 },
    )
  }

  // 컨텍스트 빌드 — wizard·견적·AI 결과·비슷한 사례
  const context = buildContextFromLead(lead)
  const contextBlock = buildChatContextBlock(context)

  // 메시지 조립: 첫 user 메시지에 컨텍스트 블록 prepend
  const messages = history.map((m) => ({ role: m.role, content: m.content }))
  const firstUserContent =
    messages.length === 0
      ? `${contextBlock}\n\n${message}`
      : message
  messages.push({ role: 'user', content: firstUserContent })

  // user 메시지 저장 (원본 — 컨텍스트 prepend 안 함)
  await admin.from('conversations').insert({
    session_id: sessionId,
    lead_id: leadId,
    role: 'user',
    content: message,
    metadata: {} as Json,
  })

  // SSE 스트림 응답
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      let fullText = ''
      try {
        for await (const ev of callAnthropicStream({
          system: CHAT_SYSTEM_PROMPT,
          messages,
          maxTokens: 1024,
        })) {
          if (ev.type === 'text') {
            fullText += ev.delta
            send({ type: 'text', delta: ev.delta })
          } else if (ev.type === 'usage') {
            send({ type: 'usage', inputTokens: ev.inputTokens, outputTokens: ev.outputTokens })
          }
        }
        send({ type: 'done' })
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'AI 호출 실패'
        send({ type: 'error', error: message })
      } finally {
        // assistant 응답 저장 (성공·실패 무관, 비어있지 않으면)
        if (fullText.trim()) {
          await admin.from('conversations').insert({
            session_id: sessionId,
            lead_id: leadId,
            role: 'assistant',
            content: fullText,
            metadata: {} as Json,
          })
        }
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
      'x-accel-buffering': 'no',
    },
  })
}

// ───── 컨텍스트 빌드 헬퍼 ───────────────────────────────────────────────────

type LeadRow = {
  business_name: string | null
  industry: string | null
  wizard_answers: Json
  ai_menu_structure: Json | null
  ai_hero_copy: Json | null
  ai_about_draft: string | null
  ai_colors: Json | null
}

function buildContextFromLead(lead: LeadRow): ChatLeadContext {
  const a = (lead.wizard_answers ?? {}) as {
    siteType?: SiteType
    pageCount?: PageCount
    payment?: YesNoUnsure
    aiChat?: { needed?: boolean | 'unsure'; detail?: string }
    designTone?: DesignTone
    timeline?: Timeline
    budget?: Budget
    tagline?: string
  }

  const quote = calculateQuote({
    siteType: a.siteType,
    pageCount: a.pageCount,
    payment: a.payment,
    aiChatNeeded:
      a.aiChat?.needed === true
        ? true
        : a.aiChat?.needed === 'unsure'
          ? 'unsure'
          : false,
    designTone: a.designTone,
    timeline: a.timeline,
  })

  const similar = matchPortfolio({
    siteType: a.siteType,
    industry: lead.industry ?? undefined,
  })

  // AI 결과 zod 검증 후 컨텍스트에 포함
  let ai: ChatLeadContext['ai'] = null
  if (lead.ai_menu_structure && lead.ai_hero_copy && lead.ai_about_draft && lead.ai_colors) {
    const candidate = {
      menuStructure: lead.ai_menu_structure,
      heroCopy: lead.ai_hero_copy,
      aboutDraft: lead.ai_about_draft,
      colors: lead.ai_colors,
    }
    const parsed = aiCopyResultSchema.safeParse(candidate)
    if (parsed.success) {
      const recommended =
        parsed.data.colors.find((c) => c.recommended) ?? parsed.data.colors[0]
      ai = {
        menuLabels: parsed.data.menuStructure.map((m) => m.label),
        firstHeroHeadline: parsed.data.heroCopy[0]?.headline,
        aboutDraft: parsed.data.aboutDraft,
        recommendedColor: recommended
          ? {
              name: recommended.name,
              primary: recommended.primary,
              secondary: recommended.secondary,
              accent: recommended.accent,
            }
          : undefined,
      }
    }
  }

  return {
    businessName: lead.business_name,
    industry: lead.industry,
    tagline: a.tagline ?? null,
    wizard: {
      siteType: a.siteType,
      pageCount: a.pageCount,
      payment: a.payment,
      aiChat: a.aiChat,
      designTone: a.designTone,
      timeline: a.timeline,
      budget: a.budget,
    },
    quote: {
      priceMinManwon: quote.priceMinManwon,
      priceMaxManwon: quote.priceMaxManwon,
      weeksMin: quote.weeksMin,
      weeksMax: quote.weeksMax,
      breakdown: quote.breakdown,
    },
    ai,
    similar: similar.map((s) => ({
      name: s.name,
      category: s.category,
      url: s.url,
    })),
  }
}
