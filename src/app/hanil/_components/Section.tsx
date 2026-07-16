import { Reveal } from './Reveal'
import { txt as T } from './_ui'

/**
 * 섹션 헤더 패턴 통일 — 번호(01~) · 영문 eyebrow · 국문 타이틀 · 설명.
 * 색은 시안별 팔레트를 className 문자열로 주입(Tailwind 정적 클래스 유지).
 * frontend-design 원칙: 번호는 실제 순서/구획을 encode할 때만 부여.
 */
export function SectionHead({
  num,
  eyebrow,
  title,
  desc,
  accent,
  titleColor,
  descColor,
  rule,
  aside,
  className = '',
}: {
  num?: string
  eyebrow: string
  title: React.ReactNode
  desc?: React.ReactNode
  /** eyebrow·번호 색 (예: 'text-[#8fb0da]') */
  accent: string
  /** 타이틀 색 (예: 'text-white') */
  titleColor: string
  /** 설명 색 (예: 'text-neutral-400') */
  descColor?: string
  /** eyebrow 옆 얇은 룰 라인 색 (예: 'bg-white/20'); 없으면 미표시 */
  rule?: string
  /** 우측(또는 하단) 보조 노드 — split 레이아웃용 */
  aside?: React.ReactNode
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-8 md:flex-row md:items-end md:justify-between ${className}`}>
      <Reveal className="max-w-2xl">
        <div className="flex items-center gap-3">
          {num ? <span className={`${T.eyebrow} ${T.num} ${accent}`}>{num}</span> : null}
          <span className={`${T.eyebrow} ${accent}`}>{eyebrow}</span>
          {rule ? <span className={`h-px w-10 ${rule}`} aria-hidden /> : null}
        </div>
        <h2 className={`mt-5 ${T.h2} ${titleColor}`} style={{ textWrap: 'balance' } as React.CSSProperties}>
          {title}
        </h2>
        {desc ? <p className={`mt-5 ${T.body} ${descColor ?? ''}`}>{desc}</p> : null}
      </Reveal>
      {aside ? (
        <Reveal delay={90} className="md:max-w-sm md:text-right">
          {aside}
        </Reveal>
      ) : null}
    </div>
  )
}

/**
 * 히어로 스크롤 유도 인디케이터 — CSS만(animate-softbounce, reduced-motion 존중).
 * 다크 오버레이 히어로 공통이라 밝은 톤 고정.
 */
export function ScrollCue({ label = 'SCROLL', className = '' }: { label?: string; className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-7 z-10 flex flex-col items-center gap-2 text-white/70 ${className}`}
      aria-hidden
    >
      <span className={`${T.eyebrow} text-[0.62rem] text-white/55`}>{label}</span>
      <span className="flex h-8 w-5 justify-center rounded-full border border-white/40 pt-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-white/80 motion-safe:animate-softbounce" />
      </span>
    </div>
  )
}
