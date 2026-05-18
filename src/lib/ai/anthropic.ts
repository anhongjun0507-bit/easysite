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
