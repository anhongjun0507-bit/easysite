import type { ReactNode } from 'react'
import { differentiators } from '@/config/differentiators'

// 4색 톤은 유지 (각 차별점의 의미 차별화에 도움), 그라데이션은 제거.
// Pain ↔ Diff 시각 페어 매칭 (#9): 색은 PainPoints 카드와 동일.
const colorMap: Record<
  string,
  { tile: string; icon: string; accent: string; chip: string }
> = {
  clock: {
    tile: 'bg-indigo-50',
    icon: 'text-indigo-600',
    accent: 'text-indigo-700',
    chip: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
  },
  sparkles: {
    tile: 'bg-pink-50',
    icon: 'text-pink-600',
    accent: 'text-pink-700',
    chip: 'bg-pink-50 text-pink-700 ring-pink-100',
  },
  comment: {
    tile: 'bg-emerald-50',
    icon: 'text-emerald-600',
    accent: 'text-emerald-700',
    chip: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  },
  tag: {
    tile: 'bg-amber-50',
    icon: 'text-amber-600',
    accent: 'text-amber-700',
    chip: 'bg-amber-50 text-amber-700 ring-amber-100',
  },
}

// 차별점이 해결하는 Pain 의 짧은 인용 — Pain 카드와 페어 인지를 돕는 시각 신호.
const painShortQuote: Record<string, string> = {
  'slow-quote': '외주 견적까지 2주씩 걸려서',
  'writing-hard': '회사 소개 글쓰기 자신 없어서',
  'revision-pain': '수정 요청 카톡으로 일일이',
  'price-opaque': '얼마 들지 미리 몰라서',
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

/**
 * Differentiators 미니 mock — Features는 "가치", Process는 "스텝"으로 역할 분리.
 * P0-08: 24시간 카톡 알림과 사이트 위 코멘트 mock은 Process로 옮겨가고
 *        Features에서는 다른 시각화 사용.
 *
 *  clock(24h)    → 캘린더/시계 시각화 (속도감)
 *  sparkles(AI)  → AI 텍스트 생성 시뮬 (유지)
 *  comment(코멘트)→ 안내 텍스트 카드 (Process와 시각 차별)
 *  tag(가격)     → 가격표 (유지)
 */
function MiniMock({ icon, accent }: { icon: string; accent: string }) {
  if (icon === 'clock') {
    // 캘린더 시각화 — "오늘 → 내일" 흐름
    return (
      <div className="mt-5 rounded-lg border border-gray-200 bg-white p-3 shadow-xs">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-md bg-gray-100 px-2 py-2">
            <div className="text-[10px] font-semibold uppercase text-gray-500">오늘</div>
            <div className="mt-0.5 text-lg font-bold text-gray-800">접수</div>
          </div>
          <div className="flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-gray-400"
              aria-hidden="true"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="13 6 19 12 13 18" />
            </svg>
          </div>
          <div className={`rounded-md bg-indigo-50 px-2 py-2 ring-1 ring-indigo-200`}>
            <div className={`text-[10px] font-semibold uppercase ${accent}`}>내일</div>
            <div className="mt-0.5 text-lg font-bold text-gray-900">도착</div>
          </div>
        </div>
      </div>
    )
  }
  if (icon === 'sparkles') {
    // 실제 생성 예시 노출 — "그래서 뭐가 나오는데?" 의문 해소 (#11)
    return (
      <div className="mt-5 rounded-lg border border-gray-200 bg-white p-3 text-left shadow-xs">
        <div className={`text-[10px] font-bold uppercase tracking-wider ${accent}`}>
          AI 회사 소개 초안
        </div>
        <p className="mt-1.5 text-[12px] leading-relaxed text-gray-700">
          1989년 강남에서 시작한 한식당, 30년 동안 어머니의 손맛을 그대로
          이어오고 있습니다.
        </p>
      </div>
    )
  }
  if (icon === 'comment') {
    // 텍스트 안내 — 카톡 핑퐁 비교
    return (
      <div className="mt-5 rounded-lg border border-gray-200 bg-white p-3 text-left shadow-xs">
        <div className="space-y-2 text-[11px]">
          <div className="flex items-center gap-2 text-gray-500 line-through">
            <span>카톡으로 “1쪽 3번째 줄 첫째 줄…”</span>
          </div>
          <div className={`flex items-center gap-2 font-semibold ${accent}`}>
            <span>👆 사이트 위에 동그라미 한 번</span>
          </div>
        </div>
      </div>
    )
  }
  if (icon === 'tag') {
    return (
      <div className="mt-5 rounded-lg border border-gray-200 bg-white p-3 text-left shadow-xs">
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
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
            Features
          </p>
          {/* h2 weight 700, 그라데이션 제거 */}
          <h2 className="mt-3 text-4xl font-bold leading-[1.22] tracking-[-0.015em] text-gray-900 sm:text-5xl">
            EasySite는 이렇게 다릅니다
          </h2>
        </div>

        <ul className="mx-auto mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5">
          {differentiators.map((d) => {
            const color = colorMap[d.icon]
            return (
              <li
                key={d.id}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 transition duration-200 ease-emphasized hover:-translate-y-0.5 hover:shadow-md sm:p-8"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div
                    className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${color.tile} ${color.icon}`}
                  >
                    {iconMap[d.icon]}
                  </div>
                  {d.answersPainPointId &&
                    painShortQuote[d.answersPainPointId] && (
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${color.chip}`}
                      >
                        해결: “{painShortQuote[d.answersPainPointId]}”
                      </span>
                    )}
                </div>

                <h3 className="text-lg font-bold leading-snug text-gray-900 sm:text-xl">
                  {d.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-700 sm:text-base">
                  {d.description}
                </p>

                <MiniMock icon={d.icon} accent={color.accent} />

                {d.example && (
                  <p className="mt-auto border-l-2 border-gray-300 pl-3 pt-4 text-xs leading-relaxed text-gray-600 sm:text-sm">
                    {d.example}
                  </p>
                )}
              </li>
            )
          })}
        </ul>

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
