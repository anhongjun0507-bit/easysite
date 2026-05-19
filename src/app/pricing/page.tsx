import type { Metadata } from 'next'
import Link from 'next/link'
import {
  AI_ADDON_MANWON,
  BASE_PRICE_MANWON,
  LUXURY_MULT,
  PAYMENT_ADDON_MANWON,
  RUSH_PRICE_MULT,
} from '@/lib/quote/calculate'

export const metadata: Metadata = {
  title: '가격표 — 사이트 유형별 시작가 | EasySite',
  description:
    '회사·가게 소개부터 쇼핑몰까지 — 사이트 유형별 시작가와 옵션 가산표를 처음부터 공개합니다. 숨고 1인 프리랜서 시세 기준.',
  openGraph: {
    title: '가격표 — 사이트 유형별 시작가 | EasySite',
    description:
      '회사·가게 소개부터 쇼핑몰까지 — 사이트 유형별 시작가와 옵션 가산표를 처음부터 공개합니다.',
  },
}

type Category = {
  id: 'company' | 'landing' | 'reservation' | 'shop' | 'custom'
  /** calculate.ts에서 가격 import. 'custom'은 협의라 가격 표시 X */
  startPriceManwon: number | null
  name: string
  weekRange: string
  intro: string
  /** 4~5개. '약속'으로 해석될 수 있는 항목(호스팅·도메인) 회피 */
  includes: string[]
  /** wizard?intent=... 로 위저드 사이트유형 프리셋 */
  wizardIntent: string
  highlight?: boolean
  highlightLabel?: string
}

// 카드별 기간은 calculate.ts(page count 기반)와 다른 도메인 —
// 사장님이 카테고리만 보고 가늠할 수 있게 별도 표시값. 위저드 결과는 페이지 수까지 반영해 더 정확.
const categories: Category[] = [
  {
    id: 'company',
    startPriceManwon: BASE_PRICE_MANWON.company,
    name: '회사·가게 소개',
    weekRange: '2~3주',
    intro: '브랜드를 단정하게 보여주고 싶은 회사·가게 사장님',
    includes: [
      '5~8 페이지 구성',
      '모바일 반응형',
      'AI 카피 초안 (회사 소개·메뉴 설명)',
      '관리자 페이지',
      'Vercel 배포·도메인 연결 안내',
    ],
    wizardIntent: '회사·가게 소개 사이트',
    highlight: true,
    highlightLabel: '가장 일반적',
  },
  {
    id: 'landing',
    startPriceManwon: BASE_PRICE_MANWON.landing,
    name: '랜딩페이지',
    weekRange: '1~2주',
    intro: '신규 서비스·이벤트·예약을 한 페이지에 모아두고 싶을 때',
    includes: [
      '1~2 페이지 구성',
      '모바일 반응형',
      'AI 카피 초안 (헤드라인 3안)',
      '문의 폼·CTA 버튼',
      '빠른 출시 (최소 1주)',
    ],
    wizardIntent: '랜딩페이지',
  },
  {
    id: 'reservation',
    startPriceManwon: BASE_PRICE_MANWON.reservation,
    name: '예약·회원제',
    weekRange: '4~6주',
    intro: '학원·클래스·뷰티숍·병원 등 예약과 회원 관리가 필요한 곳',
    includes: [
      '회원가입·로그인',
      '캘린더 예약',
      '알림 발송',
      '관리자 대시보드',
      '모바일 반응형',
    ],
    wizardIntent: '예약 회원제 사이트',
  },
  {
    id: 'shop',
    startPriceManwon: BASE_PRICE_MANWON.shop,
    name: '쇼핑몰',
    weekRange: '6~8주',
    intro: '상품 등록부터 주문·결제까지 직접 운영하는 쇼핑몰',
    includes: [
      '상품 등록·관리',
      '카트·주문 흐름',
      '회원 관리',
      '결제 연동 (옵션)',
      '모바일 반응형',
    ],
    wizardIntent: '쇼핑몰',
  },
  {
    id: 'custom',
    startPriceManwon: null,
    name: '맞춤 협의',
    weekRange: '협의',
    intro: '위 카테고리에 없는 특수 프로젝트는 직접 상담',
    includes: [
      '예: B2B SaaS, 사내 도구',
      '예: 대시보드·통계 화면',
      '예: 외부 시스템 연동',
      '범위 정리 후 견적 산정',
    ],
    wizardIntent: '맞춤형 사이트',
  },
]

type AddOn = {
  label: string
  delta: string // 표시 문자열 — "+80만원" / "×1.2" 등
  description: string
}

const addOns: AddOn[] = [
  {
    label: '결제 기능',
    delta: `+${PAYMENT_ADDON_MANWON}만원`,
    description: '온라인 카드 결제·간편결제 연동. 토스페이먼츠 기준.',
  },
  {
    label: 'AI 챗봇·자동화',
    delta: `+${AI_ADDON_MANWON}만원`,
    description:
      '사장님 사이트에 24시간 AI 상담 챗봇 추가. 사이트 정보 학습 포함.',
  },
  {
    label: '럭셔리 디자인 톤',
    delta: `×${LUXURY_MULT}`,
    description: '디테일·여백·모션을 한 단계 더 신경 쓴 시안. 럭셔리·프리미엄 브랜드용.',
  },
  {
    label: '2주 급행',
    delta: `×${RUSH_PRICE_MULT}`,
    description: '일정 우선 처리. 본인 작업 큐에서 최우선으로.',
  },
]

const trustPoints: string[] = [
  '숨고 1인 프리랜서 시세 기준',
  '운영자가 직접 제작합니다 (중간 단계 없음)',
  '프리즘 안홍준 대표가 처음부터 끝까지 책임집니다',
]

export default function PricingPage() {
  return (
    <>
      <Hero />
      <CategoriesSection />
      <AddOnsSection />
      <WhyThisPriceSection />
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
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-600">
          PRICING
        </p>
        <h1
          className="mt-3 font-extrabold text-gray-900"
          style={{
            fontSize: 'clamp(28px, 5vw, 44px)',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}
        >
          가격을 처음부터 공개합니다
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-700 sm:text-lg">
          복잡한 견적 협상 없이, 사이트 유형별 시작가를 그대로 보여드려요.
          정확한 금액은 위저드에서 페이지 수·옵션까지 반영해 ±15% 범위로 산정됩니다.
        </p>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// I. 카테고리별 시작가
// ─────────────────────────────────────────────────────────
function CategoriesSection() {
  return (
    <Section roman="I" title="유형별 시작가">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <CategoryCard key={c.id} category={c} />
        ))}
      </div>
    </Section>
  )
}

function CategoryCard({ category }: { category: Category }) {
  const isCustom = category.startPriceManwon === null
  const wizardHref = `/wizard?intent=${encodeURIComponent(category.wizardIntent)}`

  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl border bg-white p-6 transition ${
        category.highlight
          ? 'border-indigo-500 ring-2 ring-indigo-500/15 sm:p-7'
          : 'border-gray-200 sm:p-7 hover:border-gray-300'
      }`}
    >
      {category.highlight && category.highlightLabel && (
        <span className="absolute -top-3 left-6 inline-flex h-6 items-center rounded-full bg-indigo-600 px-3 text-[11px] font-bold uppercase tracking-wider text-white">
          ★ {category.highlightLabel}
        </span>
      )}

      <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
        {category.name}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
        {category.intro}
      </p>

      <div className="mt-5 flex items-baseline gap-2">
        {isCustom ? (
          <span className="text-2xl font-bold text-gray-900">협의</span>
        ) : (
          <>
            <span
              className="font-extrabold tabular-nums text-gray-900"
              style={{ fontSize: 'clamp(32px, 4vw, 40px)', lineHeight: 1 }}
            >
              {category.startPriceManwon}
            </span>
            <span className="text-base font-semibold text-gray-500">
              만원~
            </span>
          </>
        )}
      </div>
      <p className="mt-1 text-xs tabular-nums text-gray-500">
        · 예상 기간 {category.weekRange}
      </p>

      <ul className="mt-5 flex-1 space-y-2 border-t border-gray-100 pt-5">
        {category.includes.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
            <Check />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <Link
        href={wizardHref}
        className={`mt-6 inline-flex h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold transition ${
          category.highlight
            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
            : 'border border-gray-300 bg-white text-gray-800 hover:border-gray-400 hover:text-gray-900'
        }`}
      >
        {isCustom ? '맞춤 견적 받기' : '1분 위저드로 정확 견적'}
        <Arrow />
      </Link>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// II. 옵션 가산
// ─────────────────────────────────────────────────────────
function AddOnsSection() {
  return (
    <Section
      roman="II"
      title="옵션 가산"
      helper="필요한 기능만 골라서 올리시면 돼요. 위저드에서도 같은 가산이 적용됩니다."
    >
      <ul className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {addOns.map((a, i) => (
          <li
            key={a.label}
            className={`flex flex-col gap-2 px-5 py-5 sm:flex-row sm:items-center sm:gap-6 sm:px-6 ${
              i > 0 ? 'border-t border-gray-100' : ''
            }`}
          >
            <div className="flex items-baseline gap-3 sm:w-56 sm:shrink-0">
              <p className="text-base font-bold text-gray-900">{a.label}</p>
            </div>
            <p className="text-base font-bold tabular-nums text-indigo-700 sm:w-24 sm:shrink-0">
              {a.delta}
            </p>
            <p className="text-sm leading-relaxed text-gray-600 sm:flex-1">
              {a.description}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

// ─────────────────────────────────────────────────────────
// III. 왜 이 가격인가
// ─────────────────────────────────────────────────────────
function WhyThisPriceSection() {
  return (
    <Section roman="III" title="왜 이 가격인가">
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {trustPoints.map((p) => (
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
            style={{
              fontSize: 'clamp(22px, 4vw, 32px)',
              lineHeight: 1.25,
              letterSpacing: '-0.015em',
            }}
          >
            1분 안에, 미리보기까지
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-300 sm:text-base">
            8개 질문에 답하시면 영업일 24시간 안에 시안과 함께 견적을 보내드려요.
          </p>
          <div className="mt-7 flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center">
            <Link
              href="/wizard"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-indigo-600 px-6 text-base font-semibold text-white transition hover:bg-indigo-700"
            >
              1분 위저드 받기
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
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// 공용 — Section shell + 아이콘 (About 페이지와 톤 일치)
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
