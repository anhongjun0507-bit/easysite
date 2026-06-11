import type { Metadata } from 'next'
import Link from 'next/link'
import { ConsultForm } from './ConsultForm'

export const metadata: Metadata = {
  title: '바로 상담 신청',
  description:
    '연락처만 남기시면 영업일 24시간 안에 안홍준 대표가 직접 연락드려요. 위저드 없이 바로 상담.',
  // 상담 폼은 funnel 페이지라 색인 안 시킴 (링크·CTA 로만 진입).
  robots: { index: false, follow: false },
}

const trust = [
  { label: '숨고 평점', value: '5.0' },
  { label: '직접 만든 사이트', value: '9곳' },
  { label: '사업자등록', value: '완료' },
]

export default function ConsultPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-14 sm:py-20">
      <div className="text-center">
        <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-semibold text-gray-700">
          <span
            aria-hidden="true"
            className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-indigo-500"
          />
          바로 상담
        </span>
        <h1 className="mt-6 text-3xl font-extrabold leading-[1.2] tracking-[-0.02em] text-gray-900 sm:text-4xl">
          어렵게 생각 안 하셔도 돼요
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-gray-600 sm:text-lg">
          연락처만 주시면 제가 직접 연락드려서, 뭐가 필요한지부터 같이
          정리해드릴게요. 글 쓸 필요도, 미리 준비하실 것도 없어요.
        </p>
      </div>

      {/* 신뢰 바 */}
      <dl className="mt-8 grid grid-cols-3 gap-3">
        {trust.map((t) => (
          <div
            key={t.label}
            className="rounded-xl border border-gray-200 bg-white px-3 py-4 text-center"
          >
            <dt className="text-xs font-medium text-gray-500">{t.label}</dt>
            <dd className="mt-1 text-lg font-bold text-gray-900">{t.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50/60 p-6 sm:p-7">
        <ConsultForm />
      </div>

      <div className="mt-8 text-center text-sm text-gray-600">
        <p>
          아직 둘러보는 중이라면{' '}
          <Link
            href="/portfolio"
            className="font-semibold text-indigo-700 underline underline-offset-4 hover:text-indigo-900"
          >
            만든 사이트 9곳
          </Link>{' '}
          먼저 보셔도 돼요.
        </p>
        <p className="mt-2">
          견적부터 받아보고 싶으시면{' '}
          <Link
            href="/wizard"
            className="font-semibold text-gray-700 underline underline-offset-4 hover:text-gray-900"
          >
            1분 위저드
          </Link>
          도 있어요.
        </p>
      </div>
    </main>
  )
}
