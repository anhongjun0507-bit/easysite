import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '가격 안내',
  description:
    '지으리의 웹사이트 제작·앱 개발 비용 안내. 만드는 범위와 깊이에 따라 프로젝트별 맞춤 견적을 드립니다 — 무엇을 어떻게 진행하는지 보고 바로 문의하세요.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: '가격 안내 | 지으리',
    description:
      '웹사이트 제작·앱 개발 비용 — 프로젝트 규모에 맞춘 맞춤 견적. 인터랙티브 디지털 스튜디오, 지으리.',
    url: '/pricing',
  },
}

// 제공 범위 — 가격 숫자 없이 "무엇을 만드나"만. 규모는 프로젝트별 맞춤 견적.
type Scope = {
  name: string
  weekRange: string
  intro: string
  includes: string[]
  highlight?: boolean
  highlightLabel?: string
}

const scopes: Scope[] = [
  {
    name: '회사·브랜드 웹사이트',
    weekRange: '2~3주',
    intro: '브랜드를 단정하게 보여주고 싶은 회사·가게',
    includes: [
      '5~8 페이지 구성',
      '모바일 반응형',
      '카피·콘텐츠 초안 지원',
      '관리자 페이지 (옵션)',
      'Vercel 배포·도메인 연결 안내',
    ],
    highlight: true,
    highlightLabel: '가장 일반적',
  },
  {
    name: '랜딩·캠페인',
    weekRange: '1~2주',
    intro: '신규 서비스·이벤트·예약을 한 페이지에 모아두고 싶을 때',
    includes: [
      '1~2 페이지 구성',
      '모바일 반응형',
      '카피·콘텐츠 초안 지원',
      '문의 폼·신청 버튼',
      '핵심 메시지에 집중한 구성',
    ],
  },
  {
    name: '예약·회원제',
    weekRange: '4~6주',
    intro: '학원·클래스·뷰티숍·병원 등 예약과 회원 관리가 필요한 곳',
    includes: ['회원가입·로그인', '캘린더 예약', '알림 발송', '관리자 대시보드', '모바일 반응형'],
  },
  {
    name: '커머스·쇼핑몰',
    weekRange: '6~8주',
    intro: '상품 등록부터 주문·결제까지 직접 운영하는 쇼핑몰',
    includes: ['상품 등록·관리', '카트·주문 흐름', '회원 관리', '결제 연동 (옵션)', '모바일 반응형'],
  },
  {
    name: '앱·웹앱 개발',
    weekRange: '8주~',
    intro: 'iOS·안드로이드 앱, 또는 설치 없이 쓰는 웹앱이 필요할 때',
    includes: [
      'React Native 기반 크로스플랫폼',
      '로그인·푸시 알림',
      '관리자·데이터 연동',
      '웹·앱 동시 대응 (옵션)',
      '스토어 출시 안내',
    ],
  },
  {
    name: '인터랙티브·맞춤',
    weekRange: '협의',
    intro: '스크롤·모션 인터랙션이 핵심이거나, 위 유형에 없는 특수 프로젝트',
    includes: [
      '스크롤·모션 인터랙션 설계',
      '브랜드 감각의 비주얼·전환',
      '사내 도구·대시보드',
      '외부 시스템 연동',
      '범위 정리 후 견적 산정',
    ],
  },
]

const addOns: { label: string; description: string }[] = [
  { label: '온라인 결제', description: '카드·간편결제 연동. 토스페이먼츠 기준.' },
  { label: '관리자 페이지', description: '직접 글·상품·예약을 올리고 고치는 관리 화면.' },
  { label: 'AI 챗봇·자동화', description: '사이트에 24시간 AI 상담 챗봇 추가. 사이트 정보 학습 포함.' },
  { label: '빠른 일정', description: '일정 우선 처리 — 작업 큐에서 최우선으로.' },
]

const principles: string[] = [
  '프로젝트의 범위·기능·일정에 따라 비용이 달라져, 규모에 맞춰 정확히 견적 드립니다.',
  '운영자가 직접 설계·디자인·개발합니다 — 중간 단계 없이.',
  '프리즘 안홍준 대표가 처음부터 끝까지, 출시 후 운영까지 책임집니다.',
]

export default function PricingPage() {
  return (
    <>
      <Hero />
      <ScopeSection />
      <AddOnsSection />
      <PrinciplesSection />
      <CtaSection />
    </>
  )
}

// ─────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-5xl px-6 py-14 sm:px-8 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-600">PRICING</p>
        <h1
          className="mt-3 font-extrabold text-gray-900"
          style={{ fontSize: 'clamp(28px, 5vw, 44px)', lineHeight: 1.2, letterSpacing: '-0.02em' }}
        >
          프로젝트 규모에 맞춰 견적을 드립니다
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-700 sm:text-lg">
          웹사이트부터 앱·인터랙티브 경험까지 — 만들 것의 범위와 깊이에 따라 비용이 달라집니다.
          아래에서 무엇을 어떻게 진행하는지 보시고, 프로젝트를 들려주시면 규모에 맞춰 정확히 견적
          드릴게요.
        </p>
        <div className="mt-7">
          <Link
            href="/#contact"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-indigo-600 px-6 text-base font-semibold text-white transition hover:bg-indigo-700"
          >
            프로젝트 문의하기
            <Arrow />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// I. 무엇을 만드나
// ─────────────────────────────────────────────────────────
function ScopeSection() {
  return (
    <Section roman="I" title="무엇을 만드나" helper="유형별 제공 범위예요. 정확한 비용은 프로젝트 규모에 맞춰 견적 드립니다.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scopes.map((s) => (
          <ScopeCard key={s.name} scope={s} />
        ))}
      </div>
    </Section>
  )
}

function ScopeCard({ scope }: { scope: Scope }) {
  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl border bg-white p-6 transition ${
        scope.highlight
          ? 'border-indigo-500 ring-2 ring-indigo-500/15 sm:p-7'
          : 'border-gray-200 hover:border-gray-300 sm:p-7'
      }`}
    >
      {scope.highlight && scope.highlightLabel && (
        <span className="absolute -top-3 left-6 inline-flex h-6 items-center rounded-full bg-indigo-600 px-3 text-[11px] font-bold uppercase tracking-wider text-white">
          ★ {scope.highlightLabel}
        </span>
      )}

      <h3 className="text-lg font-bold text-gray-900 sm:text-xl">{scope.name}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{scope.intro}</p>
      <p className="mt-4 text-xs font-semibold tabular-nums uppercase tracking-wider text-indigo-600">
        예상 기간 · {scope.weekRange}
      </p>

      <ul className="mt-5 flex-1 space-y-2 border-t border-gray-100 pt-5">
        {scope.includes.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
            <Check />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// II. 함께 만들 수 있는 것
// ─────────────────────────────────────────────────────────
function AddOnsSection() {
  return (
    <Section
      roman="II"
      title="함께 만들 수 있는 것"
      helper="필요한 기능만 골라서 올리시면 돼요. 범위에 따라 견적에 반영됩니다."
    >
      <ul className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {addOns.map((a, i) => (
          <li
            key={a.label}
            className={`flex flex-col gap-1.5 px-5 py-5 sm:flex-row sm:items-center sm:gap-6 sm:px-6 ${
              i > 0 ? 'border-t border-gray-100' : ''
            }`}
          >
            <p className="text-base font-bold text-gray-900 sm:w-56 sm:shrink-0">{a.label}</p>
            <p className="text-sm leading-relaxed text-gray-600 sm:flex-1">{a.description}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

// ─────────────────────────────────────────────────────────
// III. 견적은 이렇게 정합니다
// ─────────────────────────────────────────────────────────
function PrinciplesSection() {
  return (
    <Section roman="III" title="견적은 이렇게 정합니다">
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {principles.map((p) => (
          <li
            key={p}
            className="rounded-xl border border-gray-200 bg-gray-50/60 p-5 text-sm leading-relaxed text-gray-700 sm:text-base"
          >
            <Dot />
            <span className="ml-2">{p}</span>
          </li>
        ))}
      </ul>
    </Section>
  )
}

// ─────────────────────────────────────────────────────────
// IV. CTA
// ─────────────────────────────────────────────────────────
function CtaSection() {
  return (
    <section>
      <div className="mx-auto max-w-5xl px-6 py-14 sm:px-8 sm:py-20">
        <div className="rounded-2xl bg-gray-900 px-6 py-10 text-center text-white sm:px-10 sm:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-300">
            정확한 견적은
          </p>
          <h2
            className="mt-3 font-extrabold"
            style={{ fontSize: 'clamp(22px, 4vw, 32px)', lineHeight: 1.25, letterSpacing: '-0.015em' }}
          >
            프로젝트를 들려주세요
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-300 sm:text-base">
            예산·일정만 알려주시면, 영업일 24시간 안에 안홍준 대표가 직접 검토해 견적과 함께
            연락드려요.
          </p>
          <div className="mt-7 flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center">
            <Link
              href="/#contact"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-indigo-600 px-6 text-base font-semibold text-white transition hover:bg-indigo-700"
            >
              프로젝트 문의하기
              <Arrow />
            </Link>
            <a
              href="tel:01037825418"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-white/20 bg-transparent px-6 text-base font-semibold text-white transition hover:bg-white/10"
            >
              <span aria-hidden="true" className="mr-1.5">📞</span>
              010-3782-5418 전화 상담
            </a>
          </div>
          <p className="mt-5 text-xs text-gray-400">
            웹사이트라면{' '}
            <Link href="/wizard" className="font-semibold text-indigo-300 underline underline-offset-2 hover:text-indigo-200">
              1분 위저드
            </Link>
            로 예상 견적을 먼저 받아볼 수도 있어요.
          </p>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// 공용 — Section shell + 아이콘
// ─────────────────────────────────────────────────────────
function Section({
  roman,
  title,
  helper,
  children,
}: {
  roman: string
  title: string
  helper?: string
  children: React.ReactNode
}) {
  return (
    <section className="border-b border-gray-100">
      <div className="mx-auto max-w-5xl px-6 py-14 sm:px-8 sm:py-20">
        <header className="mb-6 flex items-baseline gap-3 sm:mb-8">
          <span className="inline-flex h-7 items-center rounded-md bg-gray-900 px-2 font-mono text-xs font-bold tracking-wider text-white">
            {roman}
          </span>
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h2>
        </header>
        {helper && (
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
            {helper}
          </p>
        )}
        {children}
      </div>
    </section>
  )
}

function Check() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600"
    >
      <polyline points="4 11 8 15 16 6" />
    </svg>
  )
}

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="ml-1.5 h-4 w-4"
    >
      <path d="M5 10h10M11 5l5 5-5 5" />
    </svg>
  )
}

function Dot() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-1.5 w-1.5 -translate-y-0.5 rounded-full bg-indigo-600 align-middle"
    />
  )
}
