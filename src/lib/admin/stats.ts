import { createAdminClient } from '@/lib/supabase/admin'
import {
  LEAD_STATUS_KEYS,
  type LeadStatusKey,
} from './status'

export type OverviewStats = {
  totalLeads: number
  weekLeads: number
  wizardStarted: number
  wizardCompleted: number
  wizardCompletionRate: number // 0~100
  chatLeadCount: number
  chatRate: number // 0~100 (위저드 완료 대비)
  contractCount: number
  contractRate: number // 0~100 (전체 대비)
  statusCounts: Record<LeadStatusKey | 'other', number>
  funnel: Array<{ step: string; started: number; completed: number }>
}

const STEP_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', 'contact'] as const

export async function getOverviewStats(): Promise<OverviewStats> {
  const admin = createAdminClient()
  const weekAgoIso = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  // 병렬 쿼리 — Phase 1 데이터 규모에서 충분히 빠름
  const [
    totalLeadsRes,
    weekLeadsRes,
    statusRes,
    wizardStartedRes,
    wizardCompletedRes,
    chatRes,
    stepStartedRes,
    stepCompletedRes,
  ] = await Promise.all([
    admin.from('leads').select('id', { count: 'exact', head: true }),
    admin
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', weekAgoIso),
    admin.from('leads').select('status'),
    admin
      .from('lead_events')
      .select('session_id')
      .eq('event_type', 'wizard_started'),
    admin
      .from('lead_events')
      .select('session_id')
      .eq('event_type', 'wizard_completed'),
    admin
      .from('conversations')
      .select('lead_id')
      .eq('role', 'user')
      .not('lead_id', 'is', null),
    admin
      .from('lead_events')
      .select('session_id, payload')
      .eq('event_type', 'step_started'),
    admin
      .from('lead_events')
      .select('session_id, payload')
      .eq('event_type', 'step_completed'),
  ])

  // 상태 분포 — 클라이언트측 그룹화 (행 수 적음)
  const statusCounts: Record<string, number> = {}
  for (const k of LEAD_STATUS_KEYS) statusCounts[k] = 0
  statusCounts['other'] = 0
  for (const row of statusRes.data ?? []) {
    const s = (row.status ?? 'new').trim() || 'new'
    if (s in statusCounts) statusCounts[s] += 1
    else statusCounts['other'] += 1
  }

  // 위저드 시작·완료 distinct session
  const startedSet = new Set<string>(
    (wizardStartedRes.data ?? [])
      .map((r) => r.session_id ?? '')
      .filter(Boolean),
  )
  const completedSet = new Set<string>(
    (wizardCompletedRes.data ?? [])
      .map((r) => r.session_id ?? '')
      .filter(Boolean),
  )
  const wizardStarted = startedSet.size
  const wizardCompleted = completedSet.size
  const wizardCompletionRate =
    wizardStarted > 0 ? (wizardCompleted / wizardStarted) * 100 : 0

  // 챗봇 사용한 lead distinct
  const chatLeads = new Set<string>(
    (chatRes.data ?? [])
      .map((r) => r.lead_id ?? '')
      .filter(Boolean),
  )
  const chatLeadCount = chatLeads.size
  // 분모는 위저드 완료 — 그 lead가 결과 페이지에 도달해야 챗봇 사용 가능
  const chatRate =
    wizardCompleted > 0 ? (chatLeadCount / wizardCompleted) * 100 : 0

  const totalLeads = totalLeadsRes.count ?? 0
  const weekLeads = weekLeadsRes.count ?? 0
  const contractCount = statusCounts['contract'] ?? 0
  const contractRate = totalLeads > 0 ? (contractCount / totalLeads) * 100 : 0

  // 위저드 단계별 funnel
  const startedByStep = bucketBySession(stepStartedRes.data ?? [])
  const completedByStep = bucketBySession(stepCompletedRes.data ?? [])
  const funnel = STEP_KEYS.map((step) => ({
    step,
    started: startedByStep.get(step)?.size ?? 0,
    completed: completedByStep.get(step)?.size ?? 0,
  }))

  return {
    totalLeads,
    weekLeads,
    wizardStarted,
    wizardCompleted,
    wizardCompletionRate,
    chatLeadCount,
    chatRate,
    contractCount,
    contractRate,
    statusCounts: statusCounts as OverviewStats['statusCounts'],
    funnel,
  }
}

function bucketBySession(
  rows: Array<{ session_id: string | null; payload: unknown }>,
): Map<string, Set<string>> {
  const out = new Map<string, Set<string>>()
  for (const r of rows) {
    const step = stepOf(r.payload)
    const sid = r.session_id ?? ''
    if (!step || !sid) continue
    let bucket = out.get(step)
    if (!bucket) {
      bucket = new Set()
      out.set(step, bucket)
    }
    bucket.add(sid)
  }
  return out
}

function stepOf(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null
  const v = (payload as Record<string, unknown>).step
  if (v === null || v === undefined) return null
  return String(v)
}
