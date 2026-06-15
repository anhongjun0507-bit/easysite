'use client'

import { ArrowRight, CloudCheck, MessageCircle, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Props = {
  onStart: () => void
}

export function Intro({ onStart }: Props) {
  return (
    <div className="bg-hero-mesh mx-auto w-full max-w-2xl px-4 pb-10 pt-8 sm:px-6 sm:pt-16">
      <div className="text-center">
        <p className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold tracking-[0.12em] text-indigo-700">
          <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-indigo-500" />
          </span>
          1분 견적
        </p>
        <h1
          className="mt-5 font-extrabold text-gray-900"
          style={{
            fontSize: 'clamp(28px, 6vw, 42px)',
            lineHeight: 1.22,
            letterSpacing: '-0.02em',
          }}
        >
          몇 가지만 여쭤볼게요.
          <br />
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            1분이면 끝나요.
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-gray-700 sm:text-lg">
          이름·전화는 <strong className="font-semibold text-gray-900">맨 마지막</strong>
          에 받아요. 먼저 사이트 이야기부터 편하게요.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-md space-y-3 sm:mt-12">
        <Bullet icon={Sparkles} delay="animate-ease-up-d1">
          잘 모르겠으면{' '}
          <strong className="font-semibold text-gray-900">&ldquo;잘 모르겠어요&rdquo;</strong>
          를 골라주세요. 부담&nbsp;X
        </Bullet>
        <Bullet icon={CloudCheck} delay="animate-ease-up-d2">
          답변은 자동 저장 — 중간에 끊겨도 이어서 가능
        </Bullet>
        <Bullet icon={MessageCircle} delay="animate-ease-up-d3">
          영업일 24시간 안에 카톡으로 견적 + 미리보기
        </Bullet>
      </div>

      <div className="animate-ease-up animate-ease-up-d4 mx-auto mt-10 max-w-md sm:mt-12">
        <button
          type="button"
          onClick={onStart}
          className="cta-glow group inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-base font-semibold text-white transition hover:bg-indigo-700 sm:text-[17px]"
        >
          <span>시작하기</span>
          <ArrowRight
            aria-hidden="true"
            className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5"
            strokeWidth={2}
          />
        </button>
        <p className="mt-3 text-center text-sm text-gray-600">
          전화가 편하시면 010-3782-5418로 바로 주세요
        </p>
      </div>
    </div>
  )
}

function Bullet({
  icon: Icon,
  delay,
  children,
}: {
  icon: LucideIcon
  delay?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={`animate-ease-up ${delay ?? ''} flex items-center gap-3.5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm`}
    >
      <span
        aria-hidden="true"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-100 text-indigo-600 ring-1 ring-inset ring-indigo-100"
      >
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>
      <p className="flex-1 text-sm leading-relaxed text-gray-700 sm:text-[15px]">
        {children}
      </p>
    </div>
  )
}
