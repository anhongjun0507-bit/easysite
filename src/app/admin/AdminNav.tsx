'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, type ReactNode } from 'react'

export function AdminNav() {
  const pathname = usePathname() ?? ''
  const router = useRouter()
  const [pending, setPending] = useState(false)

  if (pathname.startsWith('/admin/login')) return null

  const logout = async () => {
    if (pending) return
    setPending(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } finally {
      router.replace('/admin/login')
      router.refresh()
    }
  }

  const isOverview = pathname === '/admin'
  const isLeads = pathname.startsWith('/admin/leads')

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <div className="flex items-center gap-1">
          <Link
            href="/admin"
            className="mr-2 text-base font-bold tracking-tight text-gray-900 sm:mr-4 sm:text-lg"
          >
            지으리 Admin
          </Link>
          <NavLink href="/admin" active={isOverview}>
            개요
          </NavLink>
          <NavLink href="/admin/leads" active={isLeads}>
            리드
          </NavLink>
        </div>
        <button
          type="button"
          onClick={logout}
          disabled={pending}
          className="inline-flex h-9 items-center rounded-md border border-gray-300 bg-white px-3 text-xs font-semibold text-gray-700 transition hover:border-gray-400 hover:text-gray-900 disabled:opacity-60 sm:h-10 sm:px-4 sm:text-sm"
        >
          {pending ? '나가는 중…' : '로그아웃'}
        </button>
      </div>
    </header>
  )
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`inline-flex h-9 items-center rounded-md px-3 text-sm font-medium transition ${
        active
          ? 'bg-gray-900 text-white'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {children}
    </Link>
  )
}
