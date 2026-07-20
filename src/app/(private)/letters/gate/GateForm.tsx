'use client'

import { useRef, useState } from 'react'
import { gsap, useGSAP } from '@/lib/letters/gsap'
import { WaxSeal } from '../_components/svg'

/**
 * 패스코드 게이트 — 밀랍 씰을 눌러 뜯고 코드를 넣는다.
 * 검증은 전적으로 서버(/api/letters/unlock + 미들웨어 쿠키)에서 한다. 클라 검증 없음.
 */
export function GateForm() {
  const root = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [opened, setOpened] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const { contextSafe } = useGSAP({ scope: root })

  const crack = contextSafe(() => {
    if (opened) return
    setOpened(true)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const focus = () => inputRef.current?.focus()

    if (reduce) {
      gsap.set('[data-anim="gate-seal"]', { opacity: 0 })
      gsap.set('[data-anim="gate-form"]', { opacity: 1, y: 0 })
      focus()
      return
    }

    gsap
      .timeline({ onComplete: focus })
      .to('[data-anim="gate-seal-l"]', { xPercent: -38, rotate: -18, duration: 0.5, ease: 'power3.out' })
      .to('[data-anim="gate-seal-r"]', { xPercent: 38, rotate: 20, duration: 0.5, ease: 'power3.out' }, '<')
      .to('[data-anim="gate-seal"]', { opacity: 0, duration: 0.35 }, '-=0.15')
      .to('[data-anim="gate-form"]', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2')
  })

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
      setError(data?.error ?? '조금 뒤에 다시 시도해 주세요')
    } catch {
      setError('연결이 불안정해요. 다시 시도해 주세요')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="lt-gate" ref={root}>
      <div className="lt-grain" aria-hidden />
      <div className="lt-shell">
        <p className="lt-eyebrow">PAR AVION</p>

        {!opened && (
          <button
            type="button"
            onClick={crack}
            className="mx-auto mt-14 grid place-items-center"
            aria-label="밀랍 씰을 눌러 편지 열기"
          >
            <span data-anim="gate-seal" className="relative block h-28 w-28">
              <span
                data-anim="gate-seal-l"
                className="absolute inset-0 block"
                style={{ clipPath: 'inset(0 50% 0 0)' }}
              >
                <WaxSeal className="h-full w-full" id="gate-l" />
              </span>
              <span
                data-anim="gate-seal-r"
                className="absolute inset-0 block"
                style={{ clipPath: 'inset(0 0 0 50%)' }}
              >
                <WaxSeal className="h-full w-full" id="gate-r" />
              </span>
            </span>
            <span className="lt-meta mt-8 block">눌러서 뜯기</span>
          </button>
        )}

        <form
          onSubmit={submit}
          data-anim="gate-form"
          className={opened ? 'mt-14 opacity-0' : 'pointer-events-none absolute opacity-0'}
          style={{ transform: 'translateY(18px)' }}
          aria-hidden={!opened}
        >
          <label htmlFor="letters-code" className="lt-meta block">
            우리만 아는 코드
          </label>
          <input
            id="letters-code"
            ref={inputRef}
            className="lt-gate-input mt-5"
            type="password"
            inputMode="text"
            autoComplete="off"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={!opened || busy}
          />
          <div>
            <button type="submit" className="lt-gate-submit" disabled={busy || !code.trim()}>
              {busy ? '여는 중…' : '열기'}
            </button>
          </div>
          <p className="lt-meta mt-6 min-h-[1.2em] text-[color:var(--stamp)]" role="status">
            {error}
          </p>
        </form>
      </div>
    </div>
  )
}
