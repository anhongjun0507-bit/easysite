import Link from 'next/link'

export function FinalCta() {
  return (
    <section className="overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 py-20 sm:py-24 md:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center sm:px-8">
        <h2 className="text-3xl font-extrabold leading-[1.2] tracking-[-0.025em] text-white sm:text-4xl md:text-5xl">
          지금 시작하면 내일 미리보기를 받아보실 수 있어요
        </h2>

        <div className="mt-8 sm:mt-10">
          <Link
            href="#hero-intent"
            className="inline-flex h-14 items-center justify-center rounded-lg bg-white px-8 text-base font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50 hover:shadow-xl sm:text-[17px]"
          >
            무료로 견적 받기
            <span aria-hidden="true" className="ml-2">
              →
            </span>
          </Link>
        </div>

        <p className="mt-5 text-sm font-medium text-indigo-100">
          1분이면 끝나요 · 가입 없이 가능
        </p>
      </div>
    </section>
  )
}
