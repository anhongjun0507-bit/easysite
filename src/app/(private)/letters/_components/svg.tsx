/**
 * /letters 전용 SVG 조각 — 밀랍 씰·소인·우표·종이비행기.
 * 전부 순수 마크업(모션 없음). 애니메이션은 각 씬 컴포넌트가 GSAP 으로 건다.
 */

export function WaxSeal({ className, id = 'seal' }: { className?: string; id?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}-wax`} cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#d4544c" />
          <stop offset="55%" stopColor="#b3312c" />
          <stop offset="100%" stopColor="#7d1f1c" />
        </radialGradient>
      </defs>
      {/* 밀랍 덩어리 — 가장자리를 일부러 울퉁불퉁하게 */}
      <path
        fill={`url(#${id}-wax)`}
        d="M50 4c9 0 12 6 20 8s14-2 18 6-2 13 0 21 6 12 2 19-12 5-18 10-8 12-16 13-13-5-21-5-13 7-20 3-6-12-10-18-11-9-11-17 7-11 9-19 0-14 7-18 13 3 21 1S41 4 50 4Z"
      />
      {/* 눌린 자국 */}
      <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="1.6" />
      <text
        x="50"
        y="57"
        textAnchor="middle"
        fontSize="22"
        letterSpacing="1"
        fill="rgba(255,240,232,.9)"
        style={{ fontFamily: 'var(--font-hand), sans-serif' }}
      >
        DH
      </text>
    </svg>
  )
}

/** 날짜 소인 — 이중 원 + 도시명 + 날짜 + 소인 물결선 */
export function Postmark({ date, className }: { date: string; className?: string }) {
  const [y, m, d] = date.split('-')
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="2.4" opacity="0.9">
        <circle cx="100" cy="100" r="72" />
        <circle cx="100" cy="100" r="60" strokeWidth="1.4" />
        <path d="M40 100h120" strokeWidth="1.2" opacity="0.5" />
      </g>
      <text x="100" y="82" textAnchor="middle" fontSize="17" letterSpacing="4" fill="currentColor">
        {y}
      </text>
      <text x="100" y="124" textAnchor="middle" fontSize="30" letterSpacing="2" fill="currentColor">
        {m}.{d}
      </text>
      <g stroke="currentColor" strokeWidth="3" opacity="0.55">
        <path d="M6 78h48M6 96h48M6 114h48" />
      </g>
    </svg>
  )
}

/** 우표 — 톱니(perforation)는 반복 원을 mask 로 파서 만든다 */
export function Stamp({ className, id = 'stamp', label = 'AIR MAIL' }: { className?: string; id?: string; label?: string }) {
  return (
    <svg viewBox="0 0 78 96" className={className} aria-hidden>
      <defs>
        <mask id={`${id}-perf`}>
          <rect x="2" y="2" width="74" height="92" fill="#fff" />
          {Array.from({ length: 8 }, (_, i) => (
            <g key={i}>
              <circle cx={4 + i * 10} cy="2" r="3.2" fill="#000" />
              <circle cx={4 + i * 10} cy="94" r="3.2" fill="#000" />
            </g>
          ))}
          {Array.from({ length: 10 }, (_, i) => (
            <g key={`v${i}`}>
              <circle cx="2" cy={4 + i * 10} r="3.2" fill="#000" />
              <circle cx="76" cy={4 + i * 10} r="3.2" fill="#000" />
            </g>
          ))}
        </mask>
      </defs>
      <g mask={`url(#${id}-perf)`}>
        <rect x="2" y="2" width="74" height="92" fill="#efe4cf" />
        <rect x="8" y="8" width="62" height="80" fill="none" stroke="#b3312c" strokeWidth="1.2" />
        <g stroke="#1b2a4a" strokeWidth="1.3" fill="none" opacity="0.85">
          {/* 판화풍 산·수평선 위를 나는 비행기 */}
          <path d="M14 66l14-18 10 12 9-14 17 20" />
          <path d="M14 74h50" opacity="0.4" />
          <path d="M30 34l18-8-6 9 8 3-16 6 2-6-6-4Z" fill="#1b2a4a" stroke="none" opacity="0.9" />
        </g>
        <text x="39" y="84" textAnchor="middle" fontSize="6.4" letterSpacing="1.6" fill="#b3312c">
          {label}
        </text>
      </g>
    </svg>
  )
}

export function PaperPlane({ className, id = 'plane' }: { className?: string; id?: string }) {
  return (
    <svg viewBox="-14 -10 28 20" className={className} aria-hidden id={id}>
      <path d="M-12 0 12 -7 4 0 12 7Z" fill="#1b2a4a" opacity="0.9" />
      <path d="M-12 0 12 -7 2 1Z" fill="#1b2a4a" opacity="0.55" />
    </svg>
  )
}
