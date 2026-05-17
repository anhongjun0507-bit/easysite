import Link from 'next/link'

const businessInfo: { label: string; value: string; href?: string }[] = [
  { label: '상호', value: '프리즘' },
  { label: '사업자등록번호', value: '672-35-01596' },
  { label: '대표', value: '안홍준' },
  { label: '연락처', value: '010-3782-5418', href: 'tel:01037825418' },
]

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-16">
        {/* Top: Brand + Business info */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12 md:grid-cols-[1fr_auto]">
          {/* Left: Brand */}
          <div>
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-white"
            >
              EasySite
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-400">
              아이디어만 있으면 됩니다.
              <br />
              나머지는 AI가 채워드립니다.
            </p>
          </div>

          {/* Right: Business info — label/value 정렬된 2-column */}
          <address className="not-italic">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
              사업자 정보
            </p>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 text-sm leading-relaxed sm:gap-x-6">
              {businessInfo.map((item) => (
                <div key={item.label} className="contents">
                  <dt className="text-gray-500">{item.label}</dt>
                  <dd className="text-gray-200">
                    {item.href ? (
                      <a
                        href={item.href}
                        className="transition hover:text-white"
                      >
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </address>
        </div>

        {/* Bottom: legal + copyright */}
        <div className="mt-12 flex flex-col gap-3 border-t border-gray-800 pt-6 text-xs sm:mt-14 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-5">
            <Link
              href="#"
              className="transition hover:text-gray-300"
              aria-disabled="true"
            >
              이용약관
            </Link>
            <Link
              href="#"
              className="transition hover:text-gray-300"
              aria-disabled="true"
            >
              개인정보처리방침
            </Link>
          </div>
          <p className="text-gray-500">
            © 2026 EasySite. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
