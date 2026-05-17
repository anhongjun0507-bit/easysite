import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '견적 위저드 — EasySite',
  description: '1분이면 끝나는 견적 위저드를 준비하고 있어요.',
}

export default function WizardPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center gap-7 px-6 py-16 text-center sm:py-24">
      <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-semibold text-gray-700">
        <span
          aria-hidden="true"
          className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-indigo-500"
        />
        곧 만나요
      </span>

      <h1 className="text-3xl font-extrabold leading-[1.2] tracking-[-0.02em] text-gray-900 sm:text-4xl md:text-5xl">
        견적 위저드를
        <br className="sm:hidden" /> 만들고 있어요
      </h1>

      <p className="max-w-md text-base leading-relaxed text-gray-600 sm:text-lg">
        이번 주 안에 공개돼요. 그 전에 미리 견적 받아보고 싶으시면
        <br className="hidden sm:inline" /> 아래로 연락주시면 1:1로 도와드릴게요.
      </p>

      <a
        href="tel:01037825418"
        className="inline-flex h-14 items-center justify-center rounded-lg bg-indigo-600 px-7 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md sm:text-[17px]"
      >
        전화로 견적 받기 · 010-3782-5418
      </a>

      <Link
        href="/"
        className="text-sm font-medium text-gray-500 hover:text-gray-900"
      >
        ← 처음으로 돌아가기
      </Link>
    </main>
  )
}
