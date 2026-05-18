/**
 * 챗봇 사용자 메시지에서 의향·연락처 감지.
 * 시스템 프롬프트의 "명확한 의향 키워드"와 정렬되어 있어야 합니다.
 */

const INTENT_KEYWORDS = [
  '계약하고 싶',
  '계약할게',
  '진행할게',
  '진행하고 싶',
  '시작할게',
  '시작하고 싶',
  '이걸로 갈',
  '이대로 해',
  '이대로 가',
  '결제할게',
  '오케이',
  '오케이요',
  'ok 합니다',
] as const

// 전화번호 — 010-1234-5678 / 01012345678 / 010 1234 5678
const PHONE_RE = /(?<![\d])((?:0\d{1,2})[-\s.]?\d{3,4}[-\s.]?\d{4})(?![\d])/

// 이메일
const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/

export type IntentDetection = {
  hasIntent: boolean
  intentMatch?: string
  hasContact: boolean
  phoneMatch?: string
  emailMatch?: string
}

export function detectIntent(message: string): IntentDetection {
  const text = (message ?? '').trim()
  const intentMatch = INTENT_KEYWORDS.find((k) => text.includes(k))
  const phone = text.match(PHONE_RE)?.[1]
  const email = text.match(EMAIL_RE)?.[0]
  return {
    hasIntent: Boolean(intentMatch),
    intentMatch,
    hasContact: Boolean(phone || email),
    phoneMatch: phone,
    emailMatch: email,
  }
}

export type NotifyDecision = {
  notify: boolean
  reasons: string[]
}

/**
 * 알림 트리거 — OR 조건. 이미 알림 발송된 leadId면 skip.
 */
export function shouldNotify(opts: {
  userTurnsAfterThis: number
  detection: IntentDetection
  alreadyNotified: boolean
}): NotifyDecision {
  if (opts.alreadyNotified) return { notify: false, reasons: [] }
  const reasons: string[] = []
  if (opts.detection.hasIntent) {
    reasons.push(`의향 표현 — "${opts.detection.intentMatch}"`)
  }
  if (opts.detection.hasContact) {
    const parts: string[] = []
    if (opts.detection.phoneMatch) parts.push(opts.detection.phoneMatch)
    if (opts.detection.emailMatch) parts.push(opts.detection.emailMatch)
    reasons.push(`연락처 입력 — ${parts.join(', ')}`)
  }
  if (opts.userTurnsAfterThis >= 5) {
    reasons.push(`${opts.userTurnsAfterThis}턴 대화 도달`)
  }
  return { notify: reasons.length > 0, reasons }
}
