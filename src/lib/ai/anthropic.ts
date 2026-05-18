/**
 * Anthropic Messages API 호출 — SDK 없이 fetch만 사용.
 * 모델: claude-sonnet-4-6 (현재 최신 Sonnet, 빠르고 충분).
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-6'
const ANTHROPIC_VERSION = '2023-06-01'

export type CallOptions = {
  system: string
  userMessage: string
  maxTokens?: number
  /** AbortSignal — server 측 timeout 제어용 */
  signal?: AbortSignal
}

export type AnthropicResult = {
  text: string
  inputTokens: number
  outputTokens: number
}

export async function callAnthropic(opts: CallOptions): Promise<AnthropicResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY missing')

  const res = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    signal: opts.signal,
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: opts.maxTokens ?? 2048,
      system: opts.system,
      messages: [{ role: 'user', content: opts.userMessage }],
    }),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`Anthropic API ${res.status}: ${errText.slice(0, 300)}`)
  }

  const data = (await res.json()) as {
    content: Array<{ type: string; text?: string }>
    usage: { input_tokens: number; output_tokens: number }
  }

  const text = (data.content ?? [])
    .filter((c) => c.type === 'text' && c.text)
    .map((c) => c.text as string)
    .join('')
    .trim()

  if (!text) throw new Error('Anthropic returned empty text')

  return {
    text,
    inputTokens: data.usage?.input_tokens ?? 0,
    outputTokens: data.usage?.output_tokens ?? 0,
  }
}

/**
 * 응답 텍스트에서 첫 { 부터 마지막 } 까지 추출 후 JSON 파싱.
 * 모델이 가끔 ```json … ``` wrap 하거나 앞뒤에 인사를 붙일 때 대비.
 */
export function extractJson<T>(raw: string): T {
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start === -1 || end === -1 || end < start) {
    throw new Error('No JSON object found in response')
  }
  const slice = raw.slice(start, end + 1)
  return JSON.parse(slice) as T
}

// ───── Streaming ─────────────────────────────────────────────────────────────

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type StreamOptions = {
  system: string
  messages: ChatMessage[]
  maxTokens?: number
  signal?: AbortSignal
}

export type StreamEvent =
  | { type: 'text'; delta: string }
  | { type: 'usage'; inputTokens: number; outputTokens: number }

/**
 * Anthropic Messages API streaming — SSE 응답을 파싱해 텍스트 토큰을 yield.
 * 토큰 단위로 부드럽게 도착, /api/chat·CLI 시뮬레이터 양쪽에서 사용.
 */
export async function* callAnthropicStream(
  opts: StreamOptions,
): AsyncGenerator<StreamEvent> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY missing')

  const res = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    signal: opts.signal,
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
      'content-type': 'application/json',
      accept: 'text/event-stream',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: opts.maxTokens ?? 1024,
      system: opts.system,
      messages: opts.messages,
      stream: true,
    }),
  })

  if (!res.ok || !res.body) {
    const errText = await res.text().catch(() => '')
    throw new Error(`Anthropic stream ${res.status}: ${errText.slice(0, 300)}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let inputTokens = 0
  let outputTokens = 0

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      // SSE 라인 단위 파싱 — 마지막 줄은 incomplete일 수 있어 buffer에 남김
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const raw = line.slice(6).trim()
        if (!raw || raw === '[DONE]') continue
        let event: {
          type: string
          delta?: { type?: string; text?: string }
          message?: { usage?: { input_tokens?: number; output_tokens?: number } }
          usage?: { input_tokens?: number; output_tokens?: number }
        }
        try {
          event = JSON.parse(raw)
        } catch {
          continue
        }
        if (
          event.type === 'content_block_delta' &&
          event.delta?.type === 'text_delta' &&
          event.delta.text
        ) {
          yield { type: 'text', delta: event.delta.text }
        } else if (event.type === 'message_start') {
          inputTokens = event.message?.usage?.input_tokens ?? inputTokens
        } else if (event.type === 'message_delta') {
          outputTokens = event.usage?.output_tokens ?? outputTokens
        }
      }
    }
  } finally {
    reader.releaseLock()
  }

  yield { type: 'usage', inputTokens, outputTokens }
}
