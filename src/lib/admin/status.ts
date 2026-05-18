/**
 * 리드 상태 enum + 한국어 라벨·색상.
 * leads.status 컬럼은 string. 시스템 키('new', 'in_progress', ...)로 저장하고 표시할 때만 한국어 라벨.
 */

export const LEAD_STATUS_KEYS = [
  'new',
  'in_progress',
  'contract',
  'canceled',
  'on_hold',
] as const

export type LeadStatusKey = (typeof LEAD_STATUS_KEYS)[number]

export const LEAD_STATUS_LABEL: Record<LeadStatusKey, string> = {
  new: '신규',
  in_progress: '진행중',
  contract: '계약',
  canceled: '취소',
  on_hold: '보류',
}

/** Tailwind 클래스 — 칩·태그용 */
export const LEAD_STATUS_CHIP: Record<LeadStatusKey, string> = {
  new: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
  in_progress: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200',
  contract: 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200',
  canceled: 'bg-gray-100 text-gray-500 ring-1 ring-gray-200',
  on_hold: 'bg-slate-50 text-slate-700 ring-1 ring-slate-200',
}

export function isLeadStatusKey(v: unknown): v is LeadStatusKey {
  return typeof v === 'string' && (LEAD_STATUS_KEYS as readonly string[]).includes(v)
}

export function labelForStatus(v: string | null | undefined): string {
  if (!v) return '미설정'
  if (isLeadStatusKey(v)) return LEAD_STATUS_LABEL[v]
  return v
}
