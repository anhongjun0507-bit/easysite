/**
 * 이탈 분석 이벤트 전송 — /api/wizard-events
 * - 일반 이벤트: fetch keepalive
 * - 페이지 이탈: navigator.sendBeacon (브라우저가 보장 전송)
 */

export type WizardEventType =
  | 'wizard_started'
  | 'step_started'
  | 'step_completed'
  | 'step_hesitating'
  | 'wizard_abandoned'
  | 'wizard_completed'

export type WizardEventPayload = {
  step?: string | number
  answer?: unknown
  dwellMs?: number
  [k: string]: unknown
}

export type WizardEventBody = {
  sessionId: string
  eventType: WizardEventType
  payload?: WizardEventPayload
  /** wizard_completed 시점에 client가 받은 lead_id (선택) */
  leadId?: string
}

const ENDPOINT = '/api/wizard-events'

export function logEvent(body: WizardEventBody): void {
  if (typeof window === 'undefined') return
  try {
    const json = JSON.stringify(body)
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: json,
      keepalive: true,
    }).catch(() => {
      // 분석 이벤트는 실패해도 사용자에게 영향 없음
    })
  } catch {
    // ignore
  }
}

/** beforeunload·visibilitychange 시 사용 — Beacon으로 보장 전송 */
export function beaconEvent(body: WizardEventBody): void {
  if (typeof window === 'undefined') return
  try {
    const json = JSON.stringify(body)
    if (
      'sendBeacon' in navigator &&
      typeof navigator.sendBeacon === 'function'
    ) {
      const blob = new Blob([json], { type: 'application/json' })
      navigator.sendBeacon(ENDPOINT, blob)
      return
    }
    // sendBeacon 미지원 fallback
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: json,
      keepalive: true,
    }).catch(() => {})
  } catch {
    // ignore
  }
}
