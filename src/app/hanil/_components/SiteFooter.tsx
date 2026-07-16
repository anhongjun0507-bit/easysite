import Link from 'next/link'
import { COMPANY, makeNav, KEY_PROCESSES } from '../_content'

type Variant = 'a' | 'b' | 'c'

const V: Record<Variant, { shell: string; head: string; text: string; accent: string; rule: string }> = {
  a: { shell: 'bg-[#081527] text-neutral-400', head: 'text-white', text: 'hover:text-white', accent: 'text-[#8fb0da]', rule: 'border-white/10' },
  b: { shell: 'bg-[#12233d] text-white/55', head: 'text-white', text: 'hover:text-white', accent: 'text-[#8fb0da]', rule: 'border-white/10' },
  c: { shell: 'bg-neutral-950 text-neutral-400', head: 'text-white', text: 'hover:text-white', accent: 'text-[#d98b98]', rule: 'border-white/10' },
}

export function SiteFooter({ variant, base }: { variant: Variant; base: string }) {
  const t = V[variant]
  const nav = makeNav(base)
  return (
    <footer className={`${t.shell}`}>
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className={`text-lg font-extrabold tracking-tight ${t.head}`}>{COMPANY.nameKo}</p>
            <p className="mt-1 text-[11px] font-medium tracking-[0.18em] opacity-70">{COMPANY.nameEn}</p>
            <p className={`mt-5 text-sm font-semibold tracking-[0.15em] ${t.accent}`}>{COMPANY.slogan}</p>
            <p className="mt-6 text-[13px] leading-relaxed">
              {COMPANY.addr}
              <br />
              TEL <a href={COMPANY.telHref} className={`transition ${t.text}`}>{COMPANY.tel}</a>
            </p>
          </div>

          <nav>
            <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${t.head}`}>MENU</p>
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

          <nav>
            <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${t.head}`}>PRODUCT</p>
            <ul className="mt-4 space-y-2.5 text-[13px]">
              {KEY_PROCESSES.slice(0, 6).map((p) => (
                <li key={p.code}>
                  <Link
                    href={p.code === 'ISONITE TF1' ? `${base}/isonite-tf1` : '#'}
                    className={`transition ${t.text}`}
                  >
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
