import type { ReactNode } from 'react'
import { painPoints } from '@/config/pain-points'

const painIconMap: Record<string, ReactNode> = {
  'slow-quote': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  ),
  'writing-hard': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M3 21l3.5-1 11-11-2.5-2.5-11 11L3 21z" />
      <path d="M14 6l2.5-2.5a1.4 1.4 0 0 1 2 0l.5.5a1.4 1.4 0 0 1 0 2L16.5 8.5" />
    </svg>
  ),
  'revision-pain': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M3 8a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v3a4 4 0 0 1-4 4H8l-5 3V8z" />
      <path d="M21 12.5a3 3 0 0 1-3 3h-1l-2.5 2v-2" />
    </svg>
  ),
  'price-opaque': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 4" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
}

export function PainPoints() {
  return (
    <section id="pain-points" className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
            Pain Points
          </p>
          {/* h2 weight 700 (h1과 차등) — 그라데이션 제거 */}
          <h2 className="mt-3 text-4xl font-bold leading-[1.22] tracking-[-0.015em] text-gray-900 sm:text-5xl">
            혹시 이런 고민, 익숙하세요?
          </h2>
        </div>

        <ul className="mx-auto mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5">
          {painPoints.map((p) => (
            <li
              key={p.id}
              className="flex flex-col rounded-xl border border-gray-200 bg-gray-50 p-6 transition duration-200 ease-emphasized hover:-translate-y-0.5 hover:border-gray-300 hover:bg-white hover:shadow-sm sm:p-8"
            >
              <div className="flex items-start gap-4">
                <span
                  aria-hidden="true"
                  className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-gray-500 shadow-xs ring-1 ring-gray-200"
                >
                  {painIconMap[p.id]}
                </span>
                <div className="flex-1">
                  <span
                    aria-hidden="true"
                    className="block text-4xl font-extrabold leading-none text-indigo-300 sm:text-5xl"
                  >
                    &ldquo;
                  </span>
                  <p className="mt-2 text-lg font-semibold leading-snug text-gray-900 sm:text-xl">
                    {p.quote}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Bridge — 그라데이션 제거, solid indigo-700 */}
        <p className="mx-auto mt-12 max-w-xl text-center text-lg font-semibold text-gray-900 sm:mt-14 sm:text-xl">
          맞아요. 그래서{' '}
          <span className="text-indigo-700">EasySite</span>를 만들었어요.
        </p>
      </div>
    </section>
  )
}
