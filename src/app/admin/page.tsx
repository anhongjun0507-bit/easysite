import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/admin/auth'
import { getOverviewStats, type OverviewStats } from '@/lib/admin/stats'
import {
  LEAD_STATUS_CHIP,
  LEAD_STATUS_KEYS,
  LEAD_STATUS_LABEL,
} from '@/lib/admin/status'

export const metadata: Metadata = {
  title: 'Admin · 개요',
  robots: { index: false, follow: false },
}

// 통계 캐시 30초 — 본인이 자주 새로고침해도 부담 X
export const revalidate = 30

export default async function AdminOverviewPage() {
  requireAdmin('/admin')
  const stats = await getOverviewStats()

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-600">
          개요
        </p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
          대시보드
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          최근 30초 캐시 · 새로고침으로 갱신
        </p>
      </header>

      {/* 통계 4카드 */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="이번 주 신규"
          value={String(stats.weekLeads)}
          detail={`지난 7일 · 전체 ${stats.totalLeads}건`}
        />
        <StatCard
          label="챗봇 사용률"
          value={formatPercent(stats.chatRate)}
          detail={`완료 ${stats.wizardCompleted} 중 ${stats.chatLeadCount}건 챗봇 사용`}
        />
        <StatCard
          label="계약율"
          value={formatPercent(stats.contractRate)}
          detail={`전체 ${stats.totalLeads} 중 ${stats.contractCount}건 계약`}
        />
        <StatCard
          label="위저드 완료율"
          value={formatPercent(stats.wizardCompletionRate)}
          detail={`시작 ${stats.wizardStarted} → 완료 ${stats.wizardCompleted}`}
        />
      </div>

      {/* 상태 분포 */}
      <StatusDistribution counts={stats.statusCounts} />

      {/* 위저드 이탈 단계 */}
      <WizardFunnel funnel={stats.funnel} />
    </section>
  )
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail?: string
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </p>
      <p
        className="mt-2 font-bold tabular-nums text-gray-900"
        style={{ fontSize: 'clamp(28px, 4vw, 36px)', lineHeight: 1.1 }}
      >
        {value}
      </p>
      {detail && (
        <p className="mt-1 text-xs leading-relaxed text-gray-500">{detail}</p>
      )}
    </div>
  )
}

function StatusDistribution({
  counts,
}: {
  counts: OverviewStats['statusCounts']
}) {
  const total = LEAD_STATUS_KEYS.reduce((acc, k) => acc + (counts[k] ?? 0), 0)
  return (
    <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-baseline justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          상태 분포
        </p>
        <p className="text-xs tabular-nums text-gray-500">총 {total}건</p>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {LEAD_STATUS_KEYS.map((k) => (
          <span
            key={k}
            className={`inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-sm font-semibold ${LEAD_STATUS_CHIP[k]}`}
          >
            <span>{LEAD_STATUS_LABEL[k]}</span>
            <span className="tabular-nums">{counts[k] ?? 0}</span>
          </span>
        ))}
        {counts.other > 0 && (
          <span className="inline-flex h-9 items-center gap-2 rounded-full bg-gray-50 px-3.5 text-sm font-medium text-gray-500 ring-1 ring-gray-200">
            <span>기타</span>
            <span className="tabular-nums">{counts.other}</span>
          </span>
        )}
      </div>
    </div>
  )
}

function WizardFunnel({ funnel }: { funnel: OverviewStats['funnel'] }) {
  const maxStarted = Math.max(1, ...funnel.map((f) => f.started))

  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-baseline justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          위저드 단계별 이탈
        </p>
        <p className="text-xs text-gray-500">step_started 이벤트 기반</p>
      </div>

      <div className="mt-4 space-y-3">
        {funnel.map((f) => {
          const dropoutRate =
            f.started > 0 ? (1 - f.completed / f.started) * 100 : 0
          const highDropout = f.started > 0 && dropoutRate >= 50
          const widthPct = (f.started / maxStarted) * 100
          return (
            <div key={f.step}>
              <div className="flex items-baseline justify-between gap-2 text-xs sm:text-sm">
                <span className="font-semibold text-gray-700">
                  {f.step === 'contact' ? 'Contact (연락처)' : `Step ${f.step}`}
                </span>
                <span className="tabular-nums text-gray-600">
                  {f.completed}/{f.started} 완료
                  {f.started > 0 && (
                    <span
                      className={`ml-2 font-semibold ${highDropout ? 'text-amber-600' : 'text-gray-500'}`}
                    >
                      이탈 {Math.round(dropoutRate)}%
                    </span>
                  )}
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full transition-all ${highDropout ? 'bg-amber-500' : 'bg-indigo-600'}`}
                  style={{ width: `${widthPct}%` }}
                  aria-hidden="true"
                />
              </div>
            </div>
          )
        })}
        {maxStarted === 1 && funnel.every((f) => f.started === 0) && (
          <p className="rounded-lg bg-gray-50 px-3 py-3 text-xs leading-relaxed text-gray-500">
            아직 위저드 이벤트가 없어요. 위저드 한 번 진행하시면 단계별 도달
            현황이 여기에 표시됩니다.
          </p>
        )}
      </div>
    </div>
  )
}

function formatPercent(v: number): string {
  if (!Number.isFinite(v)) return '0%'
  return `${Math.round(v)}%`
}
