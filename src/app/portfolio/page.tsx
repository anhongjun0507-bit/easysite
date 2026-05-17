import Link from 'next/link'
import type { Metadata } from 'next'
import { portfolio } from '@/config/portfolio'

export const metadata: Metadata = {
  title: '포트폴리오 — EasySite',
  description: '프리즘이 실제로 만들어 운영 중인 사이트들.',
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, '')
  } catch {
    return url
  }
}

export default function PortfolioPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <div className="text-center">
        <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-semibold text-gray-700">
          <span
            aria-hidden="true"
            className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-indigo-500"
          />
          실제 운영 중
        </span>
        <h1 className="mt-6 text-3xl font-extrabold leading-[1.2] tracking-[-0.02em] text-gray-900 sm:text-4xl md:text-5xl">
          이미 만들어 운영 중인 사이트들
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
          상세한 설명과 화면 캡처는 곧 추가됩니다. 우선 카드를 눌러 직접
          방문해보세요.
        </p>
      </div>

      <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {portfolio.map((site) => (
          <li key={site.id}>
            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 transition hover:border-indigo-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  {site.category}
                </span>
                <span
                  aria-hidden="true"
                  className="text-sm font-medium text-gray-400 transition group-hover:text-indigo-600"
                >
                  방문 →
                </span>
              </div>

              <h2 className="mt-4 text-lg font-bold text-gray-900 sm:text-xl">
                {site.name}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">
                {site.description}
              </p>

              <div className="mt-auto pt-4">
                {site.tech_stack.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {site.tech_stack.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="text-xs font-medium text-gray-400">
                  {hostnameOf(site.url)}
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-16 text-center">
        <Link
          href="/wizard"
          className="inline-flex h-14 items-center justify-center rounded-lg bg-indigo-600 px-7 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md sm:text-[17px]"
        >
          내 사이트도 견적 받아보기 →
        </Link>
        <div className="mt-4">
          <Link
            href="/"
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            ← 처음으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  )
}
