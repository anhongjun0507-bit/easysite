import Link from 'next/link'
import { Reveal } from '../_components/Reveal'
import { SectionHead, ScrollCue } from '../_components/Section'
import { txt as TY, layout } from '../_components/_ui'
import { COMPANY, HERO, IMG, PROCESSES, TRUST, SECTORS, HIGHLIGHTS } from '../_content'

export default function HomeB() {
  return (
    <>
      {/* ① 히어로 — 정적 1장 + 얇은 라인, 위계는 타이포로만 */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMG.autoline} alt="한일금속공업 표면처리 생산 라인" className="absolute inset-0 h-full w-full scale-[1.05] object-cover blur-[4px]" loading="eager" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e1f38]/88 via-[#0e1f38]/60 to-[#0e1f38]/25" aria-hidden />
        <div className={`relative ${layout.container} py-28`}>
          <Reveal>
            <p className={`${TY.eyebrow} text-white/70`}>{COMPANY.nameEn}</p>
            <div className="mt-6 h-px w-16 bg-white/40" />
          </Reveal>
          <Reveal delay={110}>
            <h1 className={`mt-8 max-w-4xl ${TY.display} text-white`} style={{ textWrap: 'balance' } as React.CSSProperties}>
              {HERO.main}
            </h1>
          </Reveal>
          <Reveal delay={210}>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl">{HERO.sub}</p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link href="/hanil/b/isonite-tf1" className="inline-flex h-12 items-center rounded bg-white px-6 text-sm font-bold text-[#12233d] transition duration-[240ms] hover:bg-neutral-100">
                제품 살펴보기
              </Link>
              <Link href="/hanil/b/greeting" className="group inline-flex h-12 items-center text-sm font-bold text-white/85 transition hover:text-white">
                <span className="relative">
                  회사소개
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-white/70 transition-transform duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
        <ScrollCue />
      </section>

      {/* ② 포지셔닝 — 여백 넉넉, 얇은 라인 */}
      <section className="bg-white">
        <div className={`${layout.container} ${layout.section}`}>
          <div className="grid gap-10 border-t border-neutral-200 pt-12 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
            <Reveal>
              <p className={`${TY.eyebrow} text-[#1e3a63]`}>Our Positioning</p>
            </Reveal>
            <Reveal delay={80}>
              <p className="text-2xl font-semibold leading-relaxed tracking-[-0.01em] text-neutral-900 sm:text-[1.7rem]">
                한일금속공업은 질화와 코팅, 확산 처리를 아우르는 HYBRID 표면개질 기술로 부품마다 다른
                요구 물성에 100% 응답합니다.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ③ 핵심 공정 12종 — 하이라인 리스트(그림자 없이 타이포·여백으로) */}
      <section className="border-t border-neutral-200 bg-white">
        <div className={`${layout.container} ${layout.section}`}>
          <SectionHead
            num="01"
            eyebrow="Product"
            title="표면처리 공정 12종"
            accent="text-[#1e3a63]"
            titleColor="text-neutral-900"
            rule="bg-neutral-300"
          />
          <div className="mt-14 grid border-t border-neutral-200 md:grid-cols-2">
            {PROCESSES.map((p, i) => (
              <Reveal key={p.code} delay={(i % 2) * 60}>
                <div className="group flex items-start gap-6 border-b border-neutral-200 py-7 transition-colors duration-[450ms] hover:bg-neutral-50 md:px-2">
                  <span className={`mt-1 text-sm font-bold ${TY.num} text-[#1e3a63]`}>{String(i + 1).padStart(2, '0')}</span>
                  <div className="min-w-0">
                    <h3 className={`${TY.h3} text-neutral-900`}>
                      {p.name}
                      <span className="ml-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-400">{p.en}</span>
                    </h3>
                    <p className="mt-1.5 max-w-md text-sm leading-relaxed text-neutral-500">{p.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ④ 신뢰 지표 — 큰 타이포 */}
      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className={`${layout.container} ${layout.section}`}>
          <SectionHead
            num="02"
            eyebrow="Why HANIL"
            title="1986년 창립 이래 지켜온 품질 기준"
            accent="text-[#1e3a63]"
            titleColor="text-neutral-900"
            rule="bg-neutral-300"
          />
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST.map((tr, i) => (
              <Reveal key={tr.k} delay={i * 70}>
                <div>
                  <p className="text-sm font-semibold text-neutral-500">{tr.k}</p>
                  <p className={`mt-2 text-4xl font-extrabold tracking-tight text-[#12233d] ${TY.num}`}>{tr.v}</p>
                  <p className="mt-2 text-sm text-neutral-500">{tr.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <div className="mt-16 border-t border-neutral-200 pt-8">
              <p className={`${TY.eyebrow} text-[0.7rem] text-neutral-400`}>적용 산업</p>
              <ul className="mt-4 flex flex-wrap gap-2.5">
                {SECTORS.map((s) => (
                  <li key={s} className="rounded border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ⑤ R&D / ESG */}
      <section className="border-t border-neutral-200 bg-white">
        <div className={`${layout.container} ${layout.section}`}>
          <SectionHead
            num="03"
            eyebrow="R&D · ESG"
            title="기술과 지속가능성을 함께 설계합니다"
            accent="text-[#1e3a63]"
            titleColor="text-neutral-900"
            rule="bg-neutral-300"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {HIGHLIGHTS.map((h, i) => (
              <Reveal key={h.tag} delay={i * 90}>
                <article className="group overflow-hidden rounded-md border border-neutral-200">
                  <div className="overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={h.img} alt={h.title} className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" decoding="async" />
                  </div>
                  <div className="p-7">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#1e3a63]">{h.tag}</span>
                    <h3 className="mt-2 text-xl font-bold text-neutral-900">{h.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-500">{h.desc}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ⑥ 문의 CTA — 라이트 유지 */}
      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className={`${layout.container} py-20`}>
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <Reveal>
              <h2 className={`${TY.h2} text-neutral-900`}>표면처리가 필요하신가요?</h2>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-neutral-500">
                부품과 요구 물성을 알려주시면 최적 공정을 제안드립니다. {COMPANY.addr}
              </p>
            </Reveal>
            <Reveal delay={80}>
              <a href={COMPANY.telHref} className="inline-flex h-12 shrink-0 items-center rounded bg-[#1e3a63] px-7 text-sm font-bold text-white transition duration-[240ms] hover:bg-[#16304f]">
                전화 문의 {COMPANY.tel}
              </a>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
