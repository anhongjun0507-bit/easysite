'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { submitWizard } from './actions'
import { ProgressBar } from './components/ProgressBar'
import { ContactStep } from './steps/Contact'
import { Intro } from './steps/Intro'
import { Step1SiteType } from './steps/Step1SiteType'
import { Step2Industry } from './steps/Step2Industry'
import { Step3Business } from './steps/Step3Business'
import { Step4PageCount } from './steps/Step4PageCount'
import { Step5Payment } from './steps/Step5Payment'
import { Step6AIChat } from './steps/Step6AIChat'
import { Step7DesignTone } from './steps/Step7DesignTone'
import { Step8Timeline } from './steps/Step8Timeline'
import { beaconEvent, logEvent } from './lib/events'
import { mapIntent } from './lib/intent-map'
import {
  type Contact,
  type WizardAnswers,
  type WizardState,
  type StepId,
  clearStorage,
  createInitialState,
  loadFromStorage,
  parseStepParam,
  prevStep as toPrev,
  progressOf,
  reducer,
  saveToStorage,
  stepToParam,
} from './lib/state'

const AUTO_ADVANCE_MS = 700 // 사용자 디테일 #1 — 600~800 사이
const HESITATING_MS = 30_000
const STALE_THRESHOLD_MS = 24 * 60 * 60 * 1000 // 24h

type Props = {
  initialIntent: string
  initialStepFromUrl: StepId
}

export function WizardShell({ initialIntent, initialStepFromUrl }: Props) {
  const router = useRouter()
  const [state, dispatch] = useReducer(
    reducer,
    initialIntent || undefined,
    createInitialState,
  )
  const [ready, setReady] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const completedRef = useRef(false)
  const stateRef = useRef(state)
  stateRef.current = state

  // ───── Mount: localStorage 복원 + intent 매핑 + URL step 반영 ─────
  useEffect(() => {
    const stored = loadFromStorage()
    const isFresh =
      stored &&
      Date.now() - new Date(stored.startedAt).getTime() < STALE_THRESHOLD_MS

    if (isFresh && stored) {
      const restored: WizardState = { ...stored }
      // URL이 명시한 step이 있고 intro가 아니면 그쪽으로 점프
      if (initialStepFromUrl !== 'intro') {
        restored.currentStep = initialStepFromUrl
      }
      dispatch({ type: 'LOAD', state: restored })
    } else {
      const fresh = createInitialState(initialIntent || undefined)
      // Hero intent 키워드 매칭 → siteType 자동 + step 2부터
      const mapped = mapIntent(initialIntent)
      if (mapped) {
        fresh.answers.siteType = mapped
        fresh.currentStep = 2
      }
      if (initialStepFromUrl !== 'intro') {
        fresh.currentStep = initialStepFromUrl
      }
      dispatch({ type: 'LOAD', state: fresh })
    }
    setReady(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ───── state 변경: localStorage 저장 ─────
  useEffect(() => {
    if (!ready) return
    saveToStorage(state)
  }, [state, ready])

  // ───── state.currentStep 변경: URL ?step 동기화 + scroll top ─────
  useEffect(() => {
    if (!ready) return
    const params = new URLSearchParams(window.location.search)
    const currentUrlStep = params.get('step')
    const nextUrlStep = stepToParam(state.currentStep)
    if (currentUrlStep !== nextUrlStep) {
      params.set('step', nextUrlStep)
      const url = `${window.location.pathname}?${params.toString()}`
      window.history.pushState(null, '', url)
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [state.currentStep, ready])

  // ───── 뒤로가기/앞으로가기 (popstate) ─────
  useEffect(() => {
    if (!ready) return
    const onPop = () => {
      const params = new URLSearchParams(window.location.search)
      const target = parseStepParam(params.get('step'))
      dispatch({ type: 'GOTO', step: target })
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [ready])

  // ───── step_started 이벤트 + hesitating 타이머 ─────
  useEffect(() => {
    if (!ready) return
    if (state.currentStep === 'intro') return
    logEvent({
      sessionId: state.sessionId,
      eventType: 'step_started',
      payload: { step: state.currentStep },
    })
    const timer = window.setTimeout(() => {
      logEvent({
        sessionId: stateRef.current.sessionId,
        eventType: 'step_hesitating',
        payload: {
          step: stateRef.current.currentStep,
          dwellMs: HESITATING_MS,
        },
      })
    }, HESITATING_MS)
    return () => window.clearTimeout(timer)
  }, [state.currentStep, state.sessionId, ready])

  // ───── 페이지 이탈 beacon (mount 시 한 번만 등록) ─────
  useEffect(() => {
    const onLeave = () => {
      if (completedRef.current) return
      const s = stateRef.current
      if (s.currentStep === 'intro') return // intro에서 나가는 건 ignore
      beaconEvent({
        sessionId: s.sessionId,
        eventType: 'wizard_abandoned',
        payload: { step: s.currentStep },
      })
    }
    const onVis = () => {
      if (document.visibilityState === 'hidden') onLeave()
    }
    window.addEventListener('beforeunload', onLeave)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.removeEventListener('beforeunload', onLeave)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  // ───── 액션 헬퍼 ─────
  const advance = useCallback(
    (patch: Partial<WizardAnswers> | null) => {
      const sessionId = stateRef.current.sessionId
      const currentStep = stateRef.current.currentStep
      if (patch) dispatch({ type: 'ANSWER', patch })
      logEvent({
        sessionId,
        eventType: 'step_completed',
        payload: { step: currentStep, answer: patch ?? null },
      })
      dispatch({ type: 'NEXT' })
    },
    [],
  )

  /** single-choice 카드 클릭 → 사용자 시각 피드백 보일 시간 확보 후 다음으로 */
  const answerAndDelayedAdvance = useCallback(
    (patch: Partial<WizardAnswers>) => {
      // 답변은 즉시 반영 (카드 선택 상태 visible)
      dispatch({ type: 'ANSWER', patch })
      const sessionId = stateRef.current.sessionId
      const currentStep = stateRef.current.currentStep
      window.setTimeout(() => {
        logEvent({
          sessionId,
          eventType: 'step_completed',
          payload: { step: currentStep, answer: patch },
        })
        dispatch({ type: 'NEXT' })
      }, AUTO_ADVANCE_MS)
    },
    [],
  )

  const goBack = useCallback(() => {
    const prev = toPrev(stateRef.current.currentStep)
    dispatch({ type: 'GOTO', step: prev })
  }, [])

  const onStart = useCallback(() => {
    logEvent({
      sessionId: stateRef.current.sessionId,
      eventType: 'wizard_started',
    })
    // intent 매핑으로 이미 siteType이 채워져 있으면 step 2부터, 아니면 step 1부터
    const firstStep: StepId = stateRef.current.answers.siteType ? 2 : 1
    dispatch({ type: 'GOTO', step: firstStep })
  }, [])

  const onContactPatch = useCallback((patch: Partial<Contact>) => {
    dispatch({ type: 'CONTACT', patch })
  }, [])

  const onContactSubmit = useCallback(async () => {
    const s = stateRef.current
    setSubmitting(true)
    setServerError(null)
    const res = await submitWizard({
      answers: s.answers,
      contact: {
        name: s.contact.name ?? '',
        phone: s.contact.phone ?? '',
        email: s.contact.email || undefined,
        kakao: s.contact.kakao || undefined,
        consent: s.contact.consent === true ? true : (false as never),
      },
      sessionId: s.sessionId,
    })
    setSubmitting(false)
    if (res.ok) {
      completedRef.current = true
      clearStorage()
      router.push(`/wizard/result?leadId=${res.leadId}`)
    } else {
      setServerError(res.error)
    }
  }, [router])

  // ───── 렌더 ─────
  const progress = progressOf(state.currentStep)
  const canGoBack = state.currentStep !== 'intro'

  if (!ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-gray-500">
        불러오는 중…
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-white">
      {state.currentStep !== 'intro' && (
        <ProgressBar
          index={progress?.index ?? null}
          onBack={goBack}
          canGoBack={canGoBack}
        />
      )}

      <main key={state.currentStep} className="animate-ease-up">
        {state.currentStep === 'intro' && <Intro onStart={onStart} />}

        {state.currentStep === 1 && (
          <Step1SiteType
            state={state}
            onAnswer={(siteType) => answerAndDelayedAdvance({ siteType })}
          />
        )}
        {state.currentStep === 2 && (
          <Step2Industry
            state={state}
            onAnswer={(industry) => advance({ industry })}
            onSkip={() => advance(null)}
          />
        )}
        {state.currentStep === 3 && (
          <Step3Business
            state={state}
            onAnswer={({ businessName, tagline }) =>
              advance({
                businessName: businessName || undefined,
                tagline: tagline || undefined,
              })
            }
            onSkip={() => advance(null)}
          />
        )}
        {state.currentStep === 4 && (
          <Step4PageCount
            state={state}
            onAnswer={(pageCount) => answerAndDelayedAdvance({ pageCount })}
          />
        )}
        {state.currentStep === 5 && (
          <Step5Payment
            state={state}
            onAnswer={(payment) => answerAndDelayedAdvance({ payment })}
          />
        )}
        {state.currentStep === 6 && (
          <Step6AIChat
            state={state}
            onAnswer={(aiChat) =>
              aiChat.needed === true
                ? advance({ aiChat })
                : answerAndDelayedAdvance({ aiChat })
            }
          />
        )}
        {state.currentStep === 7 && (
          <Step7DesignTone
            state={state}
            onAnswer={(designTone) => answerAndDelayedAdvance({ designTone })}
          />
        )}
        {state.currentStep === 8 && (
          <Step8Timeline
            state={state}
            onAnswer={({ timeline, budget }) => advance({ timeline, budget })}
          />
        )}
        {state.currentStep === 'contact' && (
          <ContactStep
            state={state}
            submitting={submitting}
            serverError={serverError}
            onPatch={onContactPatch}
            onSubmit={onContactSubmit}
          />
        )}
      </main>
    </div>
  )
}
