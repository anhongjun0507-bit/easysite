import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '소개 — 안홍준',
  description:
    '프리즘 안홍준 대표 소개. 자체 서비스 3개(prismedu·지으리·Waylog)를 직접 운영하는 풀스택 개발자. 만드는 단계부터 운영 함정을 피해 설계합니다.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: '소개 — 안홍준 | 지으리',
    description:
      '프리즘 안홍준 대표 소개. 자체 서비스 3개(prismedu·지으리·Waylog)를 직접 운영하는 풀스택 개발자. 만드는 단계부터 운영 함정을 피해 설계합니다.',
    url: '/about',
  },
}

type Service = {
  name: string
  url: string
  href: string // 외부 링크용 (https:// 포함)
  category: string
  description: string
}

const services: Service[] = [
  {
    name: '프리즘 입시',
    url: 'prismedu.kr',
    href: 'https://prismedu.kr',
    category: '교육·입시',
    description: '한국 국제학교 학생을 위한 미국 대학 입시 컨설팅 플랫폼.',
  },
  {
    name: '지으리',
    url: 'easysite.kr',
    href: '/',
    category: '사이트 제작',
    description: '사장님 아이디어만으로 견적·시안·운영까지 자동화하는 1인 제작 플랫폼.',
  },
  {
    name: 'Waylog',
    url: 'waylog1.vercel.app',
    href: 'https://waylog1.vercel.app',
    category: '라이프스타일 SNS',
    description: '내가 산 제품·자주 쓰는 물건을 인스타그램 톤으로 기록·공유.',
  },
]

const principles: string[] = [
  '만드는 단계부터 운영 함정을 피해 설계합니다.',
  '외주가 아닙니다. 만든 사람이 끝까지 책임집니다.',
  '가격을 처음부터 공개합니다. 사장님이 가장 답답해하는 부분이라서.',
]

const tools: string[] = [
  'Next.js',
  'TypeScript',
  'Tailwind CSS',
  'React Native',
  'Supabase',
  'Claude API',
  'Vercel',
]

export default function AboutPage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <PrinciplesSection />
      <ToolsSection />
      <ContactSection />
    </>
  )
}

// ─────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-col-reverse items-center gap-10 md:flex-row md:gap-14">
          <div className="md:flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-600">
              안홍준 · 프리즘
            </p>
            <h1
              className="mt-3 font-extrabold text-gray-900"
              style={{
                fontSize: 'clamp(28px, 5vw, 44px)',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              안녕하세요, 안홍준입니다
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-gray-700 sm:text-xl">
              제가 만들고, 제가 직접 운영합니다.
            </p>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-gray-600 sm:text-base">
              자체 서비스 3개를 운영하면서, 사장님 사이트도 같이 만듭니다.
              만드는 사람과 운영하는 사람이 같다는 게 외주랑 가장 다른 점이에요.
            </p>
          </div>
          <div className="w-full max-w-[260px] shrink-0 md:max-w-[280px]">
            <PrismIllustration />
          </div>
        </div>
      </div>
    </section>
  )
}

// 동심원 분광 — C1: 1개 indigo 점에서 6개 호가 우측으로 펼쳐짐.
// 안쪽 진함 → 바깥쪽 옅음. 외부 라이브러리 0.
function PrismIllustration() {
  return (
    <svg
      viewBox="0 0 240 180"
      role="img"
      aria-label="프리즘 분광 — 하나의 아이디어가 여러 결과물로 펼쳐지는 모습"
      className="h-auto w-full"
    >
      <defs>
        <linearGradient id="prism-arc" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4338ca" />
          <stop offset="100%" stopColor="#c7d2fe" />
        </linearGradient>
        <radialGradient id="prism-dot" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#312e81" />
          <stop offset="100%" stopColor="#6366f1" />
        </radialGradient>
      </defs>

      {/* 좌측 광원 점 — 살짝 큰 indigo grad 원 */}
      <circle cx="40" cy="90" r="6" fill="url(#prism-dot)" />

      {/* 6개 동심원 우반 호 — 반지름 30 → 130 */}
      <g
        stroke="url(#prism-arc)"
        fill="none"
        strokeLinecap="round"
      >
        <path d="M 40 60 A 30 30 0 0 1 40 120" strokeWidth="2.6" opacity="0.95" />
        <path d="M 40 40 A 50 50 0 0 1 40 140" strokeWidth="2.2" opacity="0.78" />
        <path d="M 40 20 A 70 70 0 0 1 40 160" strokeWidth="1.9" opacity="0.58" />
        <path d="M 40 0  A 90 90 0 0 1 40 180" strokeWidth="1.6" opacity="0.42" />
        <path d="M 40 -20 A 110 110 0 0 1 40 200" strokeWidth="1.3" opacity="0.28" />
        <path d="M 40 -40 A 130 130 0 0 1 40 220" strokeWidth="1.1" opacity="0.16" />
      </g>
    </svg>
  )
}

// ─────────────────────────────────────────────────────────
// I. 지금 만들고 있는 것
// ─────────────────────────────────────────────────────────
function ServicesSection() {
  return (
    <Section roman="I" title="지금 만들고 있는 것">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {services.map((s) => {
          const external = s.href.startsWith('http')
          return (
            <a
              key={s.name}
              href={s.href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-sm"
            >
              <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                {s.category}
              </p>
              <p className="mt-2 text-lg font-bold text-gray-900">{s.name}</p>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-gray-600">
                {s.description}
              </p>
              <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-gray-500 transition group-hover:text-indigo-700">
                {s.url}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5 transition group-hover:translate-x-0.5"
                >
                  <path d="M5 10h10M11 5l5 5-5 5" />
                </svg>
              </p>
            </a>
          )
        })}
      </div>
    </Section>
  )
}

// ─────────────────────────────────────────────────────────
// II. 작업 방식
// ─────────────────────────────────────────────────────────
function PrinciplesSection() {
  return (
    <Section roman="II" title="작업 방식">
      <ol className="space-y-3">
        {principles.map((p, i) => (
          <li
            key={i}
            className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5"
          >
            <span
              aria-hidden="true"
              className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold tabular-nums text-indigo-700 ring-1 ring-indigo-100"
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className="text-base leading-relaxed text-gray-800 sm:text-lg">
              {p}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  )
}

// ─────────────────────────────────────────────────────────
// III. 도구
// ─────────────────────────────────────────────────────────
function ToolsSection() {
  return (
    <Section
      roman="III"
      title="도구"
      helper="실제 지으리를 만들고 운영하는 데 쓰는 것들이에요."
    >
      <ul className="flex flex-wrap gap-2">
        {tools.map((t) => (
          <li
            key={t}
            className="inline-flex h-10 items-center rounded-full border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700"
          >
            {t}
          </li>
        ))}
      </ul>
    </Section>
  )
}

// ─────────────────────────────────────────────────────────
// IV. 연락
// ─────────────────────────────────────────────────────────
function ContactSection() {
  return (
    <Section roman="IV" title="연락" last>
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 sm:gap-x-10">
          <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            전화
          </dt>
          <dd>
            <a
              href="tel:01037825418"
              className="text-base font-semibold tabular-nums text-gray-900 underline decoration-dotted decoration-gray-300 underline-offset-4 transition hover:decoration-indigo-500 hover:text-indigo-700 sm:text-lg"
            >
              010-3782-5418
            </a>
          </dd>
          <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            이메일
          </dt>
          <dd>
            <a
              href="mailto:hjan040507@gmail.com"
              className="text-base font-semibold text-gray-900 underline decoration-dotted decoration-gray-300 underline-offset-4 transition hover:decoration-indigo-500 hover:text-indigo-700 sm:text-lg"
            >
              hjan040507@gmail.com
            </a>
          </dd>
        </dl>
        <div className="mt-6 border-t border-gray-100 pt-5">
          <p className="text-sm text-gray-600">
            사이트 견적이 필요하시면 전화·이메일보다{' '}
            <Link
              href="/wizard"
              className="font-semibold text-indigo-700 underline decoration-2 underline-offset-2 hover:text-indigo-900"
            >
              1분 위저드
            </Link>
            가 더 빨라요. 영업일 24시간 안에 미리보기까지 답변드려요.
          </p>
        </div>
      </div>
    </Section>
  )
}

// ─────────────────────────────────────────────────────────
// Section shell — 로마숫자 + 제목, 닷츠 톤
// ─────────────────────────────────────────────────────────
function Section({
  roman,
  title,
  helper,
  children,
  last = false,
}: {
  roman: string
  title: string
  helper?: string
  children: React.ReactNode
  last?: boolean
}) {
  return (
    <section className={last ? '' : 'border-b border-gray-100'}>
      <div className="mx-auto max-w-5xl px-6 py-14 sm:px-8 sm:py-20">
        <header className="mb-6 flex items-baseline gap-3 sm:mb-8">
          <span className="inline-flex h-7 items-center rounded-md bg-gray-900 px-2 font-mono text-xs font-bold tracking-wider text-white">
            {roman}
          </span>
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h2>
        </header>
        {helper && (
          <p className="mb-5 text-sm text-gray-600 sm:text-base">{helper}</p>
        )}
        {children}
      </div>
    </section>
  )
}
