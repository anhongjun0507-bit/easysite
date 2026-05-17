import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16">
        {/* Top: Brand + Business info */}
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between sm:gap-12">
          <div>
            <Link href="/" className="text-xl font-bold text-white">
              EasySite
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-400">
              아이디어만 있으면 됩니다.
              <br />
              나머지는 AI가 채워드립니다.
            </p>
          </div>

          <address className="not-italic text-sm leading-relaxed text-gray-400 sm:text-right">
            <p className="font-semibold text-gray-200">프리즘</p>
            <p className="mt-1">사업자등록번호 672-35-01596</p>
            <p>대표 안홍준</p>
            <p>
              <a
                href="tel:01037825418"
                className="transition hover:text-white"
              >
                010-3782-5418
              </a>
            </p>
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
