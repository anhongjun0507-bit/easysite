import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/JsonLd'
import { SITE_URL, SITE_NAME, SITE_OPERATOR } from '@/lib/site'

export const metadata: Metadata = {
  title: '소개 — 안홍준',
  description:
    '프리즘 대표 안홍준입니다. 코드 없이 말로 웹사이트를 만드는 AI 빌더 지으리를 만들고 있어요. 지금은 사전등록을 받고, 출시 전까지는 사장님 홈페이지를 직접 제작(외주)도 해드립니다.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: '소개 — 안홍준 | 지으리',
    description:
      '프리즘 대표 안홍준입니다. 코드 없이 말로 웹사이트를 만드는 AI 빌더 지으리를 만들고 있어요. 출시 전까지는 직접 제작도 해드립니다.',
    url: '/about',
  },
}

// /about Person 구조화 데이터 — 안홍준(대표) · 프리즘(운영) · 지으리(브랜드)
const ABOUT_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: '안홍준',
  url: `${SITE_URL}/about`,
  jobTitle: '대표',
  worksFor: {
    '@type': 'Organization',
    name: SITE_OPERATOR,
    url: SITE_URL,
    brand: { '@type': 'Brand', name: SITE_NAME },
  },
  knowsAbout: [
    'AI 웹사이트 제작',
    '채팅으로 홈페이지 만들기',
    '코드 없이 사이트 제작',
    '웹사이트 외주 제작',
  ],
}

// 직접 만들어 운영 중인 서비스 — "실제로 만들 수 있는 사람"이라는 신뢰 근거
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
    name: 'Waylog',
    url: 'waylog1.vercel.app',
    href: 'https://waylog1.vercel.app',
    category: '라이프스타일 SNS',
    description: '내가 산 제품·자주 쓰는 물건을 인스타그램 톤으로 기록·공유.',
  },
]

const principles: string[] = [
  '만드는 단계부터 운영 함정을 피해 설계합니다.',
  '흔한 외주와 다릅니다. 만든 사람이 끝까지 책임집니다.',
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
      <JsonLd data={ABOUT_JSONLD} />
      <Hero />
      <JieuriSection />
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
              코드 없이 말로 웹사이트를 만드는 빌더,{' '}
              <span className="font-bold text-indigo-700">지으리</span>를 만들고
              있어요.
            </p>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-gray-600 sm:text-base">
              지금은 개발 중이라 먼저 써보실 분들께 사전등록을 받고 있고, 출시
              전까지는 제가 사장님 사이트를 직접 만들어 드려요. 만든 사람이 직접
              운영까지 한다는 게 흔한 외주랑 가장 다른 점이에요.
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

// 동심원 분광 — 하나의 아이디어가 여러 결과물로 펼쳐지는 모습. 외부 라이브러리 0.
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

      <circle cx="40" cy="90" r="6" fill="url(#prism-dot)" />

      <g stroke="url(#prism-arc)" fill="none" strokeLinecap="round">
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
// I. 지으리 — 지금 만들고 있는 것 (개발 중 → 사전등록 → 출시 전 직접제작)
// ─────────────────────────────────────────────────────────
const jieuriStory: { stage: string; text: string }[] = [
  {
    stage: '지금',
    text: '빌더를 개발하면서, 먼저 써보실 분들 사전등록을 받고 있어요. (선착순 100명 · 평생 50% 할인)',
  },
  {
    stage: '출시 후',
    text: '채팅만으로 사장님이 직접 사이트를 만들고 수정해요. "여기 색 바꿔줘" 하면 바로 바뀌고요.',
  },
  {
    stage: '출시 전까지',
    text: '기다리기 어려우면, 제가 직접 만들어 드려요. 1분 견적부터 받아보세요.',
  },
]

function JieuriSection() {
  return (
    <Section roman="I" title="지으리 — 지금 만들고 있는 것">
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6 sm:p-8">
        <p className="text-base leading-relaxed text-gray-800 sm:text-lg">
          <span className="font-bold text-gray-900">지으리</span>는 채팅으로
          “이렇게 만들어줘” 하면 사이트가 만들어지는 웹사이트 빌더예요. 막히면
          현직 개발자가 대신 고쳐드리고요.
        </p>

        <ol className="mt-6 space-y-3">
          {jieuriStory.map((s) => (
            <li key={s.stage} className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex shrink-0 items-center rounded-full bg-indigo-600 px-2.5 py-1 text-[12px] font-bold text-white">
                {s.stage}
              </span>
              <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
                {s.text}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/#contact"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-bold text-white transition hover:bg-indigo-700 sm:text-[15px]"
          >
            프로젝트 문의하기
          </Link>
          <Link
            href="/wizard"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-gray-300 bg-white px-6 text-sm font-bold text-gray-900 transition hover:border-gray-400 sm:text-[15px]"
          >
            지금 견적 받기
          </Link>
        </div>
      </div>
    </Section>
  )
}

// ─────────────────────────────────────────────────────────
// II. 직접 만들어 운영 중 (신뢰 근거)
// ─────────────────────────────────────────────────────────
function ServicesSection() {
  return (
    <Section
      roman="II"
      title="직접 만들어 운영 중"
      helper="말로만 하는 게 아니라, 직접 만들어 운영하고 있는 서비스들이에요."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
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
      <div className="mt-5">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 transition hover:text-indigo-900"
        >
          제작 사례 더 보기 →
        </Link>
      </div>
    </Section>
  )
}

// ─────────────────────────────────────────────────────────
// III. 작업 방식
// ─────────────────────────────────────────────────────────
function PrinciplesSection() {
  return (
    <Section roman="III" title="작업 방식">
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
// IV. 도구
// ─────────────────────────────────────────────────────────
function ToolsSection() {
  return (
    <Section
      roman="IV"
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
// V. 연락
// ─────────────────────────────────────────────────────────
function ContactSection() {
  return (
    <Section roman="V" title="연락" last>
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
// Section shell — 로마숫자 + 제목
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
