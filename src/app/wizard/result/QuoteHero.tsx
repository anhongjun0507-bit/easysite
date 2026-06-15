'use client'

import { useState } from 'react'
import type { QuoteResult } from '@/lib/quote/calculate'
import { formatPriceRange, formatWeeksRange } from '@/lib/quote/calculate'

type Props = {
  quote: QuoteResult
  businessName: string | null
}

export function QuoteHero({ quote, businessName }: Props) {
  const [open, setOpen] = useState(false)
  const greetName = (businessName ?? '').trim()

  return (
    <section className="bg-hero-mesh">
      <div className="mx-auto max-w-3xl px-6 pb-10 pt-12 sm:px-8 sm:pb-14 sm:pt-16">
        <div className="text-center">
          <p className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold tracking-[0.12em] text-indigo-700">
            견적 결과
          </p>
          <h1
            className="mt-4 font-extrabold text-gray-900"
            style={{
              fontSize: 'clamp(24px, 4.5vw, 34px)',
              lineHeight: 1.25,
              letterSpacing: '-0.015em',
            }}
          >
            {greetName ? (
              <>
                <span className="text-indigo-600">{greetName}</span> 사장님 사이트,
                <br className="sm:hidden" /> 이렇게 만들 수 있어요
              </>
            ) : (
              <>사장님 사이트, 이렇게 만들 수 있어요</>
            )}
          </h1>
        </div>

        {/* 가격 = 영혼 */}
        <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-gray-200 bg-white p-7 shadow-md sm:mt-10 sm:p-10">
          <div className="text-center">
            {quote.eventActive && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white">
                ⚡ 선착순 런칭 이벤트
              </span>
            )}
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
              예상 견적
            </p>
            {quote.eventActive ? (
              <>
                <p className="mt-2 text-base font-semibold text-gray-400 line-through sm:text-lg">
                  정가 {formatPriceRange(quote.list)}
                </p>
                <p
                  className="mt-1 font-extrabold tracking-tight text-indigo-600"
                  style={{
                    fontSize: 'clamp(40px, 9vw, 64px)',
                    lineHeight: 1.1,
                    letterSpacing: '-0.025em',
                  }}
                >
                  {formatPriceRange(quote.event)}
                </p>
              </>
            ) : (
              <p
                className="mt-3 font-extrabold tracking-tight text-gray-900"
                style={{
                  fontSize: 'clamp(40px, 9vw, 64px)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.025em',
                }}
              >
                {formatPriceRange(quote.list)}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500 sm:text-sm">
              VAT 별도 · 영업일 24시간 안에 정식 견적서 보내드려요
            </p>
          </div>

          <div className="mt-7 flex items-center justify-center gap-2 border-t border-gray-200 pt-5 text-base sm:text-lg">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-gray-500"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15 14" />
            </svg>
            <span className="text-gray-700">
              예상 기간{' '}
              <strong className="font-bold text-gray-900">
                {formatWeeksRange(quote)}
              </strong>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="mt-6 inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <span>이 견적이 나온 이유</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {open && (
            <dl className="mt-5 space-y-2 rounded-xl bg-gray-50 p-5 text-sm sm:text-[15px]">
              {quote.breakdown.map((b, i) => {
                const isFinal = i === quote.breakdown.length - 1
                return (
                  <div
                    key={`${b.label}-${i}`}
                    className={`flex items-baseline justify-between gap-3 ${
                      isFinal
                        ? 'mt-3 border-t border-gray-200 pt-3 font-semibold text-gray-900'
                        : 'text-gray-700'
                    }`}
                  >
                    <dt>{b.label}</dt>
                    <dd className="shrink-0 tabular-nums">{b.value}</dd>
                  </div>
                )
              })}
            </dl>
          )}
        </div>

        <p className="mt-5 text-center text-sm text-gray-600">
          이건 자동 계산된 예상가예요. 정식 견적은 24시간 안에 사람이 직접 보내드려요.
        </p>
      </div>
    </section>
  )
}
