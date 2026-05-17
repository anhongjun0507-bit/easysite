import type { Metadata } from 'next'
import { WizardForm } from './WizardForm'

export const metadata: Metadata = {
  title: '1분 만에 견적 받기',
  description:
    '간단히 입력하시면 영업일 24시간 안에 견적이랑 사이트 미리보기를 카톡으로 보내드려요.',
}

function parseIntent(raw: string | string[] | undefined): string {
  const value = Array.isArray(raw) ? raw[0] : raw
  return (value ?? '').trim().slice(0, 200)
}

export default function WizardPage({
  searchParams,
}: {
  searchParams: { intent?: string | string[] }
}) {
  const intent = parseIntent(searchParams.intent)

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
          1분 견적
        </p>
        <h1 className="mt-3 text-4xl font-extrabold leading-[1.2] tracking-[-0.02em] text-gray-900 sm:text-5xl">
          어떤 사이트가 필요하세요?
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-700 sm:text-lg">
          간단히만 적어주세요. <strong className="font-semibold text-gray-900">영업일 24시간 안에</strong>{' '}
          견적이랑 사이트 미리보기를 보내드릴게요.
        </p>
      </div>

      <div className="mt-12 sm:mt-14">
        <WizardForm initialIntent={intent} />
      </div>

      {/* Fallback — 전화·이메일 직접 연락 (50~60대 사장님 친화) */}
      <div className="mt-14 border-t border-gray-200 pt-10 sm:mt-16">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-sm font-semibold text-gray-900">
            폼 작성이 번거로우세요?
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            전화 한 통으로도 견적 받으실 수 있어요.
            <br />
            평일 9시~19시, 그 외 시간엔 문자·카톡 남겨주시면 빨리 연락드릴게요.
          </p>
          <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="tel:01037825418"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 text-sm font-semibold text-gray-800 transition hover:border-gray-400 hover:text-gray-900"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              010-3782-5418
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
