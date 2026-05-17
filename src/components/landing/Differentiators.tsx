import type { ReactNode } from 'react'
import { differentiators } from '@/config/differentiators'

const iconMap: Record<string, ReactNode> = {
  clock: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  ),
  sparkles: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M12 3l1.7 4.6L18.3 9.3 13.7 11l-1.7 4.6L10.3 11 5.7 9.3 10.3 7.6 12 3z" />
      <path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z" />
    </svg>
  ),
  comment: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M21 12a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z" />
    </svg>
  ),
  tag: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z" />
      <circle cx="7" cy="7" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
}

export function Differentiators() {
  return (
    <section id="solutions" className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Heading */}
        <h2 className="mx-auto max-w-2xl text-center text-4xl font-extrabold leading-[1.2] tracking-[-0.025em] text-gray-900 sm:text-5xl">
          EasySite는 이렇게{' '}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            다릅니다
          </span>
        </h2>

        {/* Cards 2x2 — bg-white (gray-50 섹션 위에 "올라온" 느낌) */}
        <ul className="mx-auto mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5">
          {differentiators.map((d) => (
            <li
              key={d.id}
              className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 sm:p-8"
            >
              {/* Icon tile (no chip — 제목 자체가 라벨) */}
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                {iconMap[d.icon]}
              </div>

              <h3 className="text-lg font-bold leading-snug text-gray-900 sm:text-xl">
                {d.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                {d.description}
              </p>

              {d.example && (
                <p className="mt-auto border-l-2 border-indigo-200 pl-3 pt-4 text-xs leading-relaxed text-gray-500 sm:text-sm">
                  {d.example}
                </p>
              )}
            </li>
          ))}
        </ul>

        {/* Bridge + CTA to next section */}
        <div className="mt-14 flex flex-col items-center gap-4 text-center sm:mt-16">
          <a
            href="#how-it-works"
            className="group inline-flex items-center gap-1.5 text-base font-semibold text-indigo-600 transition hover:text-indigo-700 sm:text-[17px]"
          >
            제작 과정 3단계 보기
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="h-4 w-4 transition group-hover:translate-y-0.5"
            >
              <path
                fill="currentColor"
                d="M8 11.5 3.5 7l1-1L8 9.5 11.5 6l1 1z"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
