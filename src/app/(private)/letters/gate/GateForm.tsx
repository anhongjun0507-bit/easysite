'use client'

import { useRef, useState } from 'react'
import { gsap, useGSAP } from '@/lib/letters/gsap'
import { GATE } from '@/content/letters-copy'

/**
 * 패스코드 게이트 — 본문과 같은 어둠에서 제목 한 줄과 입력칸 하나만 떠오른다.
 * 검증은 전적으로 서버(/api/letters/unlock + 미들웨어 쿠키)에서 한다. 클라 검증 없음.
 */
export function GateForm() {
  const root = useRef<HTMLDivElement>(null)
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap
        .timeline()
        .from('[data-gate-title]', { opacity: 0, y: 18, filter: 'blur(12px)', duration: 1.4, ease: 'power3.out' })
        .from('[data-gate-hint]', { opacity: 0, y: 12, duration: 1, ease: 'power3.out' }, '-=0.9')
        .from('[data-gate-form]', { opacity: 0, y: 14, duration: 1, ease: 'power3.out' }, '-=0.75')
    },
    { scope: root },
  )

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (busy || !code.trim()) return
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/letters/unlock', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      if (res.ok) {
        window.location.reload() // 쿠키 발급 후 미들웨어가 본문을 내준다
        return
      }
      const data = (await res.json().catch(() => null)) as { error?: string } | null
      setError(data?.error ?? GATE.error)
    } catch {
      setError(GATE.network)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="lt-gate" ref={root}>
      <div className="lt-grain" aria-hidden />
      <div className="lt-vignette" aria-hidden />

      <div className="lt-gate-inner">
        <h1 className="lt-display lt-gate-title" data-gate-title>
          {GATE.title}
        </h1>
        <p className="lt-gate-hint" data-gate-hint>
          {GATE.hint}
        </p>

        <form onSubmit={submit} className="lt-gate-form" data-gate-form>
          <label htmlFor="letters-code" className="lt-label">
            {GATE.label}
          </label>
          <input
            id="letters-code"
            className="lt-gate-input"
            type="password"
            inputMode="text"
            autoComplete="off"
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={busy}
            aria-describedby="letters-code-error"
          />
          <div className="lt-gate-actions">
            <button type="submit" className="lt-btn lt-btn-primary" disabled={busy || !code.trim()}>
              {busy ? GATE.submitting : GATE.submit}
            </button>
            <p className="lt-gate-error" id="letters-code-error" role="status">
              {error}
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
