import Link from 'next/link'

// 사장님 사양 순서: 상호 → 대표 → 사업자번호 → 소재지 → 연락처 → 이메일 → 세금계산서
// 입금계좌는 푸터 노출 X (견적서·계약서에서만 노출 — 분쟁 방지)
const businessInfo: { label: string; value: string; href?: string }[] = [
  { label: '상호', value: '프리즘' },
  { label: '대표', value: '안홍준' },
  { label: '사업자등록번호', value: '672-35-01596' },
  { label: '소재지', value: '경기도 의정부시' },
  { label: '연락처', value: '010-3782-5418', href: 'tel:01037825418' },
  { label: '이메일', value: 'hjan040507@gmail.com', href: 'mailto:hjan040507@gmail.com' },
  { label: '세금계산서', value: '발행 가능 (부가세 별도)' },
]

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12 md:grid-cols-[1fr_auto]">
          <div>
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-white"
            >
              지으리
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-300">
              아이디어만 있으면 됩니다.
              <br />
              나머지는 AI가 채워드립니다.
            </p>
          </div>

          <address className="not-italic">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
              사업자 정보
            </p>
            <dl className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-1.5 text-sm leading-relaxed sm:gap-x-6">
              {businessInfo.map((item) => (
                <div key={item.label} className="contents">
                  <dt className="text-gray-400">{item.label}</dt>
                  <dd className="break-words text-gray-100">
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

        {/* Legal links — 실제 경로 (P0-04 fix) */}
        <div className="mt-12 flex flex-col gap-1 border-t border-gray-800 pt-4 text-[13px] sm:mt-14 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <Link
              href="/terms"
              className="inline-flex h-11 items-center px-1 text-gray-300 transition hover:text-white"
            >
              이용약관
            </Link>
            <Link
              href="/privacy"
              className="inline-flex h-11 items-center px-1 text-gray-300 transition hover:text-white"
            >
              개인정보처리방침
            </Link>
          </div>
          <p className="text-gray-400">
            © 2026 지으리. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
