import Link from 'next/link'
import { processSteps } from '@/config/process'

// 각 단계 미니 UI 모킹 — Differentiators와 시각 차별 (P0-08)
// Differentiators는 "가치/효과" 시각, HowItWorks는 "실제 진행" 화면
function StepMock({ number }: { number: string }) {
  if (number === '01') {
    // 위저드 폼 카드 (실제 /wizard 페이지를 simulate)
    return (
      <div className="mt-5 rounded-lg border border-gray-200 bg-white p-3 text-left shadow-xs">
        <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
          1분 견적
        </div>
        <div className="mt-1.5 text-xs font-semibold text-gray-900">
          어떤 사이트가 필요하세요?
        </div>
        <div className="mt-2 space-y-1">
          <div className="rounded border border-gray-200 px-2 py-1 text-[11px] text-gray-500">
            예: 학원 홈페이지
          </div>
          <div className="h-1 w-1/3 rounded-full bg-indigo-500" />
        </div>
      </div>
    )
  }
  if (number === '02') {
    // 카톡 알림 (이모지 제거, SVG 사용)
    return (
      <div className="mt-5 rounded-lg border border-gray-200 bg-white p-3 shadow-xs">
        <div className="flex items-start gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-300">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 text-gray-800"
              aria-hidden="true"
            >
              <path d="M12 3C6.48 3 2 6.58 2 11c0 2.6 1.55 4.91 3.95 6.4-.17 1.3-.85 3.1-1.45 4.1 1.8-.3 4.2-1.3 5.5-2.1.65.13 1.32.2 2 .2 5.52 0 10-3.58 10-8s-4.48-8.6-10-8.6z" />
            </svg>
          </div>
          <div className="flex-1 text-left">
            <div className="text-[11px] font-semibold text-gray-900">
              지으리
            </div>
            <div className="mt-0.5 text-[11px] leading-snug text-gray-700">
              사장님 사이트 시안이랑 견적이 도착했어요. 메일도 같이 보내드렸어요.
            </div>
          </div>
        </div>
      </div>
    )
  }
  if (number === '03') {
    // 사이트 위 코멘트 핀
    return (
      <div className="relative mt-5 rounded-lg border border-gray-200 bg-white p-3 shadow-xs">
        <div className="space-y-1.5">
          <div className="h-2 w-3/4 rounded-full bg-gray-100" />
          <div className="h-2 w-full rounded-full bg-gray-100" />
          <div className="h-2 w-5/6 rounded-full bg-gray-100" />
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
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
            Process
          </p>
          {/* h2 weight 700, 그라데이션 제거 */}
          <h2 className="mt-3 text-4xl font-bold leading-[1.22] tracking-[-0.015em] text-gray-900 sm:text-5xl">
            이렇게 3단계로 만들어드려요
          </h2>
          <p className="mt-6 text-base leading-relaxed text-gray-700 sm:text-lg">
            복잡한 거 없이, 1분 입력 → 다음 날 견적 → 본격 제작. 딱 이렇게
            진행됩니다.
          </p>
        </div>

        <ol className="mx-auto mt-14 grid grid-cols-1 gap-4 sm:mt-16 md:grid-cols-3 md:gap-8">
          {processSteps.map((step, idx) => (
            <li
              key={step.number}
              className="relative flex flex-col rounded-xl border border-gray-200 bg-white p-6 transition duration-200 ease-emphasized hover:-translate-y-0.5 hover:shadow-md sm:p-8"
            >
              {/* 번호 — solid indigo-500 (그라데이션 제거) */}
              <div
                aria-hidden="true"
                className="text-5xl font-extrabold tracking-tight text-indigo-500 sm:text-6xl"
              >
                {step.number}
              </div>
              <h3 className="mt-4 text-xl font-bold leading-snug text-gray-900 sm:text-2xl">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-700 sm:text-base">
                {step.description}
              </p>

              <StepMock number={step.number} />

              <div className="mt-auto pt-5">
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  {step.duration}
                </span>
              </div>

              {/* Connector — solid indigo (그라데이션 제거) */}
              {idx < processSteps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 translate-x-full items-center justify-center md:flex"
                  style={{ width: '2rem' }}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-indigo-500 shadow-xs">
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

        {/* primary CTA 는 바로 다음 FinalCta 섹션에서 강조 → 여기는 텍스트 링크로 약화 (#8) */}
        <div className="mt-12 text-center sm:mt-14">
          <Link
            href="/wizard"
            className="inline-flex items-center gap-1.5 text-base font-semibold text-indigo-600 transition hover:text-indigo-700 sm:text-[17px]"
          >
            지금 신청서 작성하기
            <svg
              aria-hidden="true"
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
          </Link>
        </div>
      </div>
    </section>
  )
}
