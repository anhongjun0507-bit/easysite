'use client'

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

const TOAST_KEY = (leadId: string) => `easysite-chat-toast-${leadId}`
const SESSION_KEY = (leadId: string) => `easysite-chat-session-${leadId}`
const MESSAGES_KEY = (leadId: string) => `easysite-chat-messages-${leadId}`

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const GREETING: Message = {
  id: 'greeting',
  role: 'assistant',
  content:
    '안녕하세요 사장님! 견적 보시고 궁금한 점 있으면 편하게 물어봐주세요 :)',
}

const QUICK_PROMPTS = [
  '결제 기능 조정하면 얼마예요?',
  '납기 더 빠르게 가능해요?',
  '비슷한 사례 더 보고 싶어요',
]

const TOAST_DELAY_MS = 5000

export function ChatWidget({ leadId }: { leadId: string }) {
  const [open, setOpen] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastDismissed, setToastDismissed] = useState(true) // 초기 true → useEffect에서 갱신
  const [sessionId, setSessionId] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [limitReached, setLimitReached] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 세션/토스트 dismiss 상태 복원
  useEffect(() => {
    try {
      let sid = sessionStorage.getItem(SESSION_KEY(leadId))
      if (!sid) {
        sid =
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `s_${Date.now()}_${Math.random().toString(36).slice(2)}`
        sessionStorage.setItem(SESSION_KEY(leadId), sid)
      }
      setSessionId(sid)

      const dismissed = sessionStorage.getItem(TOAST_KEY(leadId)) === '1'
      setToastDismissed(dismissed)

      const storedMsgs = sessionStorage.getItem(MESSAGES_KEY(leadId))
      if (storedMsgs) {
        try {
          const parsed = JSON.parse(storedMsgs) as Message[]
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed)
          }
        } catch {
          // ignore
        }
      }
    } catch {
      setSessionId(`s_${Date.now()}_${Math.random().toString(36).slice(2)}`)
    }
  }, [leadId])

  // 메시지 변경 시 sessionStorage 저장
  useEffect(() => {
    if (!leadId || messages.length === 1) return
    try {
      sessionStorage.setItem(MESSAGES_KEY(leadId), JSON.stringify(messages))
    } catch {
      // ignore
    }
  }, [messages, leadId])

  // 5초 후 토스트
  useEffect(() => {
    if (toastDismissed || open) return
    const t = window.setTimeout(() => setToastVisible(true), TOAST_DELAY_MS)
    return () => window.clearTimeout(t)
  }, [toastDismissed, open])

  // 스크롤 끝으로
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages])

  // textarea auto-grow
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`
  }, [input])

  // 패널 열렸을 때 모바일에서 body 스크롤 잠금
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    if (window.matchMedia('(max-width: 639px)').matches) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const openPanel = () => {
    setOpen(true)
    setToastVisible(false)
    setToastDismissed(true)
    try {
      sessionStorage.setItem(TOAST_KEY(leadId), '1')
    } catch {
      // ignore
    }
  }

  const dismissToast = () => {
    setToastVisible(false)
    setToastDismissed(true)
    try {
      sessionStorage.setItem(TOAST_KEY(leadId), '1')
    } catch {
      // ignore
    }
  }

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || streaming || limitReached || !sessionId) return
    setError(null)

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
    }
    const assistantId = `a-${Date.now()}`
    const placeholder: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
    }

    // history는 greeting 제외, 새 user 메시지 제외 (route에서 별도 처리)
    const history = messages
      .filter((m) => m.id !== 'greeting' && m.content.trim())
      .map((m) => ({ role: m.role, content: m.content }))

    setMessages((prev) => [...prev, userMsg, placeholder])
    setInput('')
    setStreaming(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ leadId, sessionId, message: trimmed, history }),
      })

      if (res.status === 429) {
        const j = (await res.json().catch(() => null)) as {
          error?: string
          code?: string
        } | null
        setLimitReached(true)
        setMessages((prev) => prev.filter((m) => m.id !== assistantId))
        setError(j?.error ?? '대화 한도에 도달했어요.')
        return
      }

      if (!res.ok || !res.body) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(j?.error ?? `HTTP ${res.status}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const ev = JSON.parse(line.slice(6)) as {
              type: string
              delta?: string
              error?: string
            }
            if (ev.type === 'text' && ev.delta) {
              accumulated += ev.delta
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: accumulated } : m,
                ),
              )
            } else if (ev.type === 'error') {
              throw new Error(ev.error || 'AI 응답 실패')
            }
          } catch {
            // ignore parse errors
          }
        }
      }

      if (!accumulated.trim()) {
        setMessages((prev) => prev.filter((m) => m.id !== assistantId))
        setError('AI가 응답을 못 받았어요. 다시 시도해주세요.')
      }
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== assistantId))
      setError(err instanceof Error ? err.message : '네트워크 오류가 났어요')
    } finally {
      setStreaming(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const userTurns = messages.filter((m) => m.role === 'user').length

  return (
    <>
      {/* 5초 후 자동 등장 토스트 */}
      {toastVisible && !open && (
        <div className="animate-ease-up fixed bottom-24 right-4 z-40 max-w-[280px] rounded-2xl border border-gray-200 bg-white p-3.5 shadow-lg sm:bottom-28 sm:right-6 sm:max-w-xs">
          <button
            type="button"
            onClick={dismissToast}
            aria-label="알림 닫기"
            className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <button
            type="button"
            onClick={openPanel}
            className="block w-full pr-6 text-left"
          >
            <p className="text-sm font-semibold text-gray-900">
              💬 안녕하세요 사장님!
            </p>
            <p className="mt-1 text-sm leading-relaxed text-gray-700">
              견적 보시고 궁금한 점 있으면 편하게 물어보세요 :)
            </p>
          </button>
        </div>
      )}

      {/* FAB */}
      {!open && (
        <button
          type="button"
          onClick={openPanel}
          aria-label="EasySite 상담 챗봇 열기"
          className="cta-glow fixed bottom-4 right-4 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700 sm:bottom-6 sm:right-6 sm:h-16 sm:w-16"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 sm:h-7 sm:w-7"
            aria-hidden="true"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* 패널 */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="EasySite 상담 챗봇"
          className="fixed inset-0 z-50 flex flex-col bg-white sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[600px] sm:max-h-[calc(100vh-3rem)] sm:w-[420px] sm:max-w-[calc(100vw-3rem)] sm:rounded-2xl sm:border sm:border-gray-200 sm:shadow-2xl"
        >
          {/* 헤더 */}
          <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4 sm:rounded-t-2xl">
            <div>
              <p className="text-base font-bold text-gray-900">
                ✨ EasySite 상담
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                프리즘 안홍준 대표가 직접 설계한 AI예요
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="닫기"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* 메시지 영역 */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto bg-gray-50/60 px-4 py-5 sm:px-5"
          >
            <div className="space-y-3">
              {messages.map((m) => (
                <MessageBubble key={m.id} role={m.role}>
                  {m.content ? (
                    <MarkdownText text={m.content} />
                  ) : (
                    <TypingDots />
                  )}
                </MessageBubble>
              ))}

              {/* 추천 칩 — greeting 직후만 (사장님이 첫 입력 전) */}
              {messages.length === 1 && (
                <div className="mt-1 flex flex-wrap gap-2 pl-1">
                  {QUICK_PROMPTS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => sendMessage(p)}
                      disabled={streaming || limitReached}
                      className="inline-flex h-9 items-center rounded-full border border-indigo-200 bg-white px-3 text-[13px] font-medium text-indigo-700 transition hover:border-indigo-400 hover:bg-indigo-50 disabled:opacity-50"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {error && (
                <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* 입력 */}
          <div className="border-t border-gray-200 bg-white px-3 py-3 sm:rounded-b-2xl sm:px-4 sm:py-4">
            {limitReached ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center text-xs leading-relaxed text-amber-900">
                대화가 길어졌어요. 더 자세한 상담은 운영자와 직접 카톡 부탁드려요.
                <a
                  href="tel:01037825418"
                  className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-lg bg-gray-900 px-4 text-sm font-semibold text-white"
                >
                  📞 010-3782-5418로 전화
                </a>
              </div>
            ) : (
              <div className="flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="메시지를 입력하세요…"
                  rows={1}
                  maxLength={2000}
                  disabled={streaming}
                  className="flex-1 resize-none rounded-xl border-2 border-gray-200 bg-white px-3 py-2.5 text-base text-gray-900 placeholder:text-gray-500 transition focus:border-indigo-500 focus:outline-none disabled:bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => sendMessage(input)}
                  disabled={streaming || !input.trim()}
                  aria-label="전송"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {streaming ? (
                    <svg
                      className="h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        opacity="0.25"
                      />
                      <path
                        d="M22 12a10 10 0 0 1-10 10"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <line x1="12" y1="19" x2="12" y2="5" />
                      <polyline points="5 12 12 5 19 12" />
                    </svg>
                  )}
                </button>
              </div>
            )}

            <div className="mt-2.5 flex items-center justify-between border-t border-gray-100 pt-2.5 text-[11px] text-gray-500">
              <span>
                {userTurns} / 20 메시지
                {streaming && <span className="ml-2 text-indigo-600">답변 작성 중…</span>}
              </span>
              <a
                href="tel:01037825418"
                className="font-semibold text-indigo-600 hover:underline"
              >
                📞 운영자 직통
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ───── 마크다운 (경량) ─────────────────────────────────────────────────────

type Block =
  | { type: 'para'; text: string }
  | { type: 'list'; items: string[] }

function parseBlocks(text: string): Block[] {
  const lines = text.split('\n')
  const blocks: Block[] = []
  let paraBuf: string[] = []
  let listBuf: string[] = []

  const flushPara = () => {
    if (paraBuf.length > 0) {
      blocks.push({ type: 'para', text: paraBuf.join('\n') })
      paraBuf = []
    }
  }
  const flushList = () => {
    if (listBuf.length > 0) {
      blocks.push({ type: 'list', items: [...listBuf] })
      listBuf = []
    }
  }

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('- ')) {
      flushPara()
      listBuf.push(trimmed.slice(2))
    } else {
      flushList()
      paraBuf.push(line)
    }
  }
  flushPara()
  flushList()
  return blocks
}

function renderInline(text: string, keyBase: number): ReactNode {
  const parts: ReactNode[] = []
  const re = /\*\*([^*]+)\*\*/g
  let lastIdx = 0
  let match: RegExpExecArray | null
  let k = 0
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(
        <span key={`${keyBase}-t-${k++}`}>{text.slice(lastIdx, match.index)}</span>,
      )
    }
    parts.push(
      <strong key={`${keyBase}-b-${k++}`} className="font-semibold">
        {match[1]}
      </strong>,
    )
    lastIdx = match.index + match[0].length
  }
  if (lastIdx < text.length) {
    parts.push(<span key={`${keyBase}-t-${k++}`}>{text.slice(lastIdx)}</span>)
  }
  return parts.length > 0 ? parts : text
}

function MarkdownText({ text }: { text: string }) {
  const blocks = parseBlocks(text)
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === 'list') {
          return (
            <ul key={i} className="my-1.5 list-disc space-y-1 pl-5">
              {b.items.map((it, j) => (
                <li key={j}>{renderInline(it, j)}</li>
              ))}
            </ul>
          )
        }
        return (
          <p
            key={i}
            className="whitespace-pre-wrap leading-relaxed first:mt-0 last:mb-0 [&+p]:mt-2"
          >
            {renderInline(b.text, i)}
          </p>
        )
      })}
    </>
  )
}

function MessageBubble({
  role,
  children,
}: {
  role: 'user' | 'assistant'
  children: ReactNode
}) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] sm:max-w-[80%] ${
          isUser
            ? 'bg-indigo-600 text-white'
            : 'border border-gray-200 bg-white text-gray-900 shadow-sm'
        }`}
      >
        {children}
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <span
      aria-label="답변 작성 중"
      className="inline-flex items-center gap-1 py-1"
    >
      <span
        className="h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400"
        style={{ animationDelay: '0ms' }}
      />
      <span
        className="h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400"
        style={{ animationDelay: '200ms' }}
      />
      <span
        className="h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400"
        style={{ animationDelay: '400ms' }}
      />
    </span>
  )
}
