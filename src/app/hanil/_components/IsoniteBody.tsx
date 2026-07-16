import { ISONITE_TF1 as P, IMG, COMPANY } from '../_content'
import { Reveal } from './Reveal'
import { txt as TY, layout } from './_ui'

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
    bar: string
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
    lead: 'text-neutral-100',
    card: 'border-white/10 bg-white/[0.03] hover:border-white/25',
    accent: 'text-[#8fb0da]',
    bar: 'bg-[#6f8bb3]',
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
    card: 'border-neutral-200 bg-white hover:border-[#1e3a63]/30',
    accent: 'text-[#1e3a63]',
    bar: 'bg-[#1e3a63]',
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
    card: 'border-neutral-200 bg-white hover:border-[#6B1F2E]/30',
    accent: 'text-[#6B1F2E]',
    bar: 'bg-[#6B1F2E]',
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
  const featuredNames: readonly string[] = P.applicationsFeatured.map((f) => f.name)
  const restApplications = P.applications.filter((a) => !featuredNames.includes(a))
  return (
    <>
      {/* 서브 히어로 */}
      <section className="relative flex min-h-[62vh] items-end overflow-hidden pt-24">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMG.circuit} alt="정밀 부품 표면처리" className="absolute inset-0 h-full w-full object-cover" loading="eager" decoding="async" />
        <div className={`absolute inset-0 bg-gradient-to-b ${t.heroOverlay}`} aria-hidden />
        <div className={`relative ${layout.container} pb-16`}>
          <p className={`${TY.eyebrow} ${t.eyebrow}`}>{P.category}</p>
          <h1 className={`mt-5 ${TY.display} text-white`}>{P.code}</h1>
          <p className="mt-3 text-sm font-medium uppercase tracking-[0.2em] text-white/60">{P.en}</p>
          <p className="mt-6 max-w-2xl text-lg font-medium leading-snug text-white/90 sm:text-2xl">{P.headline}</p>
        </div>
      </section>

      {/* 본문 */}
      <div className={t.body}>
        {/* 정의 + pull-quote */}
        <section className={`${layout.container} ${layout.section}`}>
          <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
            <Reveal>
              <p className={`${TY.eyebrow} ${TY.num} ${t.accent}`}>01 · Definition</p>
              <h2 className={`mt-5 ${TY.h2} ${t.h}`}>공정 정의</h2>
            </Reveal>
            <div>
              <Reveal>
                <figure className={`border-l-2 pl-6 ${t.rule}`}>
                  <span className={`block text-5xl font-serif leading-none ${t.accent}`} aria-hidden>“</span>
                  <blockquote className={`-mt-3 text-xl font-semibold leading-[1.5] sm:text-[1.7rem] ${t.lead}`}>
                    {P.pullQuote}
                  </blockquote>
                </figure>
              </Reveal>
              <Reveal delay={90}>
                <p className={`mt-8 ${TY.body}`}>{P.intro}</p>
                <p className={`mt-5 ${TY.body}`}>{P.definition}</p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 특징 4 */}
        <section className={`border-t ${t.rule}`}>
          <div className={`${layout.container} ${layout.section}`}>
            <Reveal>
              <p className={`${TY.eyebrow} ${TY.num} ${t.accent}`}>02 · Features</p>
              <h2 className={`mt-5 ${TY.h2} ${t.h}`}>핵심 특징 4가지</h2>
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {P.features.map((f, i) => (
                <Reveal key={f.title} delay={i * 70}>
                  <div className={`group h-full rounded-md border p-8 transition-colors duration-[450ms] ${t.card}`}>
                    <div className="flex items-baseline gap-3">
                      <span className={`text-sm font-bold ${TY.num} ${t.accent}`}>{String(i + 1).padStart(2, '0')}</span>
                      <span className={`h-px flex-1 ${t.bar} opacity-25 transition-opacity duration-[450ms] group-hover:opacity-60`} aria-hidden />
                    </div>
                    <h3 className={`mt-4 ${TY.h3} ${t.h}`}>{f.title}</h3>
                    <p className="mt-2.5 text-[14px] leading-relaxed">{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 적용 분야 — 대표 3종 비주얼 카드 + 나머지 칩 */}
        <section className={`border-t ${t.rule}`}>
          <div className={`${layout.container} ${layout.section}`}>
            <Reveal>
              <p className={`${TY.eyebrow} ${TY.num} ${t.accent}`}>03 · Applications</p>
              <h2 className={`mt-5 ${TY.h2} ${t.h}`}>적용 분야</h2>
              <p className={`mt-5 max-w-2xl ${TY.body}`}>
                반복 하중과 마모에 노출되는 정밀 구동 부품에 폭넓게 적용됩니다.
              </p>
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-3">
              {P.applicationsFeatured.map((a, i) => (
                <Reveal key={a.name} delay={i * 80}>
                  <article className="group relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={a.img}
                      alt={a.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-transparent" aria-hidden />
                    <div className="relative p-6">
                      <span className={`text-xs font-bold ${TY.num} text-white/60`}>{String(i + 1).padStart(2, '0')}</span>
                      <h3 className="mt-1 text-lg font-bold text-white">{a.name}</h3>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-200">{a.desc}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
            {restApplications.length ? (
              <Reveal delay={120}>
                <div className={`mt-8 border-t ${t.rule} pt-8`}>
                  <p className={`${TY.eyebrow} text-[0.7rem] ${t.muted}`}>그 외 적용 부품</p>
                  <ul className="mt-4 flex flex-wrap gap-2.5">
                    {restApplications.map((a) => (
                      <li key={a} className={`rounded border px-3.5 py-2 text-[13px] font-semibold ${t.chip}`}>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ) : null}
          </div>
        </section>

        {/* 문의 CTA */}
        <section className={t.cta}>
          <div className={`${layout.container} py-20 text-center`}>
            <h2 className={`${TY.h2} ${variant === 'b' ? t.h : 'text-white'}`}>부품 사양에 맞는 표면처리, 상담부터 시작하세요</h2>
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
