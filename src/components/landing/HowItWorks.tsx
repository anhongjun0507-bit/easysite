import Link from 'next/link'
import { processSteps } from '@/config/process'

// 각 단계에 대응하는 작은 UI 모킹
function StepMock({ number }: { number: string }) {
  if (number === '01') {
    // 위저드 question 카드
    return (
      <div className="mt-5 rounded-lg border border-gray-200 bg-white p-3 text-left shadow-sm">
        <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
          질문 1 / 5
        </div>
        <div className="mt-1.5 text-xs font-semibold text-gray-900">
          어떤 사이트가 필요하세요?
        </div>
        <div className="mt-2 space-y-1">
          <div className="rounded border border-indigo-300 bg-indigo-50 px-2 py-1 text-[11px] font-semibold text-indigo-700">
            ✓ 학원 홈페이지
          </div>
          <div className="rounded border border-gray-200 px-2 py-1 text-[11px] text-gray-500">
            쇼핑몰
          </div>
        </div>
      </div>
    )
  }
  if (number === '02') {
    // 카톡 알림
    return (
      <div className="mt-5 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
        <div className="flex items-start gap-2.5">
          <div className="h-7 w-7 shrink-0 rounded-full bg-yellow-300" />
          <div className="flex-1 text-left">
            <div className="text-[11px] font-semibold text-gray-900">EasySite</div>
            <div className="mt-0.5 text-[11px] leading-snug text-gray-600">
              사장님 사이트 시안이랑 견적 도착했어요 ✨
            </div>
          </div>
        </div>
      </div>
    )
  }
  if (number === '03') {
    // 코멘트 오버레이
    return (
      <div className="mt-5 relative rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
        <div className="space-y-1.5">
          <div className="h-2 w-3/4 rounded-full bg-gray-100" />
          <div className="h-2 w-full rounded-full bg-gray-100" />
        </div>
        <div className="absolute -right-1 -top-1 flex items-center gap-1.5">
          <div className="rounded-md bg-indigo-600 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow">
            여기 바꿔주세요
          </div>
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow">
            !
          </div>
        </div>
      </div>
    )
  }
  return null
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Eyebrow + Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
            Process
          </p>
          <h2 className="mt-3 text-4xl font-extrabold leading-[1.2] tracking-[-0.022em] text-gray-900 sm:text-5xl">
            이렇게{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              3단계
            </span>
            로 만들어드려요
          </h2>
          <p className="mt-6 text-base leading-relaxed text-gray-700 sm:text-lg">
            복잡한 거 없이, 1분 입력 → 다음 날 견적 → 본격 제작. 딱 이렇게
            진행됩니다.
          </p>
        </div>

        {/* Steps */}
        <ol className="mx-auto mt-14 grid grid-cols-1 gap-4 sm:mt-16 md:grid-cols-3 md:gap-8">
          {processSteps.map((step, idx) => (
            <li
              key={step.number}
              className="relative flex flex-col rounded-xl border border-gray-200 bg-white p-6 sm:p-8"
            >
              {/* Big number — gradient instead of pale indigo-100 for better visibility */}
              <div
                aria-hidden="true"
                className="bg-gradient-to-br from-indigo-500 to-violet-500 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl"
              >
                {step.number}
              </div>
              <h3 className="mt-4 text-xl font-bold leading-snug text-gray-900 sm:text-2xl">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-700 sm:text-base">
                {step.description}
              </p>

              {/* Mini UI mock */}
              <StepMock number={step.number} />

              <div className="mt-auto pt-5">
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  {step.duration}
                </span>
              </div>

              {/* Connector arrow — bolder color + slight bg pill for visibility */}
              {idx < processSteps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 translate-x-full items-center justify-center md:flex"
                  style={{ width: '2rem' }}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-indigo-500 shadow-sm">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="13 6 19 12 13 18" />
                    </svg>
                  </span>
                </span>
              )}
            </li>
          ))}
        </ol>

        {/* Final CTA — back to Hero form */}
        <div className="mt-14 flex flex-col items-center gap-4 text-center sm:mt-16">
          <p className="text-lg font-semibold text-gray-900 sm:text-xl">
            준비됐어요. 어떤 사이트가 필요하신가요?
          </p>
          <Link
            href="#hero-intent"
            className="cta-glow inline-flex h-14 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-7 text-base font-semibold text-white sm:text-[17px]"
          >
            지금 한 줄 입력해보기
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="ml-2 h-4 w-4"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3,10 8,5 13,10" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
