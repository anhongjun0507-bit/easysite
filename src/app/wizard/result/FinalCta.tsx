import Link from 'next/link'

export function FinalCta() {
  return (
    <section className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-3xl px-6 py-14 sm:px-8 sm:py-20">
        <div className="text-center">
          <h2
            className="font-extrabold text-gray-900"
            style={{
              fontSize: 'clamp(26px, 5vw, 38px)',
              lineHeight: 1.22,
              letterSpacing: '-0.02em',
            }}
          >
            사장님 마음에 드세요?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-700 sm:text-lg">
            운영자와 직접 이야기하시면 정식 견적서·시안을 빠르게 받아보실 수
            있어요. 가격·기간 협상도 가능해요.
          </p>
        </div>

        <div className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:mt-11">
          <a
            href="tel:01037825418"
            className="cta-glow inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-base font-semibold text-white transition hover:bg-indigo-700 sm:text-[17px]"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>운영자에게 전화 (010-3782-5418)</span>
          </a>
          <button
            type="button"
            disabled
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-500"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>AI 챗봇과 더 이야기하기 — 곧 열려요</span>
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center text-sm font-medium text-gray-500 underline-offset-4 hover:text-gray-700 hover:underline"
          >
            홈으로
          </Link>
        </div>
      </div>
    </section>
  )
}
