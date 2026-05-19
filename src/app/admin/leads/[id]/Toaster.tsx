'use client'

import { useEffect, useState } from 'react'

type ToastKind = 'success' | 'error' | 'info'
type ToastDetail = { message: string; kind?: ToastKind }

const EVENT_NAME = 'easysite-admin-toast'

/** 어디서든 호출 — Toaster가 같은 페이지에 마운트돼 있어야 함 */
export function showToast(message: string, kind: ToastKind = 'success') {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent<ToastDetail>(EVENT_NAME, { detail: { message, kind } }),
  )
}

type Active = { id: number; message: string; kind: ToastKind }

export function Toaster() {
  const [toasts, setToasts] = useState<Active[]>([])

  useEffect(() => {
    let nextId = 1
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ToastDetail>).detail
      if (!detail?.message) return
      const id = nextId++
      const t: Active = {
        id,
        message: detail.message,
        kind: detail.kind ?? 'success',
      }
      setToasts((prev) => [...prev, t])
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== id))
      }, 2400)
    }
    window.addEventListener(EVENT_NAME, handler)
    return () => window.removeEventListener(EVENT_NAME, handler)
  }, [])

  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:bottom-6"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`pointer-events-auto inline-flex max-w-md items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-lg ${kindStyles(t.kind)}`}
        >
          <span aria-hidden="true">{kindIcon(t.kind)}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}

function kindStyles(k: ToastKind): string {
  switch (k) {
    case 'success':
      return 'bg-gray-900 text-white'
    case 'error':
      return 'bg-rose-600 text-white'
    case 'info':
    default:
      return 'bg-indigo-600 text-white'
  }
}

function kindIcon(k: ToastKind): string {
  switch (k) {
    case 'success':
      return '✓'
    case 'error':
      return '⚠'
    case 'info':
    default:
      return 'ℹ'
  }
}
