'use client'

import { useState } from 'react'
import type { ConversationRow } from '@/lib/admin/leads'

const INITIAL_SHOW = 5

const TIME_FMT = new Intl.DateTimeFormat('ko-KR', {
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

export function ChatLog({ messages }: { messages: ConversationRow[] }) {
  const [expanded, setExpanded] = useState(false)
  const visible =
    expanded || messages.length <= INITIAL_SHOW
      ? messages
      : messages.slice(0, INITIAL_SHOW)
  const hiddenCount = messages.length - visible.length

  return (
    <div>
      <ul className="space-y-2.5">
        {visible.map((m) => (
          <li
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'border border-gray-200 bg-white text-gray-900'
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{m.content}</p>
              <p
                className={`mt-1 text-[10px] tabular-nums ${m.role === 'user' ? 'text-indigo-100' : 'text-gray-400'}`}
              >
                {formatTime(m.created_at)}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
        >
          더 보기 (+{hiddenCount}개)
        </button>
      )}
      {expanded && messages.length > INITIAL_SHOW && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="mt-3 text-xs font-medium text-gray-500 underline-offset-2 hover:text-gray-700 hover:underline"
        >
          접기
        </button>
      )}
    </div>
  )
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  if (!Number.isFinite(d.getTime())) return '—'
  return TIME_FMT.format(d)
}
