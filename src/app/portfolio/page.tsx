import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { portfolio } from '@/config/portfolio'

export const metadata: Metadata = {
  title: '포트폴리오',
  description:
    '프리즘 안홍준 대표가 직접 만든 사이트 9건. 교육·쇼핑몰·회사소개·건축·인쇄·시설관리·힐링 등 다양한 분야의 실제 운영 사례를 확인하세요.',
  alternates: { canonical: '/portfolio' },
  openGraph: {
    title: '포트폴리오 | 지으리',
    description:
      '프리즘 안홍준 대표가 직접 만든 사이트 9건. 교육·쇼핑몰·회사소개·건축·인쇄·시설관리·힐링 등 다양한 분야의 실제 운영 사례를 확인하세요.',
    url: '/portfolio',
  },
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
          모두 프리즘이 직접 설계·개발한 사이트예요. 카드를 누르면 실제 운영
          중인 화면으로 이동합니다.
        </p>
      </div>

      <ul className="mt-12 grid grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6">
        {portfolio.map((site, idx) => {
          // P2-11: 첫 2장은 above-the-fold — priority 로 LCP 개선 + 회색 박스 제거
          const aboveFold = idx < 2
          return (
            <li key={site.id}>
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-200 ease-emphasized hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
              >
                {/* Thumbnail — 16:10 */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-50">
                  <Image
                    src={site.image}
                    alt={site.imageAlt}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top transition duration-300 ease-emphasized group-hover:scale-[1.02]"
                    {...(aboveFold
                      ? { priority: true }
                      : { loading: 'lazy' as const })}
                  />
                </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                    {site.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 transition group-hover:text-indigo-600">
                    방문
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3"
                      aria-hidden="true"
                    >
                      <path d="M6 3h7v7" />
                      <path d="M13 3 5 11" />
                      <path d="M11 13H3V5" />
                    </svg>
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
                  <div className="text-xs font-medium text-gray-500">
                    {hostnameOf(site.url)}
                  </div>
                </div>
              </div>
              </a>
            </li>
          )
        })}
      </ul>

      <div className="mt-16 text-center">
        <Link
          href="/wizard"
          className="cta-glow inline-flex h-14 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-indigo-600 px-7 text-base font-semibold text-white hover:bg-indigo-700 sm:text-[17px]"
        >
          <span>내 사이트도 1분 만에 견적 받기</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="13 6 19 12 13 18" />
          </svg>
        </Link>
        <p className="mt-4 text-sm text-gray-600">
          이런 사이트, 사장님도 만들고 싶으세요?{' '}
          <Link
            href="/consult"
            className="font-semibold text-indigo-700 underline underline-offset-4 hover:text-indigo-900"
          >
            바로 상담 신청하기 →
          </Link>
        </p>
        <div className="mt-4">
          <Link
            href="/"
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            처음으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  )
}
