import Link from 'next/link'
import { COMPANY, makeNav, KEY_PROCESSES } from '../_content'
import { txt as T } from './_ui'

type Variant = 'a' | 'b' | 'c'

const V: Record<Variant, { shell: string; head: string; text: string; accent: string; rule: string; tel: string }> = {
  a: { shell: 'bg-[#081527] text-neutral-400', head: 'text-white', text: 'hover:text-white', accent: 'text-[#8fb0da]', rule: 'border-white/10', tel: 'text-white hover:text-[#8fb0da]' },
  b: { shell: 'bg-[#12233d] text-white/55', head: 'text-white', text: 'hover:text-white', accent: 'text-[#8fb0da]', rule: 'border-white/10', tel: 'text-white hover:text-[#8fb0da]' },
  c: { shell: 'bg-neutral-950 text-neutral-400', head: 'text-white', text: 'hover:text-white', accent: 'text-[#d98b98]', rule: 'border-white/10', tel: 'text-white hover:text-[#d98b98]' },
}

export function SiteFooter({ variant, base }: { variant: Variant; base: string }) {
  const t = V[variant]
  const nav = makeNav(base)
  return (
    <footer className={t.shell}>
      {/* 슬로건 밴드 */}
      <div className={`border-b ${t.rule}`}>
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-12 sm:px-8 md:flex-row md:items-end md:justify-between">
          <p className={`text-2xl font-extrabold tracking-[0.14em] sm:text-3xl ${t.accent}`}>{COMPANY.slogan}</p>
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] opacity-60">{COMPANY.nameEn}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* 브랜드 */}
          <div>
            <p className={`text-xl font-extrabold tracking-tight ${t.head}`}>{COMPANY.nameKo}</p>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed">
              1986년 창립 이래 질화·코팅·확산을 아우르는 HYBRID 표면개질 기술로 부품의 수명과 성능을 높여온
              표면처리 전문기업입니다.
            </p>
          </div>

          {/* 회사정보 + 연락처 */}
          <div>
            <p className={`${T.eyebrow} text-[0.7rem] ${t.head}`}>회사정보</p>
            <dl className="mt-4 space-y-2.5 text-[13px] leading-relaxed">
              <div>
                <dt className="opacity-55">대표이사</dt>
                <dd className={t.head}>{COMPANY.ceo}</dd>
              </div>
              <div>
                <dt className="opacity-55">주소</dt>
                <dd>{COMPANY.addr}</dd>
              </div>
              <div>
                <dt className="opacity-55">대표전화</dt>
                <dd>
                  <a href={COMPANY.telHref} className={`text-base font-bold tracking-tight transition ${t.tel}`}>
                    {COMPANY.tel}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          {/* 사이트맵 */}
          <nav>
            <p className={`${T.eyebrow} text-[0.7rem] ${t.head}`}>사이트맵</p>
            <ul className="mt-4 space-y-2.5 text-[13px]">
              {nav.map((n) => (
                <li key={n.label}>
                  <Link href={n.href} className={`transition ${t.text}`}>
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 표면처리 공정 */}
          <nav>
            <p className={`${T.eyebrow} text-[0.7rem] ${t.head}`}>표면처리 공정</p>
            <ul className="mt-4 space-y-2.5 text-[13px]">
              {KEY_PROCESSES.slice(0, 6).map((p) => (
                <li key={p.code}>
                  <Link href={p.code === 'ISONITE TF1' ? `${base}/isonite-tf1` : '#'} className={`transition ${t.text}`}>
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={`mt-14 flex flex-col gap-2 border-t ${t.rule} pt-6 text-[11px] opacity-70 sm:flex-row sm:items-center sm:justify-between`}>
          <p>© 2026 {COMPANY.nameKo} · Since {COMPANY.since}</p>
          <p>검토용 비공개 시안 · 문구와 이미지는 임시입니다</p>
        </div>
      </div>
    </footer>
  )
}
