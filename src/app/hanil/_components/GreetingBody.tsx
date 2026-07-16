import { GREETING as G, IMG, COMPANY } from '../_content'
import { Reveal } from './Reveal'

type Variant = 'a' | 'b' | 'c'

const T: Record<
  Variant,
  { heroOverlay: string; eyebrow: string; body: string; h: string; lead: string; accent: string; pill: string; rule: string; sign: string }
> = {
  a: {
    heroOverlay: 'from-[#0B1B33]/75 via-[#0B1B33]/85 to-[#0B1B33]',
    eyebrow: 'text-[#8fb0da]',
    body: 'bg-[#0B1B33] text-neutral-300',
    h: 'text-white',
    lead: 'text-neutral-100',
    accent: 'text-[#8fb0da]',
    pill: 'border-white/15 bg-white/5 text-neutral-100',
    rule: 'border-white/10',
    sign: 'text-white',
  },
  b: {
    heroOverlay: 'from-[#12233d]/75 via-[#12233d]/85 to-[#12233d]/95',
    eyebrow: 'text-[#9ab6e0]',
    body: 'bg-white text-neutral-600',
    h: 'text-neutral-900',
    lead: 'text-neutral-800',
    accent: 'text-[#1e3a63]',
    pill: 'border-neutral-200 bg-neutral-50 text-neutral-700',
    rule: 'border-neutral-200',
    sign: 'text-neutral-900',
  },
  c: {
    heroOverlay: 'from-neutral-950/70 via-neutral-950/85 to-neutral-950/95',
    eyebrow: 'text-[#e6b8bf]',
    body: 'bg-[#f6f4f1] text-neutral-700',
    h: 'text-neutral-900',
    lead: 'text-neutral-800',
    accent: 'text-[#6B1F2E]',
    pill: 'border-[#6B1F2E]/25 bg-[#6B1F2E]/[0.06] text-[#6B1F2E]',
    rule: 'border-neutral-200',
    sign: 'text-neutral-900',
  },
}

const VALUES = ['기술력', '품질관리', '고객 신뢰']

export function GreetingBody({ variant }: { variant: Variant }) {
  const t = T[variant]
  return (
    <>
      {/* 서브 히어로 */}
      <section className="relative flex min-h-[52vh] items-end overflow-hidden pt-24">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMG.rnd} alt="한일금속공업 연구 현장" className="absolute inset-0 h-full w-full object-cover" loading="eager" decoding="async" />
        <div className={`absolute inset-0 bg-gradient-to-b ${t.heroOverlay}`} aria-hidden />
        <div className="relative mx-auto w-full max-w-7xl px-6 pb-14 sm:px-8">
          <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${t.eyebrow}`}>{G.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            {G.title}
          </h1>
        </div>
      </section>

      {/* 인사말 본문 */}
      <div className={t.body}>
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-12 md:grid-cols-[1fr_1.6fr] md:gap-16">
            {/* 좌: 가치 + 이미지 */}
            <Reveal>
              <div className="overflow-hidden rounded-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMG.facility} alt="한일금속공업 생산 설비" className="aspect-[4/5] w-full object-cover" loading="lazy" decoding="async" />
              </div>
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {VALUES.map((v) => (
                  <li key={v} className={`rounded border px-3.5 py-2 text-[13px] font-semibold ${t.pill}`}>
                    {v}
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* 우: 4문단 + 서명 */}
            <div>
              {G.paragraphs.map((para, i) => (
                <Reveal key={i} delay={i * 60}>
                  <p className={`text-[15.5px] leading-[1.9] ${i === 0 ? `font-semibold ${t.lead}` : ''} ${i > 0 ? 'mt-6' : ''}`}>
                    {para}
                  </p>
                </Reveal>
              ))}
              <Reveal delay={80}>
                <div className={`mt-10 border-t ${t.rule} pt-6`}>
                  <p className="text-[13px] tracking-wide opacity-70">{G.signOff}</p>
                  <p className={`mt-1 text-2xl font-extrabold tracking-tight ${t.sign}`}>{G.ceo}</p>
                  <p className={`mt-2 text-sm font-semibold tracking-[0.12em] ${t.accent}`}>{COMPANY.slogan}</p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
