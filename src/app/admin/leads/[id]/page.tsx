import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin/auth'
import {
  formatDetailDate,
  getLeadDetail,
  type ConversationRow,
} from '@/lib/admin/leads'
import {
  LEAD_STATUS_CHIP,
  isLeadStatusKey,
  labelForStatus,
} from '@/lib/admin/status'
import {
  BUDGET_LABEL_MAP,
  DESIGN_TONE_LABEL_MAP,
  PAGE_COUNT_LABEL_MAP,
  SITE_TYPE_LABEL_MAP,
  TIMELINE_LABEL_MAP,
  YES_NO_UNSURE_LABEL_MAP,
  labelAiChat,
  labelOrEmpty,
  type AiChatAnswer,
} from '@/lib/admin/wizard-labels'
import { aiCopyResultSchema, type AiCopyResult } from '@/lib/ai/types'
import { calculateQuote, type QuoteResult } from '@/lib/quote/calculate'
import { matchPortfolio } from '@/lib/quote/match-portfolio'
import type { PortfolioItem } from '@/config/portfolio'
import type {
  SiteType,
  PageCount,
  YesNoUnsure,
  DesignTone,
  Timeline,
  Budget,
} from '@/app/wizard/lib/state'
import { ChatLog } from './ChatLog'
import { CopyText, KakaoCopyButton } from './CopyText'
import { LeadMemoEditor } from './LeadMemoEditor'
import { LeadStatusSelect } from './LeadStatusSelect'
import { Toaster } from './Toaster'

export const metadata: Metadata = {
  title: 'Admin · 리드 상세',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

// UUID 형태가 아니면 즉시 404
const UUID_RE = /^[0-9a-f-]{36}$/i

type WizardAnswers = {
  siteType?: SiteType
  industry?: string
  businessName?: string
  tagline?: string
  pageCount?: PageCount
  payment?: YesNoUnsure
  aiChat?: AiChatAnswer
  designTone?: DesignTone
  timeline?: Timeline
  budget?: Budget
  rawIntent?: string
}

export default async function LeadDetailPage({
  params,
}: {
  params: { id: string }
}) {
  requireAdmin(`/admin/leads/${params.id}`)

  if (!UUID_RE.test(params.id)) notFound()

  const detail = await getLeadDetail(params.id)
  if (!detail) notFound()

  const { lead, conversations, kakaoId } = detail
  const answers = (lead.wizard_answers ?? {}) as WizardAnswers
  // tagline/rawIntent 등 features에 따로 저장된 항목 보강 (wizard/actions.ts 참조)
  const features = (lead.features ?? {}) as Record<string, unknown>
  const tagline =
    typeof answers.tagline === 'string'
      ? answers.tagline
      : typeof features.tagline === 'string'
        ? (features.tagline as string)
        : null

  const quote = calculateQuote({
    siteType: answers.siteType,
    pageCount: answers.pageCount,
    payment: answers.payment,
    aiChatNeeded:
      answers.aiChat && typeof answers.aiChat === 'object'
        ? answers.aiChat.needed === true
          ? true
          : answers.aiChat.needed === 'unsure'
            ? 'unsure'
            : false
        : false,
    designTone: answers.designTone,
    timeline: answers.timeline,
  })

  const similar = matchPortfolio({
    siteType: answers.siteType,
    industry: lead.industry ?? undefined,
  })

  // AI 결과 zod 검증 — 실패하면 null로 폴백
  let ai: AiCopyResult | null = null
  if (
    lead.ai_generated_at &&
    lead.ai_menu_structure &&
    lead.ai_hero_copy &&
    lead.ai_about_draft &&
    lead.ai_colors
  ) {
    const parsed = aiCopyResultSchema.safeParse({
      menuStructure: lead.ai_menu_structure,
      heroCopy: lead.ai_hero_copy,
      aboutDraft: lead.ai_about_draft,
      colors: lead.ai_colors,
    })
    if (parsed.success) ai = parsed.data
  }

  const chip = isLeadStatusKey(lead.status)
    ? LEAD_STATUS_CHIP[lead.status]
    : 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
      <Toaster />

      <Link
        href="/admin/leads"
        className="inline-flex items-center text-sm font-medium text-gray-500 transition hover:text-gray-900"
      >
        ← 리드 목록
      </Link>

      {/* ───── 헤더 ───── */}
      <header className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="truncate text-2xl font-bold text-gray-900 sm:text-3xl">
              {lead.contact_name ?? '이름 미입력'}
            </h1>
            <span
              className={`inline-flex h-7 shrink-0 items-center rounded-full px-2.5 text-xs font-semibold ${chip}`}
            >
              현재 · {labelForStatus(lead.status)}
            </span>
          </div>
          {(lead.business_name || lead.industry) && (
            <p className="mt-1 text-sm text-gray-500">
              {[lead.business_name, lead.industry].filter(Boolean).join(' · ')}
            </p>
          )}
          <p className="mt-1 text-xs tabular-nums text-gray-500">
            접수 {formatDetailDate(lead.created_at)}
            {lead.source && ` · source: ${lead.source}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <QuickActions
            phone={lead.contact_phone}
            email={lead.contact_email}
            kakao={kakaoId}
          />
          <LeadStatusSelect leadId={lead.id} initialStatus={lead.status} />
        </div>
      </header>

      {/* ───── 본문 2-cols (lg+) / 1-col 스택 ───── */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[3fr_2fr]">
        <div className="space-y-4">
          <BasicInfoCard lead={lead} kakao={kakaoId} />
          <WizardAnswersCard answers={answers} tagline={tagline} />
          <QuoteCard quote={quote} />
        </div>

        <div className="space-y-4">
          <AiResultCard ai={ai} generatedAt={lead.ai_generated_at} />
          {conversations.length > 0 && (
            <ChatLogCard
              messages={conversations}
              notifiedAt={lead.chat_notified_at}
            />
          )}
          <SimilarCard items={similar} />
          <MemoCard leadId={lead.id} initialMemo={lead.admin_memo ?? ''} />
        </div>
      </div>
    </section>
  )
}

// ────────────────────────────────────────────────────────────
// 카드 컴포넌트
// ────────────────────────────────────────────────────────────

function Card({
  title,
  helper,
  children,
}: {
  title: string
  helper?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <header>
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
        {helper && <p className="mt-0.5 text-xs text-gray-500">{helper}</p>}
      </header>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function FieldRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-gray-900">{children}</dd>
    </div>
  )
}

function QuickActions({
  phone,
  email,
  kakao,
}: {
  phone: string | null
  email: string | null
  kakao: string | null
}) {
  const phoneHref = phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : null
  const emailHref = email ? `mailto:${email}` : null

  return (
    <div className="flex items-center gap-1.5">
      {phoneHref && (
        <a
          href={phoneHref}
          className="inline-flex h-10 items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 text-xs font-semibold text-gray-800 transition hover:border-gray-400 hover:text-gray-900"
          aria-label={`전화 ${phone}`}
        >
          <span aria-hidden="true">📞</span> 전화
        </a>
      )}
      {emailHref && (
        <a
          href={emailHref}
          className="inline-flex h-10 items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 text-xs font-semibold text-gray-800 transition hover:border-gray-400 hover:text-gray-900"
          aria-label={`이메일 ${email}`}
        >
          <span aria-hidden="true">✉</span> 이메일
        </a>
      )}
      {kakao && <KakaoCopyButton kakao={kakao} />}
    </div>
  )
}

function BasicInfoCard({
  lead,
  kakao,
}: {
  lead: {
    contact_name: string | null
    contact_phone: string | null
    contact_email: string | null
    created_at: string
    source: string | null
  }
  kakao: string | null
}) {
  return (
    <Card title="기본 정보" helper="필드를 클릭하면 복사돼요">
      <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        <FieldRow label="이름">
          <CopyText value={lead.contact_name} label="이름" />
        </FieldRow>
        <FieldRow label="연락처">
          <CopyText value={lead.contact_phone} label="연락처" mono />
        </FieldRow>
        <FieldRow label="이메일">
          <CopyText value={lead.contact_email} label="이메일" />
        </FieldRow>
        <FieldRow label="카카오 ID">
          <CopyText value={kakao} label="카카오 ID" mono />
        </FieldRow>
        <FieldRow label="접수일">
          <span className="tabular-nums text-gray-700">
            {formatDetailDate(lead.created_at)}
          </span>
        </FieldRow>
        <FieldRow label="유입 경로">
          <span className={lead.source ? 'text-gray-700' : 'text-gray-400'}>
            {lead.source || '—'}
          </span>
        </FieldRow>
      </dl>
    </Card>
  )
}

function WizardAnswersCard({
  answers,
  tagline,
}: {
  answers: WizardAnswers
  tagline: string | null
}) {
  return (
    <Card title="위저드 답변" helper="사장님이 8단계 위저드에서 직접 고른 답변">
      <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        <WizardItem
          label="사이트 종류"
          {...labelOrEmpty(SITE_TYPE_LABEL_MAP, answers.siteType)}
        />
        <WizardItem
          label="업종"
          value={answers.industry ?? '미응답'}
          missing={!answers.industry}
        />
        <WizardItem
          label="회사·상호명"
          value={answers.businessName ?? '미응답'}
          missing={!answers.businessName}
        />
        <WizardItem
          label="한 줄 소개"
          value={tagline ?? '미응답'}
          missing={!tagline}
        />
        <WizardItem
          label="페이지 수"
          {...labelOrEmpty(PAGE_COUNT_LABEL_MAP, answers.pageCount)}
        />
        <WizardItem
          label="결제 기능"
          {...labelOrEmpty(YES_NO_UNSURE_LABEL_MAP, answers.payment)}
        />
        <WizardItem
          label="AI 챗봇"
          value={labelAiChat(answers.aiChat)}
          missing={!answers.aiChat}
        />
        <WizardItem
          label="디자인 톤"
          {...labelOrEmpty(DESIGN_TONE_LABEL_MAP, answers.designTone)}
        />
        <WizardItem
          label="납기"
          {...labelOrEmpty(TIMELINE_LABEL_MAP, answers.timeline)}
        />
        <WizardItem
          label="예산"
          {...labelOrEmpty(BUDGET_LABEL_MAP, answers.budget)}
        />
      </dl>
    </Card>
  )
}

function WizardItem({
  label,
  value,
  missing,
}: {
  label: string
  value: string
  missing: boolean
}) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </dt>
      <dd
        className={`mt-0.5 text-sm leading-relaxed ${missing ? 'text-gray-400' : 'text-gray-900'}`}
      >
        {value}
      </dd>
    </div>
  )
}

function QuoteCard({ quote }: { quote: QuoteResult }) {
  return (
    <Card title="견적 산출" helper="위저드 결과 페이지와 동일 규칙 (숨고 1인 시세)">
      <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            예상 가격
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-gray-900">
            {quote.priceMinManwon === quote.priceMaxManwon
              ? `${quote.priceMinManwon}`
              : `${quote.priceMinManwon}~${quote.priceMaxManwon}`}
            <span className="ml-1 text-base font-semibold text-gray-500">
              만원
            </span>
          </p>
          <p className="mt-1 text-xs tabular-nums text-gray-500">
            중심가 {quote.priceCenterManwon}만원
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            예상 기간
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-gray-900">
            {quote.weeksMin === quote.weeksMax
              ? quote.weeksMin
              : `${quote.weeksMin}~${quote.weeksMax}`}
            <span className="ml-1 text-base font-semibold text-gray-500">주</span>
          </p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          산출 근거
        </p>
        <ul className="mt-2 divide-y divide-gray-100 rounded-lg border border-gray-200 text-sm">
          {quote.breakdown.map((b, i) => (
            <li
              key={i}
              className="flex items-baseline justify-between gap-3 px-3.5 py-2.5"
            >
              <span className="text-gray-700">{b.label}</span>
              <span className="shrink-0 font-semibold tabular-nums text-gray-900">
                {b.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}

function AiResultCard({
  ai,
  generatedAt,
}: {
  ai: AiCopyResult | null
  generatedAt: string | null
}) {
  if (!ai) {
    return (
      <Card title="AI 생성 결과">
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
          AI 생성 결과 없음
          <p className="mt-1 text-xs text-gray-400">
            아직 결과 페이지를 열지 않았거나, 생성에 실패한 리드입니다.
          </p>
        </div>
      </Card>
    )
  }
  const recommended = ai.colors.findIndex((c) => c.recommended)
  return (
    <Card
      title="AI 생성 결과"
      helper={generatedAt ? `생성 ${formatDetailDate(generatedAt)}` : undefined}
    >
      {/* 메뉴 구조 */}
      <section>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          추천 메뉴 구조
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {ai.menuStructure.map((m) => (
            <span
              key={m.label}
              title={m.description}
              className="inline-flex h-8 items-center rounded-full border border-gray-200 bg-gray-50 px-3 text-xs font-semibold text-gray-800"
            >
              {m.label}
            </span>
          ))}
        </div>
      </section>

      {/* 히어로 카피 3안 */}
      <section className="mt-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          히어로 카피 3안
        </p>
        <ul className="mt-2 space-y-2">
          {ai.heroCopy.map((c, i) => (
            <li
              key={i}
              className="rounded-lg border border-gray-200 bg-white px-3.5 py-2.5"
            >
              <p className="text-sm font-bold leading-snug text-gray-900">
                {c.headline}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">
                {c.subhead}
              </p>
              <p className="mt-1.5 text-[10px] font-medium uppercase tracking-wider text-gray-400">
                분위기 · {c.tone}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* About 초안 */}
      <section className="mt-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          회사 소개 초안
        </p>
        <p className="mt-2 whitespace-pre-wrap rounded-lg bg-gray-50 px-3.5 py-3 text-sm leading-relaxed text-gray-800">
          {ai.aboutDraft}
        </p>
      </section>

      {/* 컬러 팔레트 */}
      <section className="mt-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          추천 컬러 팔레트
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {ai.colors.map((c, i) => {
            const isRec = i === recommended
            return (
              <div
                key={`${c.name}-${i}`}
                className={`rounded-lg border p-2.5 ${isRec ? 'border-indigo-300 bg-indigo-50/40' : 'border-gray-200 bg-white'}`}
              >
                <div className="flex items-center justify-between gap-1">
                  <p
                    className={`truncate text-xs font-bold ${isRec ? 'text-indigo-900' : 'text-gray-700'}`}
                  >
                    {c.name}
                  </p>
                  {isRec && (
                    <span className="shrink-0 rounded-full bg-indigo-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                      추천
                    </span>
                  )}
                </div>
                <div className="mt-2 flex h-9 overflow-hidden rounded ring-1 ring-gray-200">
                  <Swatch color={c.primary} />
                  <Swatch color={c.secondary} />
                  <Swatch color={c.accent} />
                </div>
                <ul className="mt-2 space-y-0.5 text-[10px] tabular-nums text-gray-600">
                  <li>
                    <span className="font-mono">{c.primary}</span> 메인
                  </li>
                  <li>
                    <span className="font-mono">{c.secondary}</span> 보조
                  </li>
                  <li>
                    <span className="font-mono">{c.accent}</span> 강조
                  </li>
                </ul>
              </div>
            )
          })}
        </div>
      </section>
    </Card>
  )
}

function Swatch({ color }: { color: string }) {
  return (
    <div
      className="flex-1"
      style={{ backgroundColor: color }}
      title={color}
      aria-label={color}
    />
  )
}

function ChatLogCard({
  messages,
  notifiedAt,
}: {
  messages: ConversationRow[]
  notifiedAt: string | null
}) {
  return (
    <Card
      title="챗봇 대화 로그"
      helper={
        notifiedAt
          ? `텔레그램 알림 ${formatDetailDate(notifiedAt)}`
          : `총 ${messages.length}개 메시지`
      }
    >
      <ChatLog messages={messages} />
    </Card>
  )
}

function SimilarCard({ items }: { items: PortfolioItem[] }) {
  if (items.length === 0) {
    return (
      <Card title="비슷한 사례">
        <p className="text-sm text-gray-500">매칭된 사례가 없어요.</p>
      </Card>
    )
  }
  return (
    <Card
      title="비슷한 사례"
      helper="사장님이 위저드 결과에서 본 것과 동일"
    >
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex gap-3 rounded-lg border border-gray-200 bg-white p-2.5 transition hover:border-gray-300 hover:bg-gray-50"
            >
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  {item.category}
                </p>
                <p className="mt-0.5 truncate text-sm font-bold text-gray-900">
                  {item.name}
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-gray-600">
                  {item.description}
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </Card>
  )
}

function MemoCard({
  leadId,
  initialMemo,
}: {
  leadId: string
  initialMemo: string
}) {
  return (
    <Card title="메모" helper="자동 저장 (1초 후)">
      <LeadMemoEditor leadId={leadId} initialMemo={initialMemo} />
    </Card>
  )
}
