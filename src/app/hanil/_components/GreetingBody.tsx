import { GREETING as G, IMG, COMPANY } from '../_content'
import { Reveal } from './Reveal'
import { txt as TY, layout } from './_ui'

type Variant = 'a' | 'b' | 'c'

const T: Record<
  Variant,
  { heroOverlay: string; eyebrow: string; body: string; h: string; lead: string; accent: string; bar: string; pill: string; rule: string; sign: string }
> = {
  a: {
    heroOverlay: 'from-[#0B1B33]/75 via-[#0B1B33]/85 to-[#0B1B33]',
    eyebrow: 'text-[#8fb0da]',
    body: 'bg-[#0B1B33] text-neutral-300',
    h: 'text-white',
    lead: 'text-white',
    accent: 'text-[#8fb0da]',
    bar: 'bg-[#6f8bb3]',
    pill: 'border-white/15 bg-white/5 text-neutral-100',
    rule: 'border-white/10',
    sign: 'text-white',
  },
  b: {
    heroOverlay: 'from-[#12233d]/75 via-[#12233d]/85 to-[#12233d]/95',
    eyebrow: 'text-[#9ab6e0]',
    body: 'bg-white text-neutral-600',
    h: 'text-neutral-900',
    lead: 'text-neutral-900',
    accent: 'text-[#1e3a63]',
    bar: 'bg-[#1e3a63]',
    pill: 'border-neutral-200 bg-neutral-50 text-neutral-700',
    rule: 'border-neutral-200',
    sign: 'text-neutral-900',
  },
  c: {
    heroOverlay: 'from-neutral-950/70 via-neutral-950/85 to-neutral-950/95',
    eyebrow: 'text-[#e6b8bf]',
    body: 'bg-[#f6f4f1] text-neutral-700',
    h: 'text-neutral-900',
    lead: 'text-neutral-900',
    accent: 'text-[#6B1F2E]',
    bar: 'bg-[#6B1F2E]',
    pill: 'border-[#6B1F2E]/25 bg-[#6B1F2E]/[0.06] text-[#6B1F2E]',
    rule: 'border-neutral-200',
    sign: 'text-neutral-900',
  },
}

const VALUES = ['기술력', '품질관리', '고객 신뢰']

export function GreetingBody({ variant }: { variant: Variant }) {
  const t = T[variant]
  const [lead, ...rest] = G.paragraphs
  return (
    <>
      {/* 서브 히어로 */}
      <section className="relative flex min-h-[52vh] items-end overflow-hidden pt-24">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMG.rnd} alt="한일금속공업 연구 현장" className="absolute inset-0 h-full w-full object-cover" loading="eager" decoding="async" />
        <div className={`absolute inset-0 bg-gradient-to-b ${t.heroOverlay}`} aria-hidden />
        <div className={`relative ${layout.container} pb-16`}>
          <p className={`${TY.eyebrow} ${t.eyebrow}`}>{G.eyebrow}</p>
          <h1 className={`mt-5 max-w-3xl ${TY.display} text-white`} style={{ textWrap: 'balance' } as React.CSSProperties}>
            {G.title}
          </h1>
        </div>
      </section>

      {/* 인사말 본문 */}
      <div className={t.body}>
        <div className={`${layout.container} ${layout.section}`}>
          <div className="grid gap-12 md:grid-cols-[1fr_1.6fr] md:gap-16">
            {/* 좌: 이미지 + 가치 */}
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

            {/* 우: 인용 첫 문단 강조 + 나머지 + 서명 */}
            <div>
              <Reveal>
                <figure className={`border-l-2 pl-6 ${t.rule}`}>
                  <span className={`block text-5xl font-serif leading-none ${t.accent}`} aria-hidden>“</span>
                  <blockquote className={`-mt-3 text-xl font-semibold leading-[1.6] sm:text-[1.6rem] ${t.lead}`}>
                    {lead}
                  </blockquote>
                </figure>
              </Reveal>
              {rest.map((para, i) => (
                <Reveal key={i} delay={i * 60}>
                  <p className={`mt-6 text-[15.5px] leading-[1.9]`}>{para}</p>
                </Reveal>
              ))}
              <Reveal delay={80}>
                <div className={`mt-12 flex items-end justify-between gap-6 border-t ${t.rule} pt-8`}>
                  <div>
                    <p className="text-[13px] tracking-[0.14em] opacity-60">{G.signOff}</p>
                    <p className={`mt-2 text-3xl font-extrabold tracking-tight ${t.sign}`}>{G.ceo}</p>
                  </div>
                  <p className={`text-sm font-semibold tracking-[0.14em] ${t.accent}`}>{COMPANY.slogan}</p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
