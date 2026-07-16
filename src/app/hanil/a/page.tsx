import Link from 'next/link'
import { HeroCrossfade } from '../_components/HeroCrossfade'
import { Reveal } from '../_components/Reveal'
import { SectionHead } from '../_components/Section'
import { txt as TY, layout } from '../_components/_ui'
import { COMPANY, HERO, IMG, PROCESSES, TRUST, SECTORS, HIGHLIGHTS } from '../_content'

export default function HomeA() {
  return (
    <>
      {/* ① 풀스크린 히어로 — 배경 3장 크로스페이드 + 프로그레스 인디케이터 */}
      <section className="relative flex min-h-[100svh] items-center">
        <HeroCrossfade
          images={[IMG.weld, IMG.sparks, IMG.autoline]}
          alt="한일금속공업 표면처리 현장"
          overlayClassName="absolute inset-0 bg-gradient-to-br from-[#0B1B33]/92 via-[#0B1B33]/75 to-[#0B1B33]/55"
        />
        <div className={`relative ${layout.container} py-28`}>
          <Reveal>
            <p className={`${TY.eyebrow} text-[#8fb0da]`}>{COMPANY.slogan}</p>
          </Reveal>
          <Reveal delay={110}>
            <h1 className={`mt-7 max-w-4xl ${TY.display} text-white`} style={{ textWrap: 'balance' } as React.CSSProperties}>
              {HERO.main}
            </h1>
          </Reveal>
          <Reveal delay={210}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-neutral-300 sm:text-xl">{HERO.sub}</p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                href="/hanil/a/isonite-tf1"
                className="inline-flex h-12 items-center rounded bg-[#6f8bb3] px-6 text-sm font-bold text-[#0B1B33] transition duration-[240ms] hover:bg-[#8fb0da]"
              >
                표면처리 공정 보기
              </Link>
              <a
                href={COMPANY.telHref}
                className="group inline-flex h-12 items-center gap-2 text-sm font-bold text-white/85 transition hover:text-white"
              >
                <span className="relative">
                  전화 문의 {COMPANY.tel}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-white/70 transition-transform duration-[240ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                </span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ② 핵심 공정 12종 (다크 카드 그리드) */}
      <section className="border-t border-white/10 bg-[#0B1B33]">
        <div className={`${layout.container} ${layout.section}`}>
          <SectionHead
            num="01"
            eyebrow="Product"
            title="표면에 최적의 물성을 새깁니다"
            accent="text-[#8fb0da]"
            titleColor="text-white"
            rule="bg-white/20"
            aside={
              <p className="text-sm leading-relaxed text-neutral-400">
                질화·코팅·확산 공정을 조합한 HYBRID 표면개질로 부품마다 다른 요구 물성에 응답합니다. 보유 공정 12종.
              </p>
            }
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {PROCESSES.map((p, i) => (
              <Reveal key={p.code} delay={(i % 4) * 55}>
                <div className="group flex h-full flex-col bg-[#0B1B33] p-7 transition-colors duration-[450ms] hover:bg-[#12294a]">
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-bold ${TY.num} text-[#8fb0da]`}>{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">{p.en}</span>
                  </div>
                  <h3 className={`mt-4 ${TY.h3} text-white`}>{p.name}</h3>
                  <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-neutral-400">{p.desc}</p>
                  <span className="mt-5 block h-px w-8 bg-[#6f8bb3] transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-16" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ③ 신뢰 지표 (라이트 섹션 — 다크/라이트 교차) */}
      <section className="bg-white text-neutral-900">
        <div className={`${layout.container} ${layout.section}`}>
          <SectionHead
            num="02"
            eyebrow="Why HANIL"
            title="1986년부터, 검증된 품질로 신뢰를 쌓았습니다"
            accent="text-[#1e3a63]"
            titleColor="text-neutral-900"
            rule="bg-neutral-300"
          />
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST.map((tr, i) => (
              <Reveal key={tr.k} delay={i * 70}>
                <div className="border-t-2 border-[#0B1B33] pt-5">
                  <p className="text-sm font-semibold text-neutral-500">{tr.k}</p>
                  <p className={`mt-1 text-3xl font-extrabold tracking-tight text-[#0B1B33] ${TY.num}`}>{tr.v}</p>
                  <p className="mt-2 text-sm text-neutral-500">{tr.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <div className="mt-14 border-t border-neutral-200 pt-8">
              <p className={`${TY.eyebrow} text-[0.7rem] text-neutral-400`}>적용 산업</p>
              <ul className="mt-4 flex flex-wrap gap-2.5">
                {SECTORS.map((s) => (
                  <li key={s} className="rounded border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-semibold text-neutral-700">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ④ R&D / ESG 하이라이트 (다크) */}
      <section className="bg-[#0B1B33]">
        <div className={`${layout.container} ${layout.section}`}>
          <SectionHead
            num="03"
            eyebrow="R&D · ESG"
            title="기술과 지속가능성을 함께 설계합니다"
            accent="text-[#8fb0da]"
            titleColor="text-white"
            rule="bg-white/20"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {HIGHLIGHTS.map((h, i) => (
              <Reveal key={h.tag} delay={i * 90}>
                <article className="group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={h.img}
                    alt={h.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06101f] via-[#06101f]/55 to-transparent" aria-hidden />
                  <div className="relative p-8">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8fb0da]">{h.tag}</span>
                    <h3 className="mt-3 text-2xl font-bold text-white">{h.title}</h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-300">{h.desc}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ⑤ 문의 CTA */}
      <section className="border-t border-white/10 bg-[#12294a]">
        <div className={`${layout.container} py-20 text-center`}>
          <Reveal>
            <h2 className={`${TY.h2} text-white`}>어떤 표면이 필요하신가요?</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-neutral-300">
              부품과 요구 물성을 알려주시면 최적의 표면처리 공정을 제안드립니다.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={COMPANY.telHref}
                className="inline-flex h-12 items-center rounded bg-[#6f8bb3] px-7 text-sm font-bold text-[#0B1B33] transition duration-[240ms] hover:bg-[#8fb0da]"
              >
                전화 문의 {COMPANY.tel}
              </a>
              <Link
                href="/hanil/a/greeting"
                className="inline-flex h-12 items-center rounded border border-white/25 px-7 text-sm font-bold text-white transition duration-[240ms] hover:bg-white/10"
              >
                회사소개 보기
              </Link>
            </div>
            <p className="mt-8 text-sm text-neutral-400">{COMPANY.addr}</p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
