import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin/auth'
import {
  formatBudgetRange,
  formatDetailDate,
  getLead,
  labelSiteType,
} from '@/lib/admin/leads'
import { LEAD_STATUS_CHIP, isLeadStatusKey, labelForStatus } from '@/lib/admin/status'

export const metadata: Metadata = {
  title: 'Admin · 리드 상세',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function LeadDetailPage({
  params,
}: {
  params: { id: string }
}) {
  requireAdmin(`/admin/leads/${params.id}`)

  const lead = await getLead(params.id)
  if (!lead) notFound()

  const chip = isLeadStatusKey(lead.status)
    ? LEAD_STATUS_CHIP[lead.status]
    : 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'

  return (
    <section className="mx-auto max-w-3xl px-4 py-8 sm:px-8 sm:py-10">
      <Link
        href="/admin/leads"
        className="inline-flex items-center text-sm font-medium text-gray-500 transition hover:text-gray-900"
      >
        ← 리드 목록
      </Link>

      <header className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {lead.contact_name ?? '이름 미입력'}
          </h1>
          {lead.business_name && (
            <p className="mt-1 text-sm text-gray-500">{lead.business_name}</p>
          )}
        </div>
        <span
          className={`inline-flex h-8 items-center rounded-full px-3 text-sm font-semibold ${chip}`}
        >
          {labelForStatus(lead.status)}
        </span>
      </header>

      <p className="mt-2 text-xs tabular-nums text-gray-500">
        접수 {formatDetailDate(lead.created_at)}
      </p>

      <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-3 rounded-2xl border border-gray-200 bg-white p-5 text-sm shadow-sm sm:grid-cols-2">
        <Field label="연락처" value={lead.contact_phone} mono />
        <Field label="이메일" value={lead.contact_email} />
        <Field label="사이트 종류" value={labelSiteType(lead.features)} />
        <Field label="업종" value={lead.industry} />
        <Field
          label="견적 범위"
          value={formatBudgetRange(
            lead.estimated_price_min,
            lead.estimated_price_max,
          )}
          mono
        />
        <Field
          label="페이지 수"
          value={lead.page_count != null ? `약 ${lead.page_count}개` : null}
          mono
        />
      </dl>

      <p className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white p-5 text-sm text-gray-500">
        상세 화면은 다음 단계에서 구현됩니다. (위저드 응답·챗봇 내용·메모 등)
      </p>
    </section>
  )
}

function Field({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string | null | undefined
  mono?: boolean
}) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </dt>
      <dd
        className={`mt-0.5 text-gray-900 ${mono ? 'tabular-nums' : ''} ${value ? '' : 'text-gray-400'}`}
      >
        {value || '—'}
      </dd>
    </div>
  )
}
