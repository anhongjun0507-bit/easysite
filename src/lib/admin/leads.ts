import { createAdminClient } from '@/lib/supabase/admin'
import { isLeadStatusKey, type LeadStatusKey } from './status'

export type LeadListItem = {
  id: string
  created_at: string
  business_name: string | null
  contact_name: string | null
  contact_phone: string | null
  industry: string | null
  estimated_price_min: number | null
  estimated_price_max: number | null
  status: string
  features: Record<string, unknown> | null
}

export type LeadDetail = LeadListItem & {
  contact_email: string | null
  page_count: number | null
  wizard_answers: Record<string, unknown> | null
  notes: string | null
  source: string | null
  updated_at: string
  admin_memo: string | null
  ai_menu_structure: unknown
  ai_hero_copy: unknown
  ai_about_draft: string | null
  ai_colors: unknown
  ai_generated_at: string | null
  chat_notified_at: string | null
}

export type ConversationRow = {
  id: string
  role: string
  content: string
  created_at: string
}

export type LeadDetailWithConversations = {
  lead: LeadDetail
  conversations: ConversationRow[]
  /** wizard_completed 이벤트 payload에서 추출 — leads 컬럼엔 안 들어감 */
  kakaoId: string | null
}

export type LeadListQuery = {
  q?: string
  status?: LeadStatusKey
  sort?: 'newest' | 'oldest'
  page?: number
}

export type LeadListResult = {
  rows: LeadListItem[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export const LEADS_PAGE_SIZE = 20

const LIST_COLS =
  'id, created_at, business_name, contact_name, contact_phone, industry, estimated_price_min, estimated_price_max, status, features'

export async function listLeads(query: LeadListQuery): Promise<LeadListResult> {
  const admin = createAdminClient()
  const page = Math.max(1, query.page ?? 1)
  const from = (page - 1) * LEADS_PAGE_SIZE
  const to = from + LEADS_PAGE_SIZE - 1
  const ascending = query.sort === 'oldest'

  let q = admin
    .from('leads')
    .select(LIST_COLS, { count: 'exact' })
    .order('created_at', { ascending })
    .range(from, to)

  if (query.status && isLeadStatusKey(query.status)) {
    q = q.eq('status', query.status)
  }

  if (query.q) {
    // PostgREST OR — 쉼표·괄호는 split 문자라 안전하게 제거
    const term = query.q.trim().replace(/[,()*%\\]/g, ' ').trim()
    if (term) {
      const pat = `%${term}%`
      q = q.or(
        `contact_name.ilike.${pat},contact_phone.ilike.${pat},business_name.ilike.${pat}`,
      )
    }
  }

  const { data, count, error } = await q
  if (error) {
    throw new Error(`Failed to list leads: ${error.message}`)
  }

  const total = count ?? 0
  return {
    rows: (data ?? []) as unknown as LeadListItem[],
    total,
    page,
    pageSize: LEADS_PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / LEADS_PAGE_SIZE)),
  }
}

const DETAIL_COLS = `${LIST_COLS}, contact_email, page_count, wizard_answers, notes, source, updated_at, admin_memo, ai_menu_structure, ai_hero_copy, ai_about_draft, ai_colors, ai_generated_at, chat_notified_at`

export async function getLead(id: string): Promise<LeadDetail | null> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('leads')
    .select(DETAIL_COLS)
    .eq('id', id)
    .maybeSingle()
  if (error || !data) return null
  return data as unknown as LeadDetail
}

export async function getLeadDetail(
  id: string,
): Promise<LeadDetailWithConversations | null> {
  const admin = createAdminClient()
  const [leadRes, convoRes, eventRes] = await Promise.all([
    admin.from('leads').select(DETAIL_COLS).eq('id', id).maybeSingle(),
    admin
      .from('conversations')
      .select('id, role, content, created_at')
      .eq('lead_id', id)
      .in('role', ['user', 'assistant'])
      .order('created_at', { ascending: true }),
    admin
      .from('lead_events')
      .select('payload')
      .eq('lead_id', id)
      .eq('event_type', 'wizard_completed')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])
  if (leadRes.error || !leadRes.data) return null

  let kakaoId: string | null = null
  const p = eventRes.data?.payload
  if (p && typeof p === 'object' && 'kakao' in p) {
    const k = (p as { kakao?: unknown }).kakao
    if (typeof k === 'string' && k.trim()) kakaoId = k.trim()
  }

  return {
    lead: leadRes.data as unknown as LeadDetail,
    conversations: (convoRes.data ?? []) as ConversationRow[],
    kakaoId,
  }
}

// ─────────────────────────────────────────────────────────────
// 라벨·포맷터 — wizard/actions.ts 텔레그램 라벨과 일관성 유지
// ─────────────────────────────────────────────────────────────

const SITE_TYPE_LABEL: Record<string, string> = {
  company: '회사·가게',
  shop: '쇼핑몰',
  reservation: '예약·회원제',
  landing: '랜딩',
  other: '기타',
}

export function labelSiteType(features: Record<string, unknown> | null): string {
  const v = features && typeof features.siteType === 'string' ? features.siteType : ''
  return SITE_TYPE_LABEL[v] ?? '—'
}

/** 견적 범위 — 만원 단위. min/max 둘 다 없으면 "미정". */
export function formatBudgetRange(
  min: number | null,
  max: number | null,
): string {
  if (min == null && max == null) return '미정'
  if (min != null && max != null) {
    if (min === max) return `${min}만원`
    return `${min}~${max}만원`
  }
  if (min != null) return `${min}만원+`
  return `~${max}만원`
}

const DATE_FMT_LIST = new Intl.DateTimeFormat('ko-KR', {
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

const DATE_FMT_CARD = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
})

const DATE_FMT_DETAIL = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

export function formatListDate(iso: string): string {
  const d = new Date(iso)
  if (!Number.isFinite(d.getTime())) return '—'
  return DATE_FMT_LIST.format(d)
}

export function formatCardDate(iso: string): string {
  const d = new Date(iso)
  if (!Number.isFinite(d.getTime())) return '—'
  return DATE_FMT_CARD.format(d)
}

export function formatDetailDate(iso: string): string {
  const d = new Date(iso)
  if (!Number.isFinite(d.getTime())) return '—'
  return DATE_FMT_DETAIL.format(d)
}
