import Link from 'next/link'
import { processSteps } from '@/config/process'

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-extrabold leading-[1.2] tracking-[-0.025em] text-gray-900 sm:text-5xl">
            이렇게{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              3단계
            </span>
            로 만들어드려요
          </h2>
          <p className="mt-6 text-base leading-relaxed text-gray-600 sm:text-lg">
            복잡한 거 없이, 1분 입력 → 다음 날 견적 → 본격 제작. 딱 이렇게
            진행됩니다.
          </p>
        </div>

        {/* Steps — 3 columns on md+, stacked on mobile */}
        <ol className="mx-auto mt-14 grid grid-cols-1 gap-4 sm:mt-16 md:grid-cols-3 md:gap-5">
          {processSteps.map((step) => (
            <li
              key={step.number}
              className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 sm:p-8"
            >
              <div
                aria-hidden="true"
                className="text-5xl font-extrabold tracking-tight text-indigo-100 sm:text-6xl"
              >
                {step.number}
              </div>
              <h3 className="mt-4 text-xl font-bold leading-snug text-gray-900 sm:text-2xl">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                {step.description}
              </p>
              <div className="mt-auto pt-5">
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  {step.duration}
                </span>
              </div>
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
            className="inline-flex h-14 items-center justify-center rounded-lg bg-indigo-600 px-7 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md sm:text-[17px]"
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
