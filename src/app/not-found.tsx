import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '페이지를 찾을 수 없어요',
  description: '주소가 잘못되었거나 페이지가 이동된 것 같아요.',
}

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center gap-6 px-6 py-16 text-center sm:py-24">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
        404 — Not Found
      </p>
      <h1 className="text-4xl font-extrabold leading-[1.2] tracking-[-0.02em] text-gray-900 sm:text-5xl">
        앗, 길을 잘못 드신 것 같아요
      </h1>
      <p className="max-w-md text-base leading-relaxed text-gray-600 sm:text-lg">
        주소가 잘못되었거나 페이지가 이동된 것 같습니다.
        <br className="hidden sm:inline" /> 처음으로 돌아가서 다시 시작해
        보세요.
      </p>
      <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
        <Link
          href="/"
          className="cta-glow inline-flex h-14 items-center justify-center rounded-lg bg-indigo-600 px-7 text-base font-semibold text-white sm:text-[17px]"
        >
          처음으로 돌아가기
        </Link>
        <Link
          href="/wizard"
          className="inline-flex h-14 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 text-base font-semibold text-gray-700 transition hover:border-gray-400 hover:text-gray-900 sm:text-[17px]"
        >
          1분 만에 견적 받기
        </Link>
      </div>
    </section>
  )
}
