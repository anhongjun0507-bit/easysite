import { ISONITE_TF1 as P, IMG, COMPANY } from '../_content'
import { Reveal } from './Reveal'

type Variant = 'a' | 'b' | 'c'

const T: Record<
  Variant,
  {
    heroOverlay: string
    eyebrow: string
    body: string
    h: string
    lead: string
    card: string
    accent: string
    chip: string
    cta: string
    ctaText: string
    btn: string
    rule: string
    muted: string
  }
> = {
  a: {
    heroOverlay: 'from-[#0B1B33]/80 via-[#0B1B33]/85 to-[#0B1B33]',
    eyebrow: 'text-[#8fb0da]',
    body: 'bg-[#0B1B33] text-neutral-300',
    h: 'text-white',
    lead: 'text-neutral-200',
    card: 'border-white/10 bg-white/[0.03]',
    accent: 'text-[#8fb0da]',
    chip: 'border-white/15 bg-white/5 text-neutral-100',
    cta: 'bg-[#12294a]',
    ctaText: 'text-neutral-300',
    btn: 'bg-[#6f8bb3] text-[#0B1B33] hover:bg-[#8fb0da]',
    rule: 'border-white/10',
    muted: 'text-neutral-400',
  },
  b: {
    heroOverlay: 'from-[#12233d]/80 via-[#12233d]/85 to-[#12233d]/95',
    eyebrow: 'text-[#9ab6e0]',
    body: 'bg-white text-neutral-600',
    h: 'text-neutral-900',
    lead: 'text-neutral-700',
    card: 'border-neutral-200 bg-white',
    accent: 'text-[#1e3a63]',
    chip: 'border-neutral-200 bg-neutral-50 text-neutral-700',
    cta: 'bg-[#f3f6fb]',
    ctaText: 'text-neutral-600',
    btn: 'bg-[#1e3a63] text-white hover:bg-[#16304f]',
    rule: 'border-neutral-200',
    muted: 'text-neutral-500',
  },
  c: {
    heroOverlay: 'from-neutral-950/75 via-neutral-950/85 to-neutral-950/95',
    eyebrow: 'text-[#e6b8bf]',
    body: 'bg-[#f6f4f1] text-neutral-700',
    h: 'text-neutral-900',
    lead: 'text-neutral-700',
    card: 'border-neutral-200 bg-white',
    accent: 'text-[#6B1F2E]',
    chip: 'border-[#6B1F2E]/25 bg-[#6B1F2E]/[0.06] text-[#6B1F2E]',
    cta: 'bg-neutral-900',
    ctaText: 'text-neutral-300',
    btn: 'bg-[#6B1F2E] text-white hover:bg-[#571825]',
    rule: 'border-white/10',
    muted: 'text-neutral-500',
  },
}

export function IsoniteBody({ variant }: { variant: Variant }) {
  const t = T[variant]
  return (
    <>
      {/* 서브 히어로 */}
      <section className="relative flex min-h-[62vh] items-end overflow-hidden pt-24">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMG.circuit} alt="정밀 부품 표면처리" className="absolute inset-0 h-full w-full object-cover" loading="eager" decoding="async" />
        <div className={`absolute inset-0 bg-gradient-to-b ${t.heroOverlay}`} aria-hidden />
        <div className="relative mx-auto w-full max-w-7xl px-6 pb-14 sm:px-8">
          <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${t.eyebrow}`}>{P.category}</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">{P.code}</h1>
          <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-white/60">{P.en}</p>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-snug text-white/90 sm:text-2xl">{P.headline}</p>
        </div>
      </section>

      {/* 본문 */}
      <div className={t.body}>
        {/* 정의 */}
        <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
            <Reveal>
              <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${t.accent}`}>Definition</p>
              <h2 className={`mt-3 text-2xl font-bold leading-snug sm:text-3xl ${t.h}`}>공정 정의</h2>
            </Reveal>
            <Reveal delay={80}>
              <p className={`text-lg font-semibold leading-relaxed ${t.lead}`}>{P.intro}</p>
              <p className="mt-5 text-[15px] leading-relaxed">{P.definition}</p>
            </Reveal>
          </div>
        </section>

        {/* 특징 4 */}
        <section className={`border-t ${t.rule}`}>
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-24">
            <Reveal>
              <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${t.accent}`}>Features</p>
              <h2 className={`mt-3 text-2xl font-bold sm:text-3xl ${t.h}`}>핵심 특징 4가지</h2>
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {P.features.map((f, i) => (
                <Reveal key={f.title} delay={i * 70}>
                  <div className={`h-full rounded-md border p-7 ${t.card}`}>
                    <span className={`text-sm font-bold tabular-nums ${t.accent}`}>{String(i + 1).padStart(2, '0')}</span>
                    <h3 className={`mt-3 text-lg font-bold ${t.h}`}>{f.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed">{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 적용 분야 */}
        <section className={`border-t ${t.rule}`}>
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 sm:px-8 sm:py-24 md:grid-cols-2 md:items-center md:gap-16">
            <Reveal>
              <div className="overflow-hidden rounded-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMG.autoline} alt="자동차 부품 표면처리 적용 라인" className="aspect-[4/3] w-full object-cover" loading="lazy" decoding="async" />
              </div>
            </Reveal>
            <Reveal delay={80}>
              <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${t.accent}`}>Applications</p>
              <h2 className={`mt-3 text-2xl font-bold sm:text-3xl ${t.h}`}>적용 분야</h2>
              <p className="mt-4 text-[15px] leading-relaxed">
                반복 하중과 마모에 노출되는 정밀 구동 부품에 폭넓게 적용됩니다.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {P.applications.map((a) => (
                  <li key={a} className={`rounded border px-3.5 py-2 text-[13px] font-semibold ${t.chip}`}>
                    {a}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* 문의 CTA */}
        <section className={t.cta}>
          <div className="mx-auto max-w-7xl px-6 py-20 text-center sm:px-8">
            <h2 className={`text-2xl font-bold sm:text-3xl ${variant === 'a' ? 'text-white' : variant === 'c' ? 'text-white' : t.h}`}>
              부품 사양에 맞는 표면처리, 상담부터 시작하세요
            </h2>
            <p className={`mx-auto mt-4 max-w-xl text-[15px] leading-relaxed ${t.ctaText}`}>
              도면과 요구 물성을 알려주시면 최적 공정을 제안드립니다.
            </p>
            <a
              href={COMPANY.telHref}
              className={`mt-8 inline-flex h-12 items-center rounded px-7 text-sm font-bold transition ${t.btn}`}
            >
              전화 문의 {COMPANY.tel}
            </a>
          </div>
        </section>
      </div>
    </>
  )
}
