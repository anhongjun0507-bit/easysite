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
            <span aria-hidden="true" className="mx-1.5 text-gray-400">
              ·
            </span>
            프리즘 안홍준 대표 직접 제작
          </div>

          {/* Headline — clamp font, 1.18 line-height, 한글 가독성 확보. 강조어 solid (그라데이션 제거) */}
          <h1
            className="animate-ease-up animate-ease-up-d1 font-extrabold text-gray-900"
            style={{
              fontSize: 'clamp(34px, 6vw, 60px)',
              lineHeight: 1.18,
              letterSpacing: '-0.02em',
            }}
          >
            아이디어만 있으면 됩니다.
            <br />
            나머지는 <span className="text-indigo-600">AI가</span> 채워드립니다.
          </h1>

          {/* Subheadline — gray-700 (대비 충분) */}
          <p className="animate-ease-up animate-ease-up-d2 mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-700 sm:mt-6 sm:text-lg md:text-xl">
            지금 한 줄만 알려주시면, 영업일 24시간 안에 견적이랑 사이트
            미리보기를 보내드릴게요.
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
                className="cta-glow inline-flex h-14 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-indigo-600 px-7 text-base font-semibold text-white hover:bg-indigo-700 sm:text-[17px]"
              >
                <span>1분 만에 견적 받기</span>
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
            </div>
          </form>

          {/* Quick intent chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:mt-5">
            <span className="text-sm font-medium text-gray-600">
              자주 찾는 분야
            </span>
            {quickIntents.map((label) => (
              <Link
                key={label}
                href={`/wizard?intent=${encodeURIComponent(label + ' 사이트')}`}
                className="rounded-full border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 transition hover:border-indigo-400 hover:text-indigo-700"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Caption — 흰배경 대비 통과 (gray-600 = 7.0:1) */}
          <p className="mt-5 text-sm font-medium text-gray-600">
            가입 없이 가능 · 영업일 24시간 안에 카톡으로 답변
          </p>
        </div>

        {/* AI mock preview — what user gets next day */}
        <div className="mx-auto mt-12 max-w-3xl sm:mt-16">
          <MockPreview />
        </div>

        {/* Trust bar — 7건 클라이언트 */}
        <div className="mx-auto mt-12 max-w-3xl border-t border-gray-200 pt-6 text-center sm:mt-14 sm:pt-8">
          <p className="text-xs font-semibold tracking-[0.1em] text-gray-500">
            이미 함께한 브랜드
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[15px] font-semibold text-gray-600">
            {featuredPortfolio.map((item, idx) => (
              <Fragment key={item.id}>
                {idx > 0 && (
                  <span aria-hidden="true" className="text-gray-400">
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
      {/* Floating label — solid (그라데이션 제거) */}
      <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-brand">
        AI 자동 생성 예시
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 border-b border-gray-200 bg-gray-50 px-4 py-3">
          <div className="h-2 w-2 rounded-full bg-red-400" />
          <div className="h-2 w-2 rounded-full bg-yellow-400" />
          <div className="h-2 w-2 rounded-full bg-green-400" />
          {/* URL bar — 대비 향상 (P2-04: gray-400 → gray-600) */}
          <div className="ml-3 hidden flex-1 rounded-md bg-white px-3 py-1 text-sm text-gray-600 sm:block">
            손맛한식당.kr
          </div>
        </div>

        {/* Mock site content — h3 → p로 강등 (P0-06 헤딩 트리 정상화) */}
        <div className="grid grid-cols-1 gap-6 p-8 sm:grid-cols-5 sm:gap-8 sm:p-10">
          <div className="sm:col-span-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              한식당 · 서울 강남
            </div>
            <p className="mt-2 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
              30년 손맛,
              <br />
              그대로 차려드립니다
            </p>
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

          {/* Image placeholder — 이모지 🍱 제거, 추상 도형으로 대체 (P1-03) */}
          <div className="sm:col-span-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-200 sm:aspect-square">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-16 w-16 text-indigo-600/70"
                >
                  <rect x="8" y="20" width="48" height="32" rx="4" />
                  <path d="M16 20l4-8h24l4 8" />
                  <line x1="20" y1="34" x2="44" y2="34" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
