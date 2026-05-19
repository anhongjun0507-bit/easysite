'use client'

import { useEffect, useRef, useState } from 'react'
import { updateLeadMemoAction } from './actions'
import { showToast } from './Toaster'

type SaveState = 'idle' | 'pending' | 'saved' | 'error'
const DEBOUNCE_MS = 1000

export function LeadMemoEditor({
  leadId,
  initialMemo,
}: {
  leadId: string
  initialMemo: string
}) {
  const [value, setValue] = useState(initialMemo)
  const [state, setState] = useState<SaveState>('idle')
  const timer = useRef<number | null>(null)
  const lastSaved = useRef(initialMemo)
  const lastError = useRef<string | null>(null)

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [])

  const scheduleSave = (next: string) => {
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(async () => {
      if (next === lastSaved.current) return
      setState('pending')
      const result = await updateLeadMemoAction(leadId, next)
      if (result.ok) {
        lastSaved.current = next
        setState('saved')
        showToast('메모 저장됨')
      } else {
        lastError.current = result.error
        setState('error')
        showToast(result.error, 'error')
      }
    }, DEBOUNCE_MS)
  }

  const onChange = (next: string) => {
    setValue(next)
    setState('idle')
    scheduleSave(next)
  }

  const dirty = value !== lastSaved.current

  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        maxLength={5000}
        placeholder="이 리드에 대한 메모를 자유롭게 적어주세요. 1초 후 자동 저장됩니다."
        aria-label="어드민 메모"
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-relaxed text-gray-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
      />
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="tabular-nums text-gray-500">{value.length} / 5000자</span>
        <span aria-live="polite" className="text-right">
          {state === 'pending' && <span className="text-gray-500">저장 중…</span>}
          {state === 'saved' && !dirty && (
            <span className="font-semibold text-emerald-600">✓ 저장됨</span>
          )}
          {state === 'error' && (
            <span className="font-semibold text-rose-600">
              ⚠ {lastError.current ?? '저장 실패'}
            </span>
          )}
          {state === 'idle' && dirty && (
            <span className="text-gray-400">입력 중…</span>
          )}
        </span>
      </div>
    </div>
  )
}
