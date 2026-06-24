'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { LEAD_STATUS_KEYS, LEAD_STATUS_LABEL } from '@/lib/admin/status'

type Props = {
  q: string
  status: string
  channel: string
  sort: 'newest' | 'oldest'
}

export function LeadsToolbar({ q, status, channel, sort }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [qInput, setQInput] = useState(q)
  const [pending, startTransition] = useTransition()

  // URL이 외부에서 바뀌면 input도 동기화 (브라우저 뒤로가기 등)
  useEffect(() => {
    setQInput(q)
  }, [q])

  const apply = (patch: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '')
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === '') params.delete(k)
      else params.set(k, v)
    }
    // 필터·정렬 바뀌면 1페이지로
    params.delete('page')
    const qs = params.toString()
    startTransition(() => {
      router.push(qs ? `/admin/leads?${qs}` : '/admin/leads')
    })
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        apply({ q: qInput.trim() })
      }}
      className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center"
    >
      <input
        type="search"
        value={qInput}
        onChange={(e) => setQInput(e.target.value)}
        placeholder="이름·연락처·회사명 검색"
        aria-label="이름·연락처·회사명 검색"
        className="h-10 flex-1 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
      />
      <div className="flex gap-2">
        <select
          value={channel}
          onChange={(e) =>
            apply({ channel: e.target.value === 'all' ? null : e.target.value })
          }
          aria-label="유입 채널 필터"
          className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="all">전체 채널</option>
          <option value="consult">문의</option>
          <option value="wizard">위저드</option>
        </select>
        <select
          value={status}
          onChange={(e) =>
            apply({ status: e.target.value === 'all' ? null : e.target.value })
          }
          aria-label="상태 필터"
          className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="all">전체 상태</option>
          {LEAD_STATUS_KEYS.map((k) => (
            <option key={k} value={k}>
              {LEAD_STATUS_LABEL[k]}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) =>
            apply({ sort: e.target.value === 'newest' ? null : e.target.value })
          }
          aria-label="정렬"
          className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="newest">최신순</option>
          <option value="oldest">오래된순</option>
        </select>
        <button
          type="button"
          onClick={() =>
            startTransition(() => {
              router.refresh()
            })
          }
          disabled={pending}
          aria-label="새로고침"
          className="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:text-gray-900 disabled:opacity-60"
        >
          {pending ? '갱신 중…' : '새로고침'}
        </button>
      </div>
    </form>
  )
}
