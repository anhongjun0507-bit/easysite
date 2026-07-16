import Link from 'next/link'
import { Reveal } from '../_components/Reveal'
import { CountUp } from '../_components/CountUp'
import { COMPANY, HERO, IMG, KEY_PROCESSES, STATS, SECTORS, TRUST, HIGHLIGHTS } from '../_content'

export default function HomeC() {
  return (
    <>
      {/* ① 다크 히어로 */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMG.refinery} alt="한일금속공업 표면처리 플랜트" className="absolute inset-0 h-full w-full scale-[1.05] object-cover blur-[4px]" loading="eager" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950/92 via-neutral-950/78 to-neutral-950/55" aria-hidden />
        <div className="relative mx-auto w-full max-w-7xl px-6 py-28 sm:px-8">
          <Reveal>
            <span className="inline-block rounded-sm bg-[#6B1F2E] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
              Surface Engineering
            </span>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="mt-6 max-w-4xl text-[2.3rem] font-extrabold leading-[1.16] tracking-tight text-white sm:text-[3.25rem] lg:text-[3.8rem]">
              {HERO.main}
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-neutral-300 sm:text-xl">{HERO.sub}</p>
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/hanil/c/isonite-tf1" className="inline-flex h-12 items-center rounded bg-[#6B1F2E] px-6 text-sm font-bold text-white transition hover:bg-[#571825]">
                표면처리 공정 보기
              </Link>
              <a href={COMPANY.telHref} className="inline-flex h-12 items-center rounded border border-white/25 px-6 text-sm font-bold text-white transition hover:bg-white/10">
                {COMPANY.tel}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ② 핵심 공정 — 라이트 카드 그리드 + hover */}
      <section className="bg-[#f6f4f1]">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B1F2E]">PRODUCT</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">표면처리 공정</h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="max-w-sm text-sm leading-relaxed text-neutral-500">
                질화·코팅·확산을 조합한 HYBRID 표면개질로 부품별 최적 사양을 설계합니다.
              </p>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {KEY_PROCESSES.map((p, i) => (
              <Reveal key={p.code} delay={(i % 4) * 60}>
                <div className="group relative h-full overflow-hidden rounded-md border border-neutral-200 bg-white p-7 transition-all hover:-translate-y-1 hover:border-[#6B1F2E]/30">
                  <span className="absolute inset-x-0 top-0 h-[3px] scale-x-0 bg-[#6B1F2E] transition-transform duration-500 group-hover:scale-x-100" aria-hidden />
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6B1F2E]">{p.en}</span>
                  <h3 className="mt-3 text-lg font-bold text-neutral-900">{p.name}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-neutral-500">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ③ 신뢰 지표 — 카운트업 */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B1F2E]">By the Numbers</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              숫자로 증명하는 표면처리 전문성
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-10 border-y border-neutral-200 py-12 sm:grid-cols-3">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 90}>
                <div className="text-center sm:text-left">
                  <p className="text-5xl font-extrabold tracking-tight text-[#6B1F2E] sm:text-6xl">
                    <CountUp value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-3 text-sm font-medium text-neutral-500">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">
            {TRUST.map((tr) => (
              <span key={tr.k} className="text-sm font-semibold text-neutral-700">
                {tr.k} <span className="text-neutral-400">{tr.v !== '인증' && tr.v !== '기술' ? tr.v : tr.label}</span>
              </span>
            ))}
          </div>
          <Reveal delay={100}>
            <div className="mt-10 border-t border-neutral-200 pt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">적용 산업</p>
              <ul className="mt-4 flex flex-wrap gap-2.5">
                {SECTORS.map((s) => (
                  <li key={s} className="rounded border border-[#6B1F2E]/20 bg-[#6B1F2E]/[0.05] px-4 py-2 text-sm font-semibold text-[#6B1F2E]">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ④ R&D / ESG */}
      <section className="border-t border-neutral-200 bg-[#f6f4f1]">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {HIGHLIGHTS.map((h, i) => (
              <Reveal key={h.tag} delay={i * 90}>
                <article className="group relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={h.img} alt={h.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" decoding="async" />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/45 to-transparent" aria-hidden />
                  <div className="relative p-8">
                    <span className="inline-block rounded-sm bg-[#6B1F2E] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white">{h.tag}</span>
                    <h3 className="mt-3 text-2xl font-bold text-white">{h.title}</h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-200">{h.desc}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ⑤ 문의 CTA — 다크 마감 */}
      <section className="bg-neutral-950">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center sm:px-8">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">부품 표면, 한일금속이 책임집니다</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-neutral-400">
              도면과 요구 물성을 알려주시면 최적의 표면처리 공정을 제안드립니다.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href={COMPANY.telHref} className="inline-flex h-12 items-center rounded bg-[#6B1F2E] px-7 text-sm font-bold text-white transition hover:bg-[#571825]">
                전화 문의 {COMPANY.tel}
              </a>
              <Link href="/hanil/c/greeting" className="inline-flex h-12 items-center rounded border border-white/25 px-7 text-sm font-bold text-white transition hover:bg-white/10">
                회사소개 보기
              </Link>
            </div>
            <p className="mt-8 text-sm text-neutral-500">{COMPANY.addr}</p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
