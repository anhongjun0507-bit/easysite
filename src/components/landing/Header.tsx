import Link from 'next/link'

export function Header() {
  return (
    <header className="relative z-10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-8 sm:py-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-gray-900 sm:text-xl"
        >
          EasySite
        </Link>
        <Link
          href="/wizard"
          className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-gray-900 sm:px-4 sm:text-[15px]"
        >
          견적 받기
        </Link>
      </nav>
    </header>
  )
}
