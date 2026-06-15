'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { submitWizard } from './actions'
import { ProgressBar } from './components/ProgressBar'
import { ContactStep } from './steps/Contact'
import { Intro } from './steps/Intro'
import { Step1SiteType } from './steps/Step1SiteType'
import { Step2PageCount } from './steps/Step2PageCount'
import { Step3Features } from './steps/Step3Features'
import { Step4DesignTone } from './steps/Step4DesignTone'
import { Step5Business } from './steps/Step5Business'
import { Step6Timeline } from './steps/Step6Timeline'
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
      if (initialStepFromUrl !== 'intro') {
        restored.currentStep = initialStepFromUrl
      }
      dispatch({ type: 'LOAD', state: restored })
    } else {
      const fresh = createInitialState(initialIntent || undefined)
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
        payload: { step: stateRef.current.currentStep, dwellMs: HESITATING_MS },
      })
    }, HESITATING_MS)
    return () => window.clearTimeout(timer)
  }, [state.currentStep, state.sessionId, ready])

  // ───── 페이지 이탈 beacon ─────
  useEffect(() => {
    const onLeave = () => {
      if (completedRef.current) return
      const s = stateRef.current
      if (s.currentStep === 'intro') return
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
  /** 답변 기록 + 다음 단계 (single/multi/입력 공통) */
  const advance = useCallback((patch: Partial<WizardAnswers>) => {
    const sessionId = stateRef.current.sessionId
    const currentStep = stateRef.current.currentStep
    dispatch({ type: 'ANSWER', patch })
    logEvent({
      sessionId,
      eventType: 'step_completed',
      payload: { step: currentStep, answer: patch },
    })
    dispatch({ type: 'NEXT' })
  }, [])

  const goBack = useCallback(() => {
    const prev = toPrev(stateRef.current.currentStep)
    dispatch({ type: 'GOTO', step: prev })
  }, [])

  const onStart = useCallback(() => {
    logEvent({
      sessionId: stateRef.current.sessionId,
      eventType: 'wizard_started',
    })
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
        budget: s.contact.budget,
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
        {state.currentStep === 1 && <Step1SiteType state={state} onAnswer={advance} />}
        {state.currentStep === 2 && <Step2PageCount state={state} onAnswer={advance} />}
        {state.currentStep === 3 && <Step3Features state={state} onAnswer={advance} />}
        {state.currentStep === 4 && <Step4DesignTone state={state} onAnswer={advance} />}
        {state.currentStep === 5 && <Step5Business state={state} onAnswer={advance} />}
        {state.currentStep === 6 && <Step6Timeline state={state} onAnswer={advance} />}
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
