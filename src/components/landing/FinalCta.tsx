import Link from 'next/link'

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 py-20 sm:py-24 md:py-28">
      {/* Subtle decorative blobs for depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-fuchsia-400/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-400/30 blur-3xl"
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center sm:px-8">
        <h2 className="text-3xl font-extrabold leading-[1.2] tracking-[-0.022em] text-white sm:text-4xl md:text-5xl">
          지금 시작하면 내일 미리보기를 받아보실 수 있어요
        </h2>

        <div className="mt-9 sm:mt-11">
          <Link
            href="#hero-intent"
            className="inline-flex h-16 items-center justify-center rounded-xl bg-white px-10 text-lg font-bold text-indigo-700 shadow-2xl shadow-indigo-900/30 transition hover:-translate-y-0.5 hover:bg-indigo-50 hover:shadow-indigo-900/50 sm:text-xl"
          >
            무료로 견적 받기
            <span aria-hidden="true" className="ml-2">
              →
            </span>
          </Link>
        </div>

        <p className="mt-6 text-sm font-medium text-indigo-100">
          1분이면 끝나요 · 가입 없이 가능
        </p>
      </div>
    </section>
  )
}
