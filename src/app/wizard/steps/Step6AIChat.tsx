'use client'

import { useEffect, useState } from 'react'
import { ChoiceCard } from '../components/ChoiceCard'
import { StepShell } from '../components/StepShell'
import { StickyFooter } from '../components/StickyFooter'
import { Tooltip } from '../components/Tooltip'
import type { AiChatAnswer, WizardState } from '../lib/state'

type Props = {
  state: WizardState
  onAnswer: (value: AiChatAnswer) => void
}

type Mode = 'init' | 'detail'

export function Step6AIChat({ state, onAnswer }: Props) {
  const existing = state.answers.aiChat
  const initialMode: Mode = existing && existing.needed === true ? 'detail' : 'init'
  const [mode, setMode] = useState<Mode>(initialMode)
  const [detail, setDetail] = useState<string>(
    existing && existing.needed === true ? existing.detail ?? '' : '',
  )

  // 단축키 — init mode일 때만
  useEffect(() => {
    if (mode === 'detail') return
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === '1') setMode('detail')
      else if (e.key === '2') onAnswer({ needed: false })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode, onAnswer])

  if (mode === 'detail') {
    return (
      <>
        <StepShell
          question={<>어떤 일을 자동으로 시키고 싶으세요?</>}
          helper={
            <>
              자세히 안 적으셔도 OK — 떠오르는 만큼만요. 예) &ldquo;24시간 메뉴
              문의 자동 응대&rdquo;
            </>
          }
        >
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="예: 손님 문의 자동 응대, 예약 시간 안내, 추천 메뉴 자동 답변"
            maxLength={500}
            rows={4}
            className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-base text-gray-900 shadow-sm placeholder:text-gray-500 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
          <button
            type="button"
            onClick={() => setMode('init')}
            className="mt-4 inline-flex h-11 items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            ← 다시 고르기
          </button>
        </StepShell>
        <StickyFooter>
          <button
            type="button"
            onClick={() =>
              onAnswer({ needed: true, detail: detail.trim() || undefined })
            }
            className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-6 text-base font-semibold text-white transition hover:bg-indigo-700"
            style={{ height: 52 }}
          >
            다음
          </button>
        </StickyFooter>
      </>
    )
  }

  const isYes = existing?.needed === true
  const isNo = existing?.needed === false
  const isUnsure = existing?.needed === 'unsure'

  return (
    <StepShell
      question={
        <>
          AI 챗봇·자동화도 <br className="sm:hidden" />
          넣을까요?
        </>
      }
      helper={
        <>
          <span>고객 문의 자동 응대·예약 안내 같은 거요.</span>
          <span className="ml-2 inline-block">
            <Tooltip
              content={
                <>
                  사이트에 ChatGPT 같은 AI를 붙여서, 손님이 24시간 메뉴·예약·
                  문의를 물어보면 자동으로 답해주는 기능이에요. 월 사용료 별도.
                </>
              }
            />
          </span>
        </>
      }
    >
      <div className="grid gap-2.5 sm:gap-3">
        <ChoiceCard
          selected={isYes}
          prefix={1}
          title="네, 필요해요"
          description="어떤 일을 시키고 싶은지 다음에 물어볼게요"
          onClick={() => setMode('detail')}
        />
        <ChoiceCard
          selected={isNo}
          prefix={2}
          title="아니요, 안 필요해요"
          description="기본 사이트만 깔끔하게 만들어주세요"
          onClick={() => onAnswer({ needed: false })}
        />
        <ChoiceCard
          selected={isUnsure}
          prefix="?"
          title="잘 모르겠어요"
          description="상담 때 같이 정해드릴게요"
          variant="muted"
          onClick={() => onAnswer({ needed: 'unsure' })}
        />
      </div>
    </StepShell>
  )
}
