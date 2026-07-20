'use client'

import { ReactLenis, type LenisRef } from 'lenis/react'
import dynamic from 'next/dynamic'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { gsap, ScrollTrigger } from '@/lib/letters/gsap'
import { detectPerf, type PerfProfile } from '@/lib/letters/perf'
import { scrollState } from '@/lib/letters/scroll'
import { disposeAudio, setSound } from '@/lib/letters/audio'

// three.js + postprocessing 은 이 페이지에서 가장 무거운 짐이다.
// 첫 페인트(제목)를 막지 않도록 별도 청크로 떼어 내고, 환경 감지가 끝난 뒤에 불러온다.
const Stage = dynamic(() => import('./canvas/Stage').then((m) => m.Stage), { ssr: false })

/**
 * 이 페이지의 엔진 — 스크롤·모션·WebGL·사운드를 한 군데서 켜고 끈다.
 *
 *  · RAF 는 gsap.ticker 하나뿐이고 Lenis 가 거기에 얹힌다(경쟁하는 루프 금지)
 *  · 스크롤 진행도는 ScrollTrigger 한 개가 scrollState 에 써 넣고, HTML·WebGL 이 같은 값을 읽는다
 *  · prefers-reduced-motion 이면 Lenis·WebGL 모두 빠지고 CSS 페이드만 남는다
 */

const LENIS_OPTIONS = {
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  syncTouch: true, // 모바일도 같은 관성으로 — 편지를 넘기는 호흡을 맞춘다
  syncTouchLerp: 0.09,
  autoRaf: false, // RAF 는 gsap.ticker 로 단일화
} as const

type LettersEnv = {
  /** 환경 감지가 끝났는지 — 씬은 이 값이 true 가 된 뒤에만 애니메이션을 건다 */
  ready: boolean
  reduced: boolean
  perf: PerfProfile | null
  /** null = 아직 고르지 않음(인트로에서 물어본다) */
  sound: boolean | null
  chooseSound: (on: boolean) => void
}

const EnvContext = createContext<LettersEnv>({
  ready: false,
  reduced: false,
  perf: null,
  sound: null,
  chooseSound: () => {},
})

export function useLettersEnv() {
  return useContext(EnvContext)
}

export function LettersShell({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)
  const [ready, setReady] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [perf, setPerf] = useState<PerfProfile | null>(null)
  const [sound, setSoundState] = useState<boolean | null>(null)
  const [stageOn, setStageOn] = useState(false)

  // 1) 환경 감지 — SSR 결과와 다르므로 마운트 후에만
  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    setPerf(detectPerf())
    setReady(true)
  }, [])

  // 2) Lenis 를 gsap.ticker 에 얹는다
  useEffect(() => {
    if (!ready || reduced) return
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    const lenis = lenisRef.current?.lenis
    const sync = () => ScrollTrigger.update()
    lenis?.on('scroll', sync)
    // 스크린샷·디버그용 노출(무해) — 사이트 전역 provider 와 같은 관행
    ;(window as unknown as { __lenis?: unknown }).__lenis = lenis
    return () => {
      gsap.ticker.remove(update)
      gsap.ticker.lagSmoothing(500, 33)
      lenis?.off('scroll', sync)
    }
  }, [ready, reduced])

  // 3) 문서 전체 진행도 0→1 — 이 페이지에서 이 값을 만드는 곳은 여기 하나뿐
  useEffect(() => {
    if (!ready) return
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        scrollState.progress = self.progress
        scrollState.velocity = self.getVelocity() / 4000
      },
    })
    return () => st.kill()
  }, [ready])

  // 4) 포인터 — 스포트라이트용 (-1 → 1)
  useEffect(() => {
    if (!ready || reduced) return
    const onMove = (e: PointerEvent) => {
      scrollState.pointerX = (e.clientX / window.innerWidth) * 2 - 1
      scrollState.pointerY = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [ready, reduced])

  // 5) 폰트·이미지가 들어오면 레이아웃 높이가 바뀐다 → 트리거 위치 한 번 재계산
  useEffect(() => {
    let done = false
    const refresh = () => {
      if (done) return
      done = true
      ScrollTrigger.refresh()
    }
    const timer = window.setTimeout(refresh, 2500) // 최후 보루
    Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise<void>((resolve) => {
        if (document.readyState === 'complete') resolve()
        else window.addEventListener('load', () => resolve(), { once: true })
      }),
    ]).then(refresh)
    return () => window.clearTimeout(timer)
  }, [])

  // 6) WebGL 은 첫 화면이 다 그려진 뒤에 붙인다.
  //    three.js 파싱이 인트로 타이포와 같은 프레임을 다투면 첫인상이 먼저 무너진다.
  useEffect(() => {
    if (!ready || reduced || !perf || perf.tier === 'none') return
    let cancelled = false
    const arm = () => {
      const idle =
        window.requestIdleCallback?.(() => !cancelled && setStageOn(true), { timeout: 1500 }) ??
        window.setTimeout(() => !cancelled && setStageOn(true), 400)
      return idle
    }
    let handle: number | undefined
    if (document.readyState === 'complete') handle = arm()
    else window.addEventListener('load', () => (handle = arm()), { once: true })
    return () => {
      cancelled = true
      if (handle !== undefined) window.cancelIdleCallback?.(handle)
    }
  }, [ready, reduced, perf])

  // 7) 페이지를 떠나면 오디오 그래프를 닫는다
  useEffect(() => () => disposeAudio(), [])

  const chooseSound = useCallback((on: boolean) => {
    setSoundState(on)
    void setSound(on)
  }, [])

  const env = useMemo<LettersEnv>(
    () => ({ ready, reduced, perf, sound, chooseSound }),
    [ready, reduced, perf, sound, chooseSound],
  )

  const body = (
    <EnvContext.Provider value={env}>
      {stageOn && perf && <Stage perf={perf} />}
      <div className="lt-grain" aria-hidden />
      <div className="lt-vignette" aria-hidden />
      {children}
    </EnvContext.Provider>
  )

  if (!ready || reduced) return body

  return (
    <ReactLenis root options={LENIS_OPTIONS} ref={lenisRef}>
      {body}
    </ReactLenis>
  )
}
