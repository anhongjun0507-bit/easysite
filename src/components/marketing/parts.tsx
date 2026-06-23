// 광고 전용 랜딩(/lp) 공용 파트 — 서버 컴포넌트.
// 단일 목표(견적/상담)에 집중하기 위해 외부로 새는 링크는 최소화한다.
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check, Phone, Star } from 'lucide-react'

/** 메인/보조/전화 CTA 묶음 — 히어로·하단에서 재사용 */
export function CtaGroup({
  primary,
  secondary,
  align = 'start',
}: {
  primary: { href: string; label: string }
  secondary?: { href: string; label: string }
  align?: 'start' | 'center'
}) {
  return (
    <div
      className={`flex flex-col gap-2.5 sm:flex-row sm:flex-wrap ${
        align === 'center' ? 'sm:justify-center' : 'lg:justify-start'
      }`}
    >
      <Link
        href={primary.href}
        className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 text-[16px] font-bold text-white shadow-[0_10px_30px_-10px_rgba(79,70,229,0.6)] transition hover:-translate-y-0.5 hover:bg-indigo-700 active:translate-y-0 sm:w-auto sm:text-[17px]"
      >
        {primary.label}
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
      </Link>
      {secondary && (
        <Link
          href={secondary.href}
          className="inline-flex h-14 w-full items-center justify-center gap-1.5 rounded-xl border border-gray-300 bg-white px-6 text-[15px] font-bold text-gray-700 transition hover:-translate-y-0.5 hover:border-gray-400 hover:text-gray-900 sm:w-auto sm:text-[16px]"
        >
          {secondary.label}
        </Link>
      )}
      <a
        href="tel:01037825418"
        className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 text-[15px] font-bold text-gray-700 transition hover:-translate-y-0.5 hover:border-gray-400 hover:text-gray-900 sm:w-auto sm:text-[16px]"
      >
        <Phone className="h-4 w-4" strokeWidth={2.4} />
        전화 문의
      </a>
    </div>
  )
}

/** 숨고 평점 5.0 신뢰 배지 */
export function TrustBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/70 bg-amber-50 px-3.5 py-1.5">
      <span className="flex gap-0.5 text-amber-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
        ))}
      </span>
      <span className="text-[13px] font-bold text-amber-900">숨고 평점 5.0</span>
    </div>
  )
}

export type LpCase = { image: string; label: string; alt: string }

/** 실제 제작 사례 그리드 (모바일 2열) */
export function CasesGrid({ items }: { items: LpCase[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
      {items.map((c) => (
        <figure
          key={c.image}
          className="group overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs transition hover:-translate-y-1 hover:shadow-[0_18px_44px_-26px_rgba(17,24,39,0.35)]"
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-gray-50">
            <Image
              src={c.image}
              alt={c.alt}
              fill
              sizes="(min-width: 640px) 25vw, 50vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.06]"
            />
          </div>
          <figcaption className="px-3 py-3 text-center">
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
              {c.label}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

export type LpStep = { title: string; desc: string }

/** 작동 방식 3스텝 */
export function StepsRow({ steps }: { steps: LpStep[] }) {
  return (
    <ol className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
      {steps.map((step, i) => (
        <li key={step.title} className="flex flex-col items-center text-center sm:items-start sm:text-left">
          <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white text-indigo-600 shadow-xs">
            <span className="text-lg font-extrabold">{i + 1}</span>
          </span>
          <h3 className="mt-5 text-[17px] font-bold text-gray-900">{step.title}</h3>
          <p className="mt-1.5 text-[15px] leading-relaxed text-gray-600">{step.desc}</p>
        </li>
      ))}
    </ol>
  )
}

export type LpPrice = { label: string; price: string; note: string }

/** 가격 투명성 카드 — 이벤트가 기준 ballpark */
export function PriceTable({ rows }: { rows: LpPrice[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex flex-col rounded-2xl border border-gray-200/80 bg-white p-5 text-center"
        >
          <span className="text-[14px] font-semibold text-gray-500">{r.label}</span>
          <span className="mt-2 text-[22px] font-extrabold tracking-tight text-gray-900">
            {r.price}
          </span>
          <span className="mt-1 text-[12.5px] text-gray-500">{r.note}</span>
        </div>
      ))}
    </div>
  )
}

export type LpFaq = { q: string; a: string }

/** FAQ — 네이티브 <details> 아코디언(클라이언트 JS 불필요) */
export function FaqList({ items }: { items: LpFaq[] }) {
  return (
    <div className="mx-auto max-w-2xl divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200/80 bg-white">
      {items.map((f) => (
        <details key={f.q} className="group px-5 py-4 sm:px-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[15.5px] font-bold text-gray-900">
            {f.q}
            <span className="text-gray-400 transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 text-[15px] leading-relaxed text-gray-600">{f.a}</p>
        </details>
      ))}
    </div>
  )
}

/** 신뢰 포인트 3개 (체크 리스트) */
export function CheckPoints({ points }: { points: string[] }) {
  return (
    <ul className="mx-auto flex max-w-xl flex-col gap-2.5 text-left">
      {points.map((p) => (
        <li key={p} className="flex items-start gap-2.5">
          <Check className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" strokeWidth={2.6} />
          <span className="text-[15.5px] font-medium text-gray-800">{p}</span>
        </li>
      ))}
    </ul>
  )
}

/** 모바일 하단 고정 CTA 바 (데스크톱 숨김) — 항상 노출, JS 불필요 */
export function StickyBar({ href, label }: { href: string; label: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 p-3 backdrop-blur sm:hidden">
      <div className="flex gap-2">
        <a
          href="tel:01037825418"
          aria-label="전화 문의"
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gray-300 text-gray-700"
        >
          <Phone className="h-5 w-5" strokeWidth={2.4} />
        </a>
        <Link
          href={href}
          className="inline-flex h-12 flex-1 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 text-[15px] font-bold text-white"
        >
          {label}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
