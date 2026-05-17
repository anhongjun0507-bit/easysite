import { Fragment } from 'react'
import Link from 'next/link'
import { featuredPortfolio } from '@/config/portfolio'

const quickIntents = ['학원·교육', '쇼핑몰', '회사 소개', '주문·예약']

export function Hero() {
  return (
    <section className="bg-hero-mesh relative">
      <div className="mx-auto max-w-7xl px-6 pt-8 pb-16 sm:px-8 sm:pt-12 sm:pb-20 md:pt-16 md:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow */}
          <div className="animate-ease-up mb-5 inline-flex items-center rounded-full border border-gray-200 bg-white/80 px-4 py-1.5 text-sm font-semibold text-gray-700 backdrop-blur sm:mb-7">
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="mr-1.5 h-4 w-4 fill-amber-500"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.952a1 1 0 00.95.69h4.155c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.287 3.952c.3.922-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.175 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.287-3.952a1 1 0 00-.364-1.118L2.572 9.38c-.783-.57-.38-1.81.588-1.81h4.155a1 1 0 00.951-.69l1.286-3.952z" />
            </svg>
            숨고 평점
            <span className="mx-1 font-bold text-gray-900">5.0</span>
            <span aria-hidden="true" className="mx-1.5 text-gray-300">
              ·
            </span>
            1인 프리미엄 제작
          </div>

          {/* Headline — slightly looser tracking for KR readability */}
          <h1 className="animate-ease-up animate-ease-up-d1 text-4xl font-extrabold leading-[1.15] tracking-[-0.022em] text-gray-900 sm:text-5xl md:text-6xl">
            아이디어만 있으면 됩니다.
            <br />
            나머지는{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              AI가
            </span>{' '}
            채워드립니다.
          </h1>

          {/* Subheadline — gray-700 (was gray-600) */}
          <p className="animate-ease-up animate-ease-up-d2 mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-700 sm:mt-6 sm:text-lg md:text-xl">
            지금 한 줄만 알려주시면, 내일까지 견적이랑 사이트 미리보기를
            보내드릴게요.
          </p>

          {/* Inline wizard form */}
          <form
            action="/wizard"
            method="get"
            className="animate-ease-up animate-ease-up-d3 mx-auto mt-7 max-w-xl sm:mt-9"
          >
            <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-3">
              <label htmlFor="hero-intent" className="sr-only">
                어떤 사이트가 필요하세요?
              </label>
              <input
                id="hero-intent"
                type="text"
                name="intent"
                placeholder="예: 학원 홈페이지, 카페 예약, 쇼핑몰"
                required
                maxLength={120}
                autoComplete="off"
                className="h-14 flex-1 rounded-lg border border-gray-300 bg-white px-5 text-base text-gray-900 shadow-sm placeholder:text-gray-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 sm:text-[17px]"
              />
              <button
                type="submit"
                className="cta-glow inline-flex h-14 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-7 text-base font-semibold text-white sm:text-[17px]"
              >
                견적 받기
                <span aria-hidden="true" className="ml-2">
                  →
                </span>
              </button>
            </div>
          </form>

          {/* Quick intent chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:mt-5">
            <span className="text-sm font-medium text-gray-500">
              자주 찾는 분야
            </span>
            {quickIntents.map((label) => (
              <Link
                key={label}
                href={`/wizard?intent=${encodeURIComponent(label + ' 사이트')}`}
                className="rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-sm font-medium text-gray-700 backdrop-blur transition hover:border-indigo-300 hover:text-indigo-700"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Caption */}
          <p className="mt-5 text-sm font-medium text-gray-500">
            1분이면 끝나요 · 가입 없이 가능
          </p>
        </div>

        {/* AI mock preview — what user gets next day */}
        <div className="mx-auto mt-12 max-w-3xl sm:mt-16">
          <MockPreview />
        </div>

        {/* Trust bar — 7건 클라이언트 */}
        <div className="mx-auto mt-12 max-w-3xl border-t border-gray-100 pt-6 text-center sm:mt-14 sm:pt-8">
          <p className="text-xs font-semibold tracking-[0.1em] text-gray-500">
            이미 함께한 브랜드
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[15px] font-semibold text-gray-600">
            {featuredPortfolio.map((item, idx) => (
              <Fragment key={item.id}>
                {idx > 0 && (
                  <span aria-hidden="true" className="text-gray-300">
                    ·
                  </span>
                )}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded transition hover:text-indigo-700"
                >
                  {item.name}
                </a>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function MockPreview() {
  return (
    <div className="relative">
      {/* Floating label */}
      <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-500/30">
        AI 자동 생성 예시
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-indigo-200/30">
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 border-b border-gray-200 bg-gray-50 px-4 py-3">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
          <div className="ml-3 hidden flex-1 rounded-md bg-white px-3 py-1 text-xs text-gray-400 sm:block">
            손맛한식당.kr
          </div>
        </div>

        {/* Mock site content */}
        <div className="grid grid-cols-1 gap-6 p-8 sm:grid-cols-5 sm:gap-8 sm:p-10">
          {/* Left: hero copy */}
          <div className="sm:col-span-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              한식당 · 서울 강남
            </div>
            <h3 className="mt-2 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
              30년 손맛,
              <br />
              그대로 차려드립니다
            </h3>
            <div className="mt-3 space-y-1.5">
              <div className="h-2.5 w-full rounded-full bg-gray-100" />
              <div className="h-2.5 w-5/6 rounded-full bg-gray-100" />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white">
                예약하기
              </span>
              <span className="rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700">
                메뉴 보기
              </span>
            </div>
          </div>

          {/* Right: image placeholder */}
          <div className="sm:col-span-2">
            <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-indigo-100 via-violet-100 to-fuchsia-100 sm:aspect-square">
              <div className="flex h-full items-center justify-center text-5xl sm:text-6xl">
                🍱
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
