import Link from 'next/link'

const navLinks = [
  { href: '/#solutions', label: '차별점' },
  { href: '/#how-it-works', label: '제작 과정' },
  { href: '/portfolio', label: '포트폴리오' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/60 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 sm:px-8 sm:py-5">
        <Link
          href="/"
          className="shrink-0 text-lg font-bold tracking-tight text-gray-900 sm:text-xl"
        >
          EasySite
        </Link>

        {/* Section nav — sm+ only; mobile keeps minimal */}
        <ul className="hidden items-center gap-6 sm:flex md:gap-7">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/wizard"
          className="shrink-0 rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-gray-700 sm:px-4 sm:text-[15px]"
        >
          견적 받기
        </Link>
      </nav>
    </header>
  )
}
