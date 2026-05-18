import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { aiCopyResultSchema, type AiCopyResult } from '@/lib/ai/types'
import { calculateQuote } from '@/lib/quote/calculate'
import { matchPortfolio } from '@/lib/quote/match-portfolio'
import type { SiteType, PageCount, YesNoUnsure, DesignTone, Timeline } from '@/app/wizard/lib/state'
import { AISection } from './AISection'
import { ChatWidget } from './ChatWidget'
import { FinalCta } from './FinalCta'
import { QuoteHero } from './QuoteHero'
import { SimilarCases } from './SimilarCases'

export const metadata: Metadata = {
  title: '견적 결과',
  description: '사장님 사이트의 예상 견적·기간·AI 초안을 한 화면에서 확인하세요.',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

function pickFirst(raw: string | string[] | undefined): string | undefined {
  return Array.isArray(raw) ? raw[0] : raw
}

export default async function WizardResultPage({
  searchParams,
}: {
  searchParams: { leadId?: string | string[] }
}) {
  const leadId = pickFirst(searchParams.leadId)
  if (!leadId || !/^[0-9a-f-]{36}$/i.test(leadId)) {
    redirect('/wizard')
  }

  const admin = createAdminClient()
  const { data: lead, error } = await admin
    .from('leads')
    .select(
      'id, business_name, industry, wizard_answers, ai_menu_structure, ai_hero_copy, ai_about_draft, ai_colors, ai_generated_at',
    )
    .eq('id', leadId)
    .maybeSingle()

  if (error || !lead) {
    return <NotFound />
  }

  const answers = (lead.wizard_answers ?? {}) as {
    siteType?: SiteType
    pageCount?: PageCount
    payment?: YesNoUnsure
    aiChat?: { needed?: boolean | 'unsure' }
    designTone?: DesignTone
    timeline?: Timeline
  }

  const quote = calculateQuote({
    siteType: answers.siteType,
    pageCount: answers.pageCount,
    payment: answers.payment,
    aiChatNeeded:
      answers.aiChat?.needed === true
        ? true
        : answers.aiChat?.needed === 'unsure'
          ? 'unsure'
          : false,
    designTone: answers.designTone,
    timeline: answers.timeline,
  })

  const similar = matchPortfolio({
    siteType: answers.siteType,
    industry: lead.industry ?? undefined,
  })

  // SSR 캐시 — 이미 생성된 결과 있으면 zod 검증 후 prop으로 전달, 실패 시 null로 fallback
  let initialAi: AiCopyResult | null = null
  if (
    lead.ai_generated_at &&
    lead.ai_menu_structure &&
    lead.ai_hero_copy &&
    lead.ai_about_draft &&
    lead.ai_colors
  ) {
    const candidate = {
      menuStructure: lead.ai_menu_structure,
      heroCopy: lead.ai_hero_copy,
      aboutDraft: lead.ai_about_draft,
      colors: lead.ai_colors,
    }
    const parsed = aiCopyResultSchema.safeParse(candidate)
    if (parsed.success) initialAi = parsed.data
  }

  return (
    <>
      <QuoteHero quote={quote} businessName={lead.business_name} />
      <AISection
        leadId={leadId}
        initial={initialAi}
        userDesignTone={answers.designTone}
      />
      <SimilarCases items={similar} />
      <FinalCta />
      <ChatWidget leadId={leadId} />
    </>
  )
}

function NotFound() {
  return (
    <section className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center px-6 py-12 text-center">
      <h1
        className="font-extrabold text-gray-900"
        style={{
          fontSize: 'clamp(24px, 5vw, 32px)',
          lineHeight: 1.25,
        }}
      >
        견적을 찾을 수 없어요
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-700 sm:text-base">
        링크가 잘못됐거나 만료됐을 수 있어요. 다시 견적을 받아보시거나 운영자에게
        직접 연락주세요.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/wizard"
          className="inline-flex h-12 items-center justify-center rounded-lg bg-indigo-600 px-6 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          다시 견적 받기
        </Link>
        <a
          href="tel:01037825418"
          className="inline-flex h-12 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 text-sm font-semibold text-gray-800 transition hover:border-gray-400"
        >
          전화 010-3782-5418
        </a>
      </div>
    </section>
  )
}
