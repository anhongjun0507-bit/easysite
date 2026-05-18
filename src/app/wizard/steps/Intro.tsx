'use client'

type Props = {
  onStart: () => void
}

export function Intro({ onStart }: Props) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-10 pt-8 sm:px-6 sm:pt-16">
      <div className="text-center">
        <p className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold tracking-[0.12em] text-indigo-700">
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
          <span className="text-indigo-600">1분이면 끝나요.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-gray-700 sm:text-lg">
          이름·전화는 <strong className="font-semibold text-gray-900">맨 마지막</strong>
          에 받아요. 먼저 사이트 이야기부터 편하게요.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-md space-y-3 sm:mt-12">
        <Bullet icon="✦">
          잘 모르겠으면{' '}
          <strong className="font-semibold">&ldquo;잘 모르겠어요&rdquo;</strong>
          를 골라주세요. 부담 X
        </Bullet>
        <Bullet icon="⏱">
          답변은 자동 저장 — 중간에 끊겨도 이어서 가능
        </Bullet>
        <Bullet icon="📩">영업일 24시간 안에 카톡으로 견적 + 미리보기</Bullet>
      </div>

      <div className="mx-auto mt-10 max-w-md sm:mt-12">
        <button
          type="button"
          onClick={onStart}
          className="cta-glow inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-base font-semibold text-white transition hover:bg-indigo-700 sm:text-[17px]"
        >
          <span>시작하기</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="13 6 19 12 13 18" />
          </svg>
        </button>
        <p className="mt-3 text-center text-sm text-gray-600">
          전화가 편하시면 010-3782-5418로 바로 주세요
        </p>
      </div>
    </div>
  )
}

function Bullet({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
      <span
        aria-hidden="true"
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-base"
      >
        {icon}
      </span>
      <p className="flex-1 pt-1 text-sm leading-relaxed text-gray-700 sm:text-[15px]">
        {children}
      </p>
    </div>
  )
}
