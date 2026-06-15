import type { Metadata } from 'next'
import { AdminNav } from './AdminNav'

export const metadata: Metadata = {
  title: '지으리 Admin',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-gray-50">
      <AdminNav />
      {children}
    </div>
  )
}
