'use client'

import { createPortal } from 'react-dom'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import { gsap, useGSAP } from '@/lib/letters/gsap'
import { EASE_REVEAL } from '@/lib/letters/motion'
import { groupByMonth } from '@/lib/letters/index-group'
import { DISPLAY } from '@/content/letters-copy'
import { hasReply, type LetterEntry } from '@/content/letters'
import { useLettersEnv } from './LettersShell'

/**
 * 우편함 — 전체 편지를 한 화면에서 훑고, 고른 날짜로 건너뛴다.
 *
 * 목록이 아니라 **항로도**로 읽히게 만든다: 달마다 점선 항로가 한 줄기 내려가고
 * 엔트리는 그 위의 점이다. 답장을 쓴 날만 점이 로즈로 채워진다(= 소인).
 * 색·모서리·선은 전부 기존 토큰만 쓴다 — 이 화면 때문에 새로 생기는 조형은 없다.
 */

const KIND_SHORT: Record<LetterEntry['kind'], string> = { letter: '편지', diary: '일기' }

/** 'YYYY-MM-DD' → '3월 14일' (달은 월 그룹 제목이 이미 말해 주므로 연도는 빼고 짧게) */
function dayLabel(iso: string): string {
  const [, m, d] = iso.split('-')
  return `${Number(m)}월 ${Number(d)}일`
}

export function Mailbox({ entries }: { entries: LetterEntry[] }) {
  const [open, setOpen] = useState(false)
  const panel = useRef<HTMLDivElement>(null)
  const opener = useRef<HTMLButtonElement>(null)
  const lenis = useLenis()
  const { reduced } = useLettersEnv()
  const months = useMemo(() => groupByMonth(entries), [entries])

  const close = useCallback(() => {
    setOpen(false)
    opener.current?.focus()
  }, [])

  // 배경 스크롤 정지 + 첫 항목 포커스 (리더와 같은 규칙)
  useEffect(() => {
    if (!open) return
    lenis?.stop()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel.current?.querySelector<HTMLElement>('[data-mb-row]')?.focus()
    return () => {
      lenis?.start()
      document.body.style.overflow = prevOverflow
    }
  }, [open, lenis])

  // ESC 닫기 · ↑↓ 항목 이동 · Tab 포커스 트랩
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      const rows = Array.from(panel.current?.querySelectorAll<HTMLElement>('[data-mb-row]') ?? [])
      if (e.key === 'Escape') {
        close()
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (!rows.length) return
        e.preventDefault()
        const i = rows.indexOf(document.activeElement as HTMLElement)
        const step = e.key === 'ArrowDown' ? 1 : -1
        rows[(i + step + rows.length) % rows.length]?.focus()
      } else if (e.key === 'Tab') {
        const list = Array.from(panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled)') ?? [])
        if (!list.length) return
        e.preventDefault()
        const i = list.indexOf(document.activeElement as HTMLElement)
        const nextIdx = e.shiftKey ? (i <= 0 ? list.length - 1 : i - 1) : (i + 1) % list.length
        list[nextIdx]?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  // 항로가 위에서 아래로 그어지고, 그 위에 점과 날짜가 차례로 켜진다
  useGSAP(
    () => {
      if (!open || reduced) return
      gsap.fromTo(
        '[data-mb-rail]',
        { scaleY: 0 },
        { scaleY: 1, duration: 0.7, ease: 'power2.out', stagger: 0.06 },
      )
      gsap.fromTo(
        '[data-mb-row]',
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.6, ease: EASE_REVEAL, stagger: 0.035, delay: 0.12 },
      )
    },
    { scope: panel, dependencies: [open, reduced] },
  )

  const goTo = (id: string) => {
    setOpen(false)
    // id 가 숫자로 시작해서 querySelector('#2026-…') 는 못 쓴다 — 엘리먼트를 직접 넘긴다
    const el = document.getElementById(id)
    if (!el) return
    history.replaceState(null, '', `#${id}`)
    if (lenis) lenis.scrollTo(el, { offset: -window.innerHeight * 0.12 })
    else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  const host = typeof document === 'undefined' ? null : document.querySelector('.letters-root')

  return (
    <>
      <button
        type="button"
        className="lt-mailbox-btn"
        ref={opener}
        onClick={() => setOpen(true)}
        aria-expanded={open}
      >
        <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden>
          <path
            d="M2 5.4 8 2l6 3.4v7.1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5.4Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
          />
          <path d="M2.4 5.6 8 9l5.6-3.4" fill="none" stroke="currentColor" strokeWidth="1.1" />
        </svg>
        우편함
      </button>

      {open &&
        host &&
        createPortal(
          <div className="lt-mailbox" ref={panel} role="dialog" aria-modal="true" aria-label="우편함">
            <div className="lt-mailbox-bar">
              <p className="lt-display lt-mailbox-title">{DISPLAY.mailboxTitle}</p>
              <button type="button" className="lt-btn lt-btn-sm" onClick={close}>
                닫기
              </button>
            </div>

            <div className="lt-mailbox-scroll">
              {months.map((month) => (
                <section className="lt-mb-month" key={month.key}>
                  <p className="lt-label">{month.label}</p>
                  <div className="lt-mb-list">
                    <span className="lt-mb-rail" data-mb-rail aria-hidden />
                    {month.entries.map((entry) => (
                      <button
                        type="button"
                        className="lt-mb-row"
                        data-mb-row
                        key={entry.id}
                        onClick={() => goTo(entry.id)}
                      >
                        <span className="lt-mb-dot" data-replied={hasReply(entry) ? '' : undefined} aria-hidden />
                        <span className="lt-mb-day">{dayLabel(entry.date)}</span>
                        {/* 가운뎃점(·)은 후보 서체에 따라 빈 칸으로 빠진다 — 구분점은 CSS 로 그린다 */}
                        <span className="lt-mb-kind">
                          {KIND_SHORT[entry.kind]}
                          <i className="lt-mb-sep" aria-hidden />
                          {entry.images.length}장
                        </span>
                        <span className="lt-mb-mark">{hasReply(entry) ? '답장함' : ''}</span>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>,
          host,
        )}
    </>
  )
}
