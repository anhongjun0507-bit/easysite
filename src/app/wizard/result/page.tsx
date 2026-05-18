import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '견적 요청 접수',
  description: '곧 카톡으로 견적이랑 미리보기 보내드릴게요.',
  robots: { index: false, follow: false },
}

function pickFirst(raw: string | string[] | undefined): string | undefined {
  return Array.isArray(raw) ? raw[0] : raw
}

export default function WizardResultPage({
  searchParams,
}: {
  searchParams: { leadId?: string | string[] }
}) {
  const leadId = pickFirst(searchParams.leadId) ?? ''

  return (
    <section className="mx-auto flex min-h-[100dvh] max-w-2xl flex-col items-center justify-center px-6 py-12">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white shadow-brand">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8"
          aria-hidden="true"
        >
          <path d="M5 12l5 5L20 7" />
        </svg>
      </div>

      <h1
        className="mt-6 text-center font-extrabold text-gray-900"
        style={{
          fontSize: 'clamp(28px, 5vw, 40px)',
          lineHeight: 1.22,
          letterSpacing: '-0.02em',
        }}
      >
        잘 받았어요!
      </h1>
      <p className="mt-4 max-w-md text-center text-base leading-relaxed text-gray-700 sm:text-lg">
        <strong className="font-semibold text-gray-900">영업일 24시간</strong>{' '}
        안에 카톡으로 견적이랑 사이트 미리보기 보내드릴게요.
      </p>

      <div className="mt-10 w-full max-w-md space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-md">
        <Row icon="📩">
          저희가 답변을 준비하는 동안 잠시만 기다려주세요
        </Row>
        <Row icon="📞">
          급하시면 010-3782-5418로 전화 한 통 주셔도 좋아요
        </Row>
        <Row icon="✨">곧 더 자세한 결과 페이지로 업그레이드돼요 (개발 중)</Row>
      </div>

      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 text-sm font-semibold text-gray-800 transition hover:border-gray-400"
        >
          홈으로
        </Link>
        <a
          href="tel:01037825418"
          className="inline-flex h-12 items-center justify-center rounded-lg bg-gray-900 px-6 text-sm font-semibold text-white transition hover:bg-gray-700"
        >
          전화로 직접 문의 (010-3782-5418)
        </a>
      </div>

      {leadId && (
        <p className="mt-8 text-center text-xs text-gray-400">
          접수번호 <code className="rounded bg-gray-100 px-1.5 py-0.5">{leadId.slice(0, 8)}</code>
        </p>
      )}
    </section>
  )
}

function Row({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span
        aria-hidden="true"
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-base"
      >
        {icon}
      </span>
      <p className="flex-1 pt-1 text-sm leading-relaxed text-gray-700">
        {children}
      </p>
    </div>
  )
}
