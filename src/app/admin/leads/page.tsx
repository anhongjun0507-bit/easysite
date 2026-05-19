import type { Metadata } from 'next'
import Link from 'next/link'
import { requireAdmin } from '@/lib/admin/auth'
import {
  formatBudgetRange,
  formatCardDate,
  formatListDate,
  labelSiteType,
  LEADS_PAGE_SIZE,
  listLeads,
  type LeadListItem,
} from '@/lib/admin/leads'
import {
  LEAD_STATUS_CHIP,
  isLeadStatusKey,
  labelForStatus,
  type LeadStatusKey,
} from '@/lib/admin/status'
import { LeadsToolbar } from './LeadsToolbar'

export const metadata: Metadata = {
  title: 'Admin · 리드',
  robots: { index: false, follow: false },
}

// 쿼리 파라미터마다 항상 fresh — 관리자는 새 리드를 즉시 보고 싶음
export const dynamic = 'force-dynamic'

type RawSearchParams = Record<string, string | string[] | undefined>

function pickStr(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? ''
  return v ?? ''
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: RawSearchParams
}) {
  requireAdmin('/admin/leads')

  const q = pickStr(searchParams.q).trim()
  const statusRaw = pickStr(searchParams.status)
  const sortRaw = pickStr(searchParams.sort)
  const pageRaw = pickStr(searchParams.page)

  const status: LeadStatusKey | undefined = isLeadStatusKey(statusRaw)
    ? statusRaw
    : undefined
  const sort: 'newest' | 'oldest' = sortRaw === 'oldest' ? 'oldest' : 'newest'
  const pageNum = Math.max(1, Number.parseInt(pageRaw, 10) || 1)

  const { rows, total, page, totalPages } = await listLeads({
    q,
    status,
    sort,
    page: pageNum,
  })

  const hasFilter = Boolean(q) || Boolean(status) || sort !== 'newest'
  const rangeStart = total === 0 ? 0 : (page - 1) * LEADS_PAGE_SIZE + 1
  const rangeEnd = Math.min(total, page * LEADS_PAGE_SIZE)

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-600">
          리드
        </p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
          전체 리드
        </h1>
        <p className="mt-2 text-sm tabular-nums text-gray-500">
          {total > 0
            ? `${rangeStart}–${rangeEnd} / 총 ${total}건 · 페이지 ${page}/${totalPages}`
            : '검색 결과 0건'}
        </p>
      </header>

      <LeadsToolbar
        q={q}
        status={status ?? 'all'}
        sort={sort}
      />

      {rows.length === 0 ? (
        <EmptyState hasFilter={hasFilter} />
      ) : (
        <>
          {/* 데스크톱 테이블 (md+) */}
          <div className="mt-6 hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block">
            <table className="w-full border-separate border-spacing-0 text-sm">
              <thead>
                <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  <Th>생성일</Th>
                  <Th>이름</Th>
                  <Th>연락처</Th>
                  <Th>사이트 종류</Th>
                  <Th>업종</Th>
                  <Th>견적 범위</Th>
                  <Th>상태</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <LeadTableRow key={row.id} row={row} />
                ))}
              </tbody>
            </table>
          </div>

          {/* 모바일 카드 리스트 (md 미만) */}
          <ul className="mt-6 space-y-2 md:hidden">
            {rows.map((row) => (
              <li key={row.id}>
                <LeadCard row={row} />
              </li>
            ))}
          </ul>

          <Pagination
            page={page}
            totalPages={totalPages}
            params={{ q, status: status ?? '', sort: sort === 'newest' ? '' : sort }}
          />
        </>
      )}
    </section>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  // AdminNav 높이 ≈ 65px (py-3 + h-10 + border) → 64px로 살짝 겹치게
  return (
    <th
      scope="col"
      className="sticky top-16 z-10 border-b border-gray-200 bg-gray-50 px-4 py-3 font-semibold first:rounded-tl-2xl last:rounded-tr-2xl"
    >
      {children}
    </th>
  )
}

function LeadTableRow({ row }: { row: LeadListItem }) {
  const href = `/admin/leads/${row.id}`
  const ariaLabel = `${row.contact_name ?? '이름 미입력'} 상세 보기`

  return (
    <tr className="group/row transition-colors hover:bg-gray-50">
      <Td>
        <CellLink href={href} aria-label={ariaLabel}>
          <span className="tabular-nums text-gray-600">
            {formatListDate(row.created_at)}
          </span>
        </CellLink>
      </Td>
      <Td>
        <CellLink href={href} aria-label={ariaLabel}>
          <span className="font-semibold text-gray-900">
            {row.contact_name ?? '이름 미입력'}
          </span>
          {row.business_name && (
            <span className="block text-xs text-gray-500">
              {row.business_name}
            </span>
          )}
        </CellLink>
      </Td>
      <Td>
        <CellLink href={href} aria-label={ariaLabel}>
          <span className="tabular-nums text-gray-700">
            {row.contact_phone ?? '—'}
          </span>
        </CellLink>
      </Td>
      <Td>
        <CellLink href={href} aria-label={ariaLabel}>
          <span className="text-gray-700">{labelSiteType(row.features)}</span>
        </CellLink>
      </Td>
      <Td>
        <CellLink href={href} aria-label={ariaLabel}>
          <span className="text-gray-700">{row.industry ?? '—'}</span>
        </CellLink>
      </Td>
      <Td>
        <CellLink href={href} aria-label={ariaLabel}>
          <span className="tabular-nums text-gray-700">
            {formatBudgetRange(row.estimated_price_min, row.estimated_price_max)}
          </span>
        </CellLink>
      </Td>
      <Td>
        <CellLink href={href} aria-label={ariaLabel}>
          <StatusChip status={row.status} />
        </CellLink>
      </Td>
    </tr>
  )
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="border-b border-gray-100 align-middle">{children}</td>
  )
}

function CellLink({
  href,
  children,
  ...rest
}: {
  href: string
  children: React.ReactNode
  'aria-label'?: string
}) {
  return (
    <Link href={href} className="block px-4 py-3" {...rest}>
      {children}
    </Link>
  )
}

function LeadCard({ row }: { row: LeadListItem }) {
  return (
    <Link
      href={`/admin/leads/${row.id}`}
      className="flex min-h-[88px] flex-col gap-1.5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-gray-300 active:bg-gray-50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-gray-900">
            {row.contact_name ?? '이름 미입력'}
          </p>
          <p className="mt-0.5 truncate text-sm tabular-nums text-gray-600">
            {row.contact_phone ?? '—'}
          </p>
        </div>
        <StatusChip status={row.status} />
      </div>
      <div className="flex items-center justify-between text-xs tabular-nums text-gray-500">
        <span>
          견적 {formatBudgetRange(row.estimated_price_min, row.estimated_price_max)}
        </span>
        <span>{formatCardDate(row.created_at)}</span>
      </div>
    </Link>
  )
}

function StatusChip({ status }: { status: string }) {
  const chip = isLeadStatusKey(status)
    ? LEAD_STATUS_CHIP[status]
    : 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
  return (
    <span
      className={`inline-flex h-7 shrink-0 items-center rounded-full px-2.5 text-xs font-semibold ${chip}`}
    >
      {labelForStatus(status)}
    </span>
  )
}

function EmptyState({ hasFilter }: { hasFilter: boolean }) {
  if (hasFilter) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-base font-semibold text-gray-900">
          조건에 맞는 리드가 없어요
        </p>
        <p className="mt-1 text-sm text-gray-500">
          검색어나 필터를 바꿔보세요.
        </p>
        <Link
          href="/admin/leads"
          className="mt-4 inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
        >
          필터 초기화
        </Link>
      </div>
    )
  }
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
      <p className="text-base font-semibold text-gray-900">
        아직 리드가 없어요
      </p>
      <p className="mt-1 text-sm text-gray-500">
        위저드 링크를 숨고에 공유해보세요. 첫 견적 요청이 들어오면 여기에 표시돼요.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/wizard"
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 items-center rounded-md bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          위저드 미리보기
        </Link>
        <Link
          href="/admin"
          className="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:text-gray-900"
        >
          대시보드로
        </Link>
      </div>
    </div>
  )
}

function Pagination({
  page,
  totalPages,
  params,
}: {
  page: number
  totalPages: number
  params: { q: string; status: string; sort: string }
}) {
  if (totalPages <= 1) return null

  const makeHref = (p: number): string => {
    const sp = new URLSearchParams()
    if (params.q) sp.set('q', params.q)
    if (params.status) sp.set('status', params.status)
    if (params.sort) sp.set('sort', params.sort)
    if (p > 1) sp.set('page', String(p))
    const qs = sp.toString()
    return qs ? `/admin/leads?${qs}` : '/admin/leads'
  }

  // 현재 페이지를 중심으로 최대 5개 페이지 번호
  const windowSize = 5
  const start = Math.max(1, Math.min(page - 2, totalPages - windowSize + 1))
  const end = Math.min(totalPages, start + windowSize - 1)
  const pages: number[] = []
  for (let i = start; i <= end; i++) pages.push(i)

  const prevDisabled = page <= 1
  const nextDisabled = page >= totalPages

  return (
    <nav
      aria-label="페이지 네비게이션"
      className="mt-6 flex flex-wrap items-center justify-center gap-1 text-sm"
    >
      <PageLink href={makeHref(Math.max(1, page - 1))} disabled={prevDisabled}>
        이전
      </PageLink>
      {pages.map((p) => (
        <PageLink
          key={p}
          href={makeHref(p)}
          active={p === page}
          aria-label={`${p}페이지`}
        >
          <span className="tabular-nums">{p}</span>
        </PageLink>
      ))}
      <PageLink
        href={makeHref(Math.min(totalPages, page + 1))}
        disabled={nextDisabled}
      >
        다음
      </PageLink>
    </nav>
  )
}

function PageLink({
  href,
  children,
  active = false,
  disabled = false,
  ...rest
}: {
  href: string
  children: React.ReactNode
  active?: boolean
  disabled?: boolean
  'aria-label'?: string
}) {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className="inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-gray-200 px-3 font-medium text-gray-400"
      >
        {children}
      </span>
    )
  }
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md px-3 font-medium transition ${
        active
          ? 'bg-gray-900 text-white'
          : 'border border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
      }`}
      {...rest}
    >
      {children}
    </Link>
  )
}
