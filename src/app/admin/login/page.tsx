import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { isAdminSessionValid } from '@/lib/admin/auth'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = {
  title: 'Admin 로그인',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { next?: string | string[] }
}) {
  if (isAdminSessionValid()) {
    redirect('/admin')
  }
  const next = Array.isArray(searchParams.next) ? searchParams.next[0] : searchParams.next
  const safeNext = typeof next === 'string' && next.startsWith('/admin') ? next : '/admin'
  return (
    <section className="mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center px-6 py-12">
      <div className="w-full">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
          지으리 Admin
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900">
          운영자 로그인
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          본인만 접근 가능한 페이지예요.
        </p>
        <div className="mt-8">
          <LoginForm next={safeNext} />
        </div>
      </div>
    </section>
  )
}
