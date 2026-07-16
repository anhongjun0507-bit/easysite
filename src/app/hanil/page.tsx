import Link from 'next/link'
import { COMPANY } from './_content'

const OPTIONS = [
  {
    key: 'A',
    href: '/hanil/a',
    name: 'Deep Navy Tech',
    concept: '딥네이비 다크 베이스에 풀스크린 히어로 크로스페이드로 완성한 프리미엄 제조 기술 톤',
    swatch: ['#0B1B33', '#12294a', '#6f8bb3'],
  },
  {
    key: 'B',
    href: '/hanil/b',
    name: 'Light Corporate',
    concept: '화이트·라이트그레이에 네이비 포인트로 여백을 살린 정제된 대기업 톤',
    swatch: ['#ffffff', '#eef1f6', '#1e3a63'],
  },
  {
    key: 'C',
    href: '/hanil/c',
    name: 'Industrial Hybrid',
    concept: '다크 히어로에 라이트 본문, 딥버건디 포인트로 숫자를 말하는 인더스트리얼 톤',
    swatch: ['#1a1a1e', '#f4f2ef', '#6B1F2E'],
  },
] as const

export default function HanilIndexPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900" style={{ wordBreak: 'keep-all' }}>
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <header className="border-b border-neutral-200 pb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">Design Proposal</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{COMPANY.nameKo} 홈페이지 시안</h1>
          <p className="mt-3 text-[15px] leading-relaxed text-neutral-500">
            {COMPANY.nameEn} · {COMPANY.slogan}
          </p>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-neutral-600">
            같은 콘텐츠를 세 가지 방향으로 구성했습니다. 카드를 눌러 각 시안의 홈, 회사소개(대표인사말),
            제품 상세(ISONITE TF1)까지 실제 화면으로 확인해 주세요.
          </p>
        </header>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {OPTIONS.map((o) => (
            <li key={o.key}>
              <Link
                href={o.href}
                className="group flex h-full flex-col rounded-lg border border-neutral-200 bg-white p-6 transition hover:-translate-y-1 hover:border-neutral-900/20 hover:shadow-[0_20px_40px_-24px_rgba(0,0,0,0.35)]"
              >
                <div className="flex items-center gap-2">
                  {o.swatch.map((c) => (
                    <span
                      key={c}
                      className="h-6 w-6 rounded-full ring-1 ring-inset ring-black/10"
                      style={{ background: c }}
                      aria-hidden
                    />
                  ))}
                </div>
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">시안 {o.key}</p>
                <h2 className="mt-1 text-xl font-bold tracking-tight">{o.name}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-600">{o.concept}</p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-neutral-900">
                  시안 보기
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="transition-transform group-hover:translate-x-1">
                    <path d="M3 8h9M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <footer className="mt-16 border-t border-neutral-200 pt-8 text-xs leading-relaxed text-neutral-400">
          검토용 비공개 시안입니다(검색 노출 차단). 문구·이미지는 임시이며 확정 원고로 교체됩니다.
          <br />
          {COMPANY.addr} · TEL {COMPANY.tel}
        </footer>
      </div>
    </main>
  )
}
