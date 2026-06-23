/**
 * Wizard 상태 관리 — useReducer + localStorage + URL ?step= 동기화
 * v2: 질문 6단계 (유형 / 페이지수 / 추가기능(복수) / 디자인톤 / 상호·업종 / 납기) + 연락처.
 *
 * 스키마 변경 시 STORAGE_KEY 버전을 올려 기존 localStorage 무효화.
 */

export const STORAGE_KEY = 'jieuri-wizard-v2'
export const SESSION_KEY = 'jieuri-wizard-session-v2'

export type SiteType = 'company' | 'shop' | 'reservation' | 'landing' | 'app' | 'other'
export type PageCount = 'small' | 'medium' | 'large' | 'unsure'
export type DesignTone = 'modern' | 'luxury' | 'friendly' | 'auto' | 'other'
export type Timeline = '2w' | '1m' | '2m' | 'flex'
export type Budget = 'lt200' | '200-500' | '500-1000' | '1000+' | 'unsure'

/** 추가 기능 복수선택 — 온라인 결제 / 관리자 페이지 / AI 챗봇. 셋 다 false = 필요없음 */
export type Features = {
  payment?: boolean
  admin?: boolean
  aiChat?: boolean
}

export type WizardAnswers = {
  siteType?: SiteType
  siteTypeEtc?: string // 유형 '기타' 직접입력
  pageCount?: PageCount
  features?: Features
  designTone?: DesignTone
  designToneEtc?: string // 디자인 톤 '기타' 직접입력
  businessName?: string
  industry?: string
  tagline?: string
  timeline?: Timeline
  /** Hero 자유 입력 원본 — 매칭 여부와 무관하게 보존 */
  rawIntent?: string
}

export type Contact = {
  name?: string
  phone?: string
  email?: string
  kakao?: string
  /** 예산 — 참고용(가격 계산에 미반영) */
  budget?: Budget
  consent?: boolean
}

export type StepId = 'intro' | 1 | 2 | 3 | 4 | 5 | 6 | 'contact'

export const QUESTION_STEPS: ReadonlyArray<1 | 2 | 3 | 4 | 5 | 6> = [
  1, 2, 3, 4, 5, 6,
]
export const TOTAL_QUESTIONS = QUESTION_STEPS.length

export type WizardState = {
  currentStep: StepId
  answers: WizardAnswers
  contact: Contact
  sessionId: string
  startedAt: string
}

export type WizardAction =
  | { type: 'LOAD'; state: WizardState }
  | { type: 'ANSWER'; patch: Partial<WizardAnswers> }
  | { type: 'CONTACT'; patch: Partial<Contact> }
  | { type: 'GOTO'; step: StepId }
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'RESET' }

const STEP_ORDER: StepId[] = ['intro', 1, 2, 3, 4, 5, 6, 'contact']

export function nextStep(current: StepId): StepId {
  const i = STEP_ORDER.indexOf(current)
  if (i === -1 || i === STEP_ORDER.length - 1) return current
  return STEP_ORDER[i + 1]
}

export function prevStep(current: StepId): StepId {
  const i = STEP_ORDER.indexOf(current)
  if (i <= 0) return 'intro'
  return STEP_ORDER[i - 1]
}

/** "3/6" 같은 진행률 정보 (intro/contact는 null) */
export function progressOf(
  step: StepId,
): { index: number; total: number } | null {
  if (step === 'intro' || step === 'contact') return null
  return { index: step, total: TOTAL_QUESTIONS }
}

export function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'LOAD':
      return action.state
    case 'ANSWER':
      return { ...state, answers: { ...state.answers, ...action.patch } }
    case 'CONTACT':
      return { ...state, contact: { ...state.contact, ...action.patch } }
    case 'GOTO':
      return { ...state, currentStep: action.step }
    case 'NEXT':
      return { ...state, currentStep: nextStep(state.currentStep) }
    case 'PREV':
      return { ...state, currentStep: prevStep(state.currentStep) }
    case 'RESET':
      return createInitialState()
  }
}

export function createInitialState(rawIntent?: string): WizardState {
  return {
    currentStep: 'intro',
    answers: rawIntent ? { rawIntent } : {},
    contact: {},
    sessionId: createSessionId(),
    startedAt: new Date().toISOString(),
  }
}

function createSessionId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

/** URL <-> step 변환. invalid 값은 'intro'로. */
export function parseStepParam(raw: string | null): StepId {
  if (!raw) return 'intro'
  if (raw === 'intro') return 'intro'
  if (raw === 'contact') return 'contact'
  const n = Number(raw)
  if (Number.isInteger(n) && n >= 1 && n <= 6)
    return n as 1 | 2 | 3 | 4 | 5 | 6
  return 'intro'
}

export function stepToParam(step: StepId): string {
  return typeof step === 'number' ? String(step) : step
}

/** localStorage 직렬화 — 서버에서 호출하면 안 됨 */
export function loadFromStorage(): WizardState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as WizardState
    if (!parsed || typeof parsed !== 'object' || !parsed.sessionId) return null
    return parsed
  } catch {
    return null
  }
}

export function saveToStorage(state: WizardState): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // 용량 초과·시크릿 모드 등에서 무시
  }
}

export function clearStorage(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
