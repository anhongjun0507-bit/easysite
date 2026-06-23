import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import { Star } from 'lucide-react'
import { RegisterForm } from '@/app/jieuri/RegisterForm'

const TITLE = '사전등록 — 평생 50% 할인 | 지으리'
const DESCRIPTION =
  '지으리 사전등록. 선착순 100명 평생 50% 할인. 몇 가지만 답하면 끝 — 출시되면 가장 먼저 알려드려요.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/register` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/register`,
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function RegisterPage() {
  return (
    <div className="bg-gray-50/70">
      <div className="mx-auto max-w-xl px-6 py-14 sm:py-20">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/70 bg-white px-3.5 py-1.5 text-[13px] font-semibold text-indigo-700 shadow-sm">
            곧 출시 · 선착순 100명
          </span>
          <h1 className="mt-5 text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-gray-900 sm:text-[38px]">
            사전등록하고 <span className="text-gradient">평생 50% 할인</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[16px] leading-relaxed text-gray-600">
            선착순 100명만 모셔요. 몇 가지만 답해주시면 끝 — 출시되면 가장 먼저 알려드릴게요.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[13px] font-bold text-gray-700">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 ring-1 ring-gray-200">
              <span className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3" fill="currentColor" strokeWidth={0} />
                ))}
              </span>
              숨고 5.0
            </span>
            <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-gray-200">제작 100건+</span>
            <span className="rounded-full bg-white px-3 py-1.5 ring-1 ring-gray-200">현직 개발자 직접</span>
          </div>
        </div>

        <div className="mt-9 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(17,24,39,0.4)] sm:p-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
