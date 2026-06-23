import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'
import Link from 'next/link'
import {
  ArrowRight,
  Check,
  ClipboardList,
  LifeBuoy,
  MessageSquare,
  Plug,
  Rocket,
  Wallet,
} from 'lucide-react'
import { Hero } from './Hero'
import { ScrollShowcase } from './ScrollShowcase'
import { FeaturedWork } from './FeaturedWork'
import { Reveal } from './Reveal'
import { StickyCta } from './StickyCta'

const TITLE = '지으리 — 말하면, 지으리'
const DESCRIPTION =
  '코드 몰라도 됩니다. 지으리는 채팅으로 웹사이트를 만들고, 막히면 현직 개발자가 대신 고쳐드려요. AI 웹사이트 제작 — 사전등록하면 평생 50% 할인(선착순 100명).'

// 모든 호스트에서 정본은 jieuri.com 하나. (구 EasySite 도메인은 src/middleware.ts 에서 301 → jieuri.com)
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: SITE_URL },
  icons: {
    icon: [
      { url: '/jieuri-icon.svg', type: 'image/svg+xml' },
      { url: '/jieuri-favicon.ico', sizes: '32x32' },
    ],
    shortcut: '/jieuri-favicon.ico',
    apple: '/jieuri-apple-touch-icon.png',
  },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '지으리',
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
}

const empathy = [
  {
    icon: Wallet,
    pain: '견적 받아보니 몇백만원… 시작도 못 했어요',
    solution: '월 구독으로 부담 없이 시작해요',
  },
  {
    icon: Plug,
    pain: '해외 노코드 툴 써봤는데 토스 결제·카톡채널·네이버 등록에서 막혔어요',
    solution: '한국형 연동, 처음부터 기본으로 들어가 있어요',
  },
  {
    icon: LifeBuoy,
    pain: '만들다 막히면 물어볼 데가 없어요',
    solution: '외주 100건+ 현직 개발자가 직접 수정해드려요',
  },
]

const steps = [
  {
    icon: ClipboardList,
    title: '업종 고르고 질문 몇 개 답하기',
    desc: '딱 5분이면 돼요. 글 쓸 필요 없어요.',
  },
  {
    icon: MessageSquare,
    title: 'AI가 만든 사이트를 채팅으로 수정',
    desc: '“여기 색 바꿔줘” 하면 바로 바뀌어요.',
  },
  {
    icon: Rocket,
    title: '내 도메인으로 바로 출시',
    desc: '복잡한 설정 없이 한 번에 올라가요.',
  },
]

export default function JieuriPage() {
  return (
    <>
      {/* 헤더는 공용 Header(LandingChrome) 에서 렌더 — 견적/사전등록 동선 통합 */}
      <main className="flex-1">
        {/* 1. 히어로 (플래그십 — 프리미엄·3D·AI) */}
        <Hero />

        {/* 1.5. 스크롤 디바이스 쇼케이스 — 데스크탑·모바일 시연(클로바노트 톤) */}
        <ScrollShowcase />

        {/* 2. 두 갈래 CTA — 진입 직후 선택 노출. 직접 만들기(사전등록) vs 지금 맡기기(견적) */}
        <section className="border-t border-gray-100">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
            <Reveal className="text-center">
              <h2 className="text-[26px] font-extrabold tracking-[-0.02em] text-gray-900 sm:text-[34px]">
                어떻게 시작할까요?
              </h2>
              <p className="mt-3 text-[16px] leading-relaxed text-gray-600">
                직접 만들지, 지금 맡길지 — 사장님 편한 쪽으로 고르세요.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 lg:grid-cols-[1.4fr_1fr] lg:items-stretch">
              {/* 좌: 직접 만들래요 — 카드 전체 클릭 → 사전등록 폼 */}
              <Reveal>
                <Link
                  href="/register"
                  className="group flex h-full flex-col rounded-3xl bg-indigo-600 p-8 text-white shadow-[0_24px_60px_-30px_rgba(79,70,229,0.7)] transition duration-200 ease-emphasized hover:-translate-y-1 active:translate-y-0 active:scale-[0.99] sm:p-10"
                >
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[12.5px] font-bold text-white">
                    <MessageSquare className="h-4 w-4" strokeWidth={2.2} />
                    곧 출시 · 사전등록 혜택
                  </span>
                  <h3 className="mt-6 text-[26px] font-extrabold leading-tight tracking-[-0.02em] sm:text-[32px]">
                    직접 만들래요
                  </h3>
                  <p className="mt-3 max-w-md flex-1 text-[15.5px] leading-relaxed text-indigo-50">
                    채팅으로 직접 웹사이트를 만들어요. 막히면 현직 개발자가 대신
                    고쳐드려요. 지금 사전등록하면 평생 50% 할인 — 선착순 100명.
                  </p>
                  <span className="mt-8 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-white px-7 text-[16px] font-bold text-indigo-700 shadow-sm transition duration-200 ease-emphasized group-hover:-translate-y-0.5 sm:w-auto sm:self-start">
                    사전등록
                    <ArrowRight className="h-5 w-5 transition-transform duration-200 ease-emphasized group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>

              {/* 우: 지금 맡길래요 — 카드 전체 클릭 → /wizard (지금 작동하는 AI 견적) */}
              <Reveal delay={80}>
                <Link
                  href="/wizard"
                  className="group flex h-full flex-col rounded-3xl border border-gray-200 bg-white p-8 transition duration-200 ease-emphasized hover:-translate-y-1 hover:border-gray-300 active:translate-y-0 active:scale-[0.99] sm:p-10"
                >
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-[12.5px] font-bold text-gray-700">
                    <ClipboardList className="h-4 w-4 text-indigo-600" strokeWidth={2.2} />
                    지금 바로 가능
                  </span>
                  <h3 className="mt-6 text-[22px] font-bold leading-tight tracking-[-0.02em] text-gray-900 sm:text-[26px]">
                    지금 맡길래요
                  </h3>
                  <p className="mt-3 max-w-md flex-1 text-[15px] leading-relaxed text-gray-600">
                    기다리기 어려우면 지금 바로. AI가 1분 만에 견적이랑 시안 초안까지
                    만들어드려요.
                  </p>
                  <span className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 text-[15px] font-bold text-gray-900 transition duration-200 ease-emphasized group-hover:border-gray-400 sm:w-auto sm:self-start">
                    견적 받기
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-emphasized group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 3. 공감 섹션 */}
        <section className="border-t border-gray-100">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
            <Reveal>
              <h2 className="text-center text-[26px] font-extrabold tracking-[-0.02em] text-gray-900 sm:text-[34px]">
                이런 적, 있으셨죠?
              </h2>
            </Reveal>
            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {empathy.map((item, i) => {
                const Icon = item.icon
                return (
                  <Reveal key={item.pain} delay={i * 80}>
                    <div className="flex h-full flex-col rounded-2xl border border-gray-200/80 bg-white p-6 transition duration-200 ease-emphasized hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_18px_44px_-26px_rgba(17,24,39,0.35)]">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <Icon className="h-[22px] w-[22px]" strokeWidth={2} />
                      </span>
                      <p className="mt-5 flex-1 text-[15.5px] font-semibold leading-relaxed text-gray-800">
                        {item.pain}
                      </p>
                      <div className="mt-5 flex items-start gap-2 border-t border-gray-100 pt-4">
                        <Check
                          className="mt-0.5 h-[18px] w-[18px] shrink-0 text-indigo-600"
                          strokeWidth={2.5}
                        />
                        <p className="text-[15.5px] font-bold leading-snug text-gray-900">
                          {item.solution}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* 4. 작동 방식 3스텝 */}
        <section className="border-t border-gray-100/70">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
            <Reveal className="text-center">
              <h2 className="text-[26px] font-extrabold tracking-[-0.02em] text-gray-900 sm:text-[34px]">
                이렇게 만들어져요
              </h2>
              <p className="mt-3 text-[16px] text-gray-600">
                어렵게 생각 안 하셔도 돼요. 3단계면 끝나요.
              </p>
            </Reveal>

            <div className="relative mt-14">
              <div
                aria-hidden
                className="absolute inset-x-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent sm:block"
              />
              <ol className="grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-8">
                {steps.map((step, i) => {
                  const Icon = step.icon
                  return (
                    <li key={step.title}>
                      <Reveal
                        delay={i * 100}
                        className="flex flex-col items-center text-center sm:items-start sm:text-left"
                      >
                        <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white text-indigo-600 shadow-xs">
                          <Icon className="h-6 w-6" strokeWidth={2} />
                          <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white ring-2 ring-gray-50">
                            {i + 1}
                          </span>
                        </span>
                        <h3 className="mt-5 text-[17px] font-bold text-gray-900">
                          {step.title}
                        </h3>
                        <p className="mt-1.5 text-[15px] leading-relaxed text-gray-600">
                          {step.desc}
                        </p>
                      </Reveal>
                    </li>
                  )
                })}
              </ol>
            </div>
          </div>
        </section>

        {/* 5. Featured Work — 제작 사례(Lusion 톤 포트폴리오·스크롤 패럴럭스) */}
        <FeaturedWork />

      </main>

      <StickyCta />

      {/* 자체 푸터 — 사업자 정보 (개인정보 수집 페이지 신뢰·고지) */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10 text-center">
          <p className="text-base font-extrabold tracking-tight text-gray-900">
            지으리
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-gray-500">
            프리즘 · 대표 안홍준 · 사업자등록번호 672-35-01596
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> · </span>
            <a href="tel:01037825418" className="transition hover:text-gray-700">
              010-3782-5418
            </a>
          </p>
          <p className="mt-4 text-xs text-gray-400">
            © 2026 지으리. 남겨주신 연락처는 출시 안내 목적으로만 사용하고, 딱 한 번만
            연락드려요.
          </p>
        </div>
      </footer>
    </>
  )
}
