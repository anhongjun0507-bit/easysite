import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-20 sm:px-8 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow */}
          <div className="mb-8 inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-semibold text-gray-700">
            <span
              aria-hidden="true"
              className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-indigo-500"
            />
            사장님을 위한 AI 사이트 제작
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-extrabold leading-[1.15] tracking-[-0.025em] text-gray-900 sm:text-6xl md:text-7xl">
            아이디어만 있으면 됩니다.
            <br />
            나머지는{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI가
            </span>{' '}
            채워드립니다.
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 sm:mt-8 sm:text-xl md:text-2xl">
            1분만 알려주세요.{' '}
            <strong className="font-semibold text-gray-900">24시간 안에</strong>{' '}
            견적이랑 사이트 미리보기까지 보여드릴게요.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:mt-12 sm:flex-row sm:gap-4">
            <Link
              href="/wizard"
              className="inline-flex h-14 w-full items-center justify-center rounded-lg bg-indigo-600 px-7 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md sm:w-auto sm:text-[17px]"
            >
              무료로 견적 받기
              <span aria-hidden="true" className="ml-2">
                →
              </span>
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex h-14 w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-6 text-base font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 sm:w-auto sm:text-[17px]"
            >
              포트폴리오 보기
            </Link>
          </div>

          {/* Caption */}
          <p className="mt-6 text-sm font-medium text-gray-500">
            1분이면 끝나요 · 가입 없이 가능
          </p>
        </div>
      </div>
    </section>
  )
}
