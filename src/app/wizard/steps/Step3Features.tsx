'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { StepShell } from '../components/StepShell'
import { StickyFooter } from '../components/StickyFooter'
import { Tooltip } from '../components/Tooltip'
import type { Features, WizardAnswers, WizardState } from '../lib/state'

type Props = {
  state: WizardState
  onAnswer: (patch: Partial<WizardAnswers>) => void
}

const FEATURE_OPTIONS: Array<{
  key: keyof Features
  title: string
  desc: string
  tip: string
}> = [
  {
    key: 'payment',
    title: '온라인 결제',
    desc: '사이트에서 카드·간편결제 받기',
    tip: '토스페이먼츠 같은 결제 모듈을 연결하는 작업이에요. 카드 수수료 약 3% 별도.',
  },
  {
    key: 'admin',
    title: '관리자 페이지',
    desc: '글·상품·예약을 사장님이 직접 관리',
    tip: '사장님이 직접 글·사진·상품을 올리고 고치는 관리 화면이에요.',
  },
  {
    key: 'aiChat',
    title: 'AI 챗봇·자동화',
    desc: '24시간 문의·예약 자동 응대',
    tip: '사이트에 AI를 붙여 손님 문의·예약을 자동으로 답하는 기능. 월 사용료 별도.',
  },
]

export function Step3Features({ state, onAnswer }: Props) {
  const init = state.answers.features ?? {}
  const [sel, setSel] = useState<Features>({
    payment: !!init.payment,
    admin: !!init.admin,
    aiChat: !!init.aiChat,
  })
  const none = !sel.payment && !sel.admin && !sel.aiChat

  const toggle = (k: keyof Features) => setSel((s) => ({ ...s, [k]: !s[k] }))

  return (
    <>
      <StepShell
        question="추가 기능, 필요한 거 다 골라주세요"
        helper={<>여러 개 골라도 돼요. 없으면 아래 “필요 없어요”를 누르세요.</>}
      >
        <div className="grid gap-2.5 sm:gap-3">
          {FEATURE_OPTIONS.map((f) => {
            const on = !!sel[f.key]
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => toggle(f.key)}
                aria-pressed={on}
                className={`group flex w-full items-start gap-3 rounded-xl border-2 px-4 py-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 sm:gap-4 sm:px-5 sm:py-5 ${
                  on
                    ? 'border-indigo-600 bg-indigo-50/80 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition ${
                    on ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300 bg-white'
                  }`}
                >
                  {on && <Check className="h-4 w-4" strokeWidth={3} />}
                </span>
                <span className="flex-1">
                  <span className="flex flex-wrap items-center gap-x-2">
                    <span
                      className={`text-base font-semibold sm:text-lg ${on ? 'text-indigo-900' : 'text-gray-900'}`}
                    >
                      {f.title}
                    </span>
                    <span onClick={(e) => e.stopPropagation()}>
                      <Tooltip content={f.tip} />
                    </span>
                  </span>
                  <span
                    className={`mt-1 block text-sm leading-relaxed ${on ? 'text-indigo-800/80' : 'text-gray-600'}`}
                  >
                    {f.desc}
                  </span>
                </span>
              </button>
            )
          })}

          <button
            type="button"
            onClick={() => setSel({ payment: false, admin: false, aiChat: false })}
            aria-pressed={none}
            className={`inline-flex w-full items-center rounded-xl border-2 px-4 py-4 text-left text-base font-semibold transition sm:px-5 sm:py-5 ${
              none
                ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 shadow-sm'
                : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100'
            }`}
          >
            필요 없어요 — 기본 사이트만 깔끔하게
          </button>
        </div>
      </StepShell>
      <StickyFooter>
        <button
          type="button"
          onClick={() =>
            onAnswer({
              features: { payment: !!sel.payment, admin: !!sel.admin, aiChat: !!sel.aiChat },
            })
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
