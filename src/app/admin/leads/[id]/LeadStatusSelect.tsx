'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { LEAD_STATUS_KEYS, LEAD_STATUS_LABEL } from '@/lib/admin/status'
import { updateLeadStatusAction } from './actions'
import { showToast } from './Toaster'

export function LeadStatusSelect({
  leadId,
  initialStatus,
}: {
  leadId: string
  initialStatus: string
}) {
  const router = useRouter()
  const [status, setStatus] = useState(initialStatus)
  const [pending, startTransition] = useTransition()

  const onChange = (next: string) => {
    const prev = status
    setStatus(next) // optimistic
    startTransition(async () => {
      const result = await updateLeadStatusAction(leadId, next)
      if (!result.ok) {
        setStatus(prev)
        showToast(result.error, 'error')
        return
      }
      showToast(`상태를 "${LEAD_STATUS_LABEL[next as keyof typeof LEAD_STATUS_LABEL] ?? next}"(으)로 변경했어요`)
      router.refresh()
    })
  }

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="sr-only">상태</span>
      <select
        value={status}
        onChange={(e) => onChange(e.target.value)}
        disabled={pending}
        aria-label="리드 상태 변경"
        className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-60"
      >
        {LEAD_STATUS_KEYS.map((k) => (
          <option key={k} value={k}>
            {LEAD_STATUS_LABEL[k]}
          </option>
        ))}
      </select>
      {pending && (
        <span aria-hidden="true" className="text-xs text-gray-500">
          저장 중…
        </span>
      )}
    </label>
  )
}
