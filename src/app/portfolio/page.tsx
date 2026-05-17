import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '포트폴리오 — EasySite',
  description: '프리즘이 운영 중인 사이트들.',
}

const sites: { host: string; url: string }[] = [
  { host: 'prismedu.kr', url: 'https://prismedu.kr' },
  { host: 'conatusipsi.com', url: 'https://conatusipsi.com' },
  { host: 'digitalst.kr', url: 'https://digitalst.kr' },
  { host: 'pscp.to', url: 'https://pscp.to' },
]

export default function PortfolioPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
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
          상세한 설명과 화면 캡처는 곧 추가됩니다. 우선 직접 방문해서
          확인해보세요.
        </p>
      </div>

      <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sites.map((site) => (
          <li key={site.host}>
            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white px-6 py-5 transition hover:border-indigo-300 hover:shadow-md"
            >
              <span className="text-base font-semibold text-gray-900 sm:text-lg">
                {site.host}
              </span>
              <span
                aria-hidden="true"
                className="ml-4 text-gray-400 transition group-hover:text-indigo-600"
              >
                사이트 방문 →
              </span>
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
