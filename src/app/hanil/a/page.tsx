import Link from 'next/link'
import { HeroCrossfade } from '../_components/HeroCrossfade'
import { Reveal } from '../_components/Reveal'
import { COMPANY, HERO, IMG, KEY_PROCESSES, TRUST, SECTORS, HIGHLIGHTS } from '../_content'

export default function HomeA() {
  return (
    <>
      {/* ① 풀스크린 히어로 — 배경 3장 크로스페이드 */}
      <section className="relative flex min-h-[100svh] items-center">
        <HeroCrossfade
          images={[IMG.weld, IMG.sparks, IMG.autoline]}
          alt="한일금속공업 표면처리 현장"
          overlayClassName="absolute inset-0 bg-gradient-to-br from-[#0B1B33]/92 via-[#0B1B33]/75 to-[#0B1B33]/55"
        />
        <div className="relative mx-auto w-full max-w-7xl px-6 py-28 sm:px-8">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#8fb0da]">{COMPANY.slogan}</p>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="mt-6 max-w-4xl text-[2rem] font-extrabold leading-[1.18] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
              {HERO.main}
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-neutral-300 sm:text-lg">{HERO.sub}</p>
          </Reveal>
          <Reveal delay={260}>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/hanil/a/isonite-tf1"
                className="inline-flex h-12 items-center rounded bg-[#6f8bb3] px-6 text-sm font-bold text-[#0B1B33] transition hover:bg-[#8fb0da]"
              >
                표면처리 공정 보기
              </Link>
              <a
                href={COMPANY.telHref}
                className="inline-flex h-12 items-center rounded border border-white/25 px-6 text-sm font-bold text-white transition hover:bg-white/10"
              >
                {COMPANY.tel}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ② 핵심 공정 (다크 카드 그리드) */}
      <section className="border-t border-white/10 bg-[#0B1B33]">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8fb0da]">PRODUCT</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                표면에 최적의 물성을 새깁니다
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="max-w-sm text-sm leading-relaxed text-neutral-400">
                질화·코팅·확산 공정을 조합한 HYBRID 표면개질로 부품마다 다른 요구 물성에 응답합니다.
              </p>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {KEY_PROCESSES.map((p, i) => (
              <Reveal key={p.code} delay={(i % 4) * 60}>
                <div className="group h-full bg-[#0B1B33] p-7 transition-colors hover:bg-[#12294a]">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8fb0da]">{p.en}</span>
                  <h3 className="mt-3 text-lg font-bold text-white">{p.name}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-neutral-400">{p.desc}</p>
                  <span className="mt-5 block h-px w-8 bg-[#6f8bb3] transition-all duration-500 group-hover:w-14" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ③ 신뢰 지표 (라이트 섹션 — 다크/라이트 교차) */}
      <section className="bg-white text-neutral-900">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1e3a63]">Why HANIL</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              1986년부터, 검증된 품질로 신뢰를 쌓았습니다
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST.map((tr, i) => (
              <Reveal key={tr.k} delay={i * 70}>
                <div className="border-t-2 border-[#0B1B33] pt-5">
                  <p className="text-sm font-semibold text-neutral-500">{tr.k}</p>
                  <p className="mt-1 text-3xl font-extrabold tracking-tight text-[#0B1B33]">{tr.v}</p>
                  <p className="mt-2 text-sm text-neutral-500">{tr.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <div className="mt-14 border-t border-neutral-200 pt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">적용 산업</p>
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
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8">
          <div className="grid gap-6 md:grid-cols-2">
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
        <div className="mx-auto max-w-7xl px-6 py-20 text-center sm:px-8">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              어떤 표면이 필요하신가요?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-neutral-300">
              부품과 요구 물성을 알려주시면 최적의 표면처리 공정을 제안드립니다.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={COMPANY.telHref}
                className="inline-flex h-12 items-center rounded bg-[#6f8bb3] px-7 text-sm font-bold text-[#0B1B33] transition hover:bg-[#8fb0da]"
              >
                전화 문의 {COMPANY.tel}
              </a>
              <Link
                href="/hanil/a/greeting"
                className="inline-flex h-12 items-center rounded border border-white/25 px-7 text-sm font-bold text-white transition hover:bg-white/10"
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
