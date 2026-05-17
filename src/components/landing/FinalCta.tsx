import Link from 'next/link'

/**
 * FinalCta — 페이지에서 그라데이션을 사용하는 유일한 자리 (P0-07)
 */
export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 py-20 sm:py-24 md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-fuchsia-400/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-400/30 blur-3xl"
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center sm:px-8">
        <h2 className="text-3xl font-bold leading-[1.22] tracking-[-0.015em] text-white sm:text-4xl md:text-5xl">
          지금 시작하면 내일 미리보기를 받아보실 수 있어요
        </h2>

        <div className="mt-9 sm:mt-11">
          <Link
            href="/wizard"
            className="inline-flex h-16 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-white px-10 text-lg font-bold text-indigo-700 shadow-2xl shadow-indigo-900/30 transition hover:-translate-y-0.5 hover:bg-indigo-50 hover:shadow-indigo-900/50 sm:text-xl"
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
          </Link>
        </div>

        {/* 보라 배경 위 indigo-100 → 대비 충분 (4.5:1+) */}
        <p className="mt-6 text-sm font-medium text-indigo-100">
          가입 없이 가능 · 영업일 24시간 안에 카톡으로 답변
        </p>
      </div>
    </section>
  )
}
