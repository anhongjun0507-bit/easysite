import type { ReactNode } from 'react'
import { differentiators } from '@/config/differentiators'

// 4색 시스템 — 사용자 평("아이콘 톤 다양화" + "보조 컬러 1개 추가") 반영
// 각 카드별로 다른 hue, 50/600 톤 일관 유지
const colorMap: Record<string, { tile: string; icon: string; accent: string }> = {
  clock: { tile: 'bg-indigo-50', icon: 'text-indigo-600', accent: 'text-indigo-700' },
  sparkles: { tile: 'bg-pink-50', icon: 'text-pink-600', accent: 'text-pink-700' },
  comment: { tile: 'bg-emerald-50', icon: 'text-emerald-600', accent: 'text-emerald-700' },
  tag: { tile: 'bg-amber-50', icon: 'text-amber-600', accent: 'text-amber-700' },
}

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

// 각 차별점 카드 안에 들어갈 작은 시각 모킹
function MiniMock({ icon, accent }: { icon: string; accent: string }) {
  if (icon === 'clock') {
    // 카톡 알림 모킹
    return (
      <div className="mt-5 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
        <div className="flex items-start gap-2.5">
          <div className="h-7 w-7 shrink-0 rounded-full bg-yellow-300" />
          <div className="flex-1 text-left">
            <div className="text-[11px] font-semibold text-gray-900">EasySite</div>
            <div className="mt-0.5 text-[11px] leading-snug text-gray-600">
              사장님 견적이랑 사이트 시안 도착했어요 ✨
            </div>
          </div>
          <div className="text-[10px] text-gray-400">방금</div>
        </div>
      </div>
    )
  }
  if (icon === 'sparkles') {
    // AI 텍스트 생성 모킹
    return (
      <div className="mt-5 rounded-lg border border-gray-200 bg-white p-3 shadow-sm text-left">
        <div className={`text-[10px] font-bold uppercase tracking-wider ${accent}`}>
          AI 회사 소개 초안
        </div>
        <div className="mt-1.5 space-y-1">
          <div className="h-2 w-full rounded-full bg-pink-100" />
          <div className="h-2 w-5/6 rounded-full bg-pink-100" />
          <div className="h-2 w-4/6 rounded-full bg-pink-100" />
        </div>
      </div>
    )
  }
  if (icon === 'comment') {
    // 사이트 위 코멘트 오버레이 모킹
    return (
      <div className="mt-5 relative rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
        <div className="space-y-1.5">
          <div className="h-2 w-3/4 rounded-full bg-gray-100" />
          <div className="h-2 w-full rounded-full bg-gray-100" />
        </div>
        {/* Annotation pin */}
        <div className="absolute -right-1 -top-1 flex items-center gap-1.5">
          <div className="rounded-md bg-emerald-600 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow">
            여기 색 바꿔주세요
          </div>
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow">
            !
          </div>
        </div>
      </div>
    )
  }
  if (icon === 'tag') {
    // 가격표 미리보기 모킹
    return (
      <div className="mt-5 rounded-lg border border-gray-200 bg-white p-3 shadow-sm text-left">
        <div className="space-y-1.5 text-[11px]">
          <div className="flex justify-between">
            <span className="text-gray-600">메인 + 소개 페이지</span>
            <span className={`font-bold ${accent}`}>50만원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">예약 기능 추가</span>
            <span className={`font-bold ${accent}`}>30만원</span>
          </div>
          <div className="flex justify-between border-t border-gray-100 pt-1.5">
            <span className="font-semibold text-gray-900">합계</span>
            <span className="font-bold text-gray-900">80만원</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export function Differentiators() {
  return (
    <section id="solutions" className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Eyebrow + Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
            Features
          </p>
          <h2 className="mt-3 text-4xl font-extrabold leading-[1.2] tracking-[-0.022em] text-gray-900 sm:text-5xl">
            EasySite는 이렇게{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              다릅니다
            </span>
          </h2>
        </div>

        {/* Cards 2x2 */}
        <ul className="mx-auto mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5">
          {differentiators.map((d) => {
            const color = colorMap[d.icon]
            return (
              <li
                key={d.id}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 transition hover:shadow-lg hover:shadow-gray-200/60 sm:p-8"
              >
                <div
                  className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg ${color.tile} ${color.icon}`}
                >
                  {iconMap[d.icon]}
                </div>

                <h3 className="text-lg font-bold leading-snug text-gray-900 sm:text-xl">
                  {d.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-700 sm:text-base">
                  {d.description}
                </p>

                {/* Mini visual mock */}
                <MiniMock icon={d.icon} accent={color.accent} />

                {d.example && (
                  <p className="mt-auto border-l-2 border-gray-300 pl-3 pt-4 text-xs leading-relaxed text-gray-500 sm:text-sm">
                    {d.example}
                  </p>
                )}
              </li>
            )
          })}
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
