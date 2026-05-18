import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/admin/auth'
import { LogoutButton } from './LogoutButton'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default function AdminHome() {
  requireAdmin('/admin')
  return (
    <section className="mx-auto max-w-6xl px-6 py-10 sm:px-8 sm:py-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
            EasySite Admin
          </p>
          <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            인증 OK
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            로그인 흐름 검증용 임시 페이지예요. 개요·리드·통계는 다음 단계에서
            추가됩니다.
          </p>
        </div>
        <LogoutButton />
      </div>
    </section>
  )
}
