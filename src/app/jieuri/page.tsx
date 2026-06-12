import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Image from 'next/image'
import { RegisterForm } from './RegisterForm'

const TITLE = '지으리 — 말하면, 지으리'
const DESCRIPTION =
  '코드 몰라도 됩니다. 채팅으로 직접 웹사이트를 만들고, 막히면 현직 개발자가 대신 고쳐드려요. 사전등록하면 평생 50% 할인 — 선착순 100명.'

const JIEURI_ORIGIN = 'https://jieuri.com'
const EASYSITE_ORIGIN = 'https://easysite-sage.vercel.app'

function onJieuriHost(): boolean {
  const h = headers()
  const host = (h.get('x-forwarded-host') ?? h.get('host') ?? '')
    .toLowerCase()
    .split(':')[0]
  return host === 'jieuri.com' || host === 'www.jieuri.com'
}

// 같은 /jieuri 라우트가 두 호스트로 노출되므로 호스트별로 색인/정본을 분기한다.
//  - jieuri.com    : index 허용 + canonical·OG = https://jieuri.com
//  - EasySite 도메인 : noindex 유지(중복 색인 방지), 정본은 jieuri.com 으로 통일
// (headers() 사용으로 이 라우트는 요청 시 렌더 — 정적 prerender 아님)
export async function generateMetadata(): Promise<Metadata> {
  const jieuri = onJieuriHost()
  return {
    metadataBase: new URL(jieuri ? JIEURI_ORIGIN : EASYSITE_ORIGIN),
    title: { absolute: TITLE },
    description: DESCRIPTION,
    alternates: { canonical: JIEURI_ORIGIN },
    robots: jieuri
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      siteName: '지으리',
      url: JIEURI_ORIGIN,
      title: TITLE,
      description: DESCRIPTION,
    },
    twitter: {
      card: 'summary_large_image',
      title: TITLE,
      description: DESCRIPTION,
    },
  }
}

const empathy = [
  {
    pain: '견적 받아보니 몇백만원… 시작도 못 했어요',
    solution: '월 구독으로 부담 없이 시작해요',
  },
  {
    pain: '해외 노코드 툴 써봤는데 토스 결제·카톡채널·네이버 등록에서 막혔어요',
    solution: '한국형 연동, 처음부터 기본으로 들어가 있어요',
  },
  {
    pain: '만들다 막히면 물어볼 데가 없어요',
    solution: '외주 100건+ 현직 개발자가 직접 수정해드려요',
  },
]

const steps = [
  {
    title: '업종 고르고 질문 몇 개 답하기',
    desc: '딱 5분이면 돼요. 글 쓸 필요 없어요.',
    icon: ClipboardIcon,
  },
  {
    title: 'AI가 만든 사이트를 채팅으로 수정',
    desc: '“여기 색 바꿔줘” 하면 바로 바뀌어요.',
    icon: ChatIcon,
  },
  {
    title: '내 도메인으로 바로 출시',
    desc: '복잡한 설정 없이 한 번에 올라가요.',
    icon: RocketIcon,
  },
]

// 제작 사례 — EasySite 레포에 있는 실제 운영 사이트 스크린샷(public/portfolio) 재사용.
// 상호명 텍스트는 강조하지 않고 업종 라벨만 노출(이미지 안에 보이는 상호는 그대로).
const cases = [
  { image: '/portfolio/prismedu.png', label: 'AI 서비스', alt: 'AI 서비스 제작 사례 화면' },
  {
    image: '/portfolio/conatusipsi.png',
    label: '교육 플랫폼',
    alt: '교육 플랫폼 제작 사례 화면',
  },
  {
    image: '/portfolio/digitalst.png',
    label: '디지털 카탈로그',
    alt: '디지털 카탈로그 제작 사례 화면',
  },
  {
    image: '/portfolio/kbgroup.png',
    label: '기업 홈페이지',
    alt: '기업 홈페이지 제작 사례 화면',
  },
]

export default function JieuriPage() {
  return (
    <>
      {/* 자체 헤더 (EasySite 글로벌 헤더와 독립) */}
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-lg font-extrabold tracking-tight text-gray-900">
            지으리
          </span>
          <a
            href="#register"
            className="inline-flex h-10 items-center rounded-lg bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            사전등록
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* 1. 히어로 */}
        <section className="bg-hero-mesh">
          <div className="mx-auto max-w-3xl px-6 pb-16 pt-14 text-center sm:pb-20 sm:pt-20">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-700">
              🌱 지으리 사전등록 모집 중
            </span>
            <h1 className="mt-6 text-[34px] font-extrabold leading-[1.15] tracking-[-0.02em] text-gray-900 sm:text-5xl">
              코드 몰라도 됩니다.
            </h1>
            <h2 className="mt-2 text-3xl font-extrabold leading-[1.15] tracking-[-0.02em] text-indigo-600 sm:text-5xl">
              말하면, 지으리.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              개발자한테 300만원 주고 3주 기다리지 마세요. 채팅으로 직접 만들면 월
              구독, 막히면 현직 개발자가 대신 고쳐드립니다.
            </p>
            <div className="mt-9">
              <a
                href="#register"
                className="cta-glow inline-flex h-14 items-center justify-center rounded-xl bg-indigo-600 px-7 text-base font-bold text-white transition hover:bg-indigo-700 sm:h-16 sm:px-9 sm:text-lg"
              >
                사전등록하고 평생 50% 할인받기
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              선착순 100명 · 출시하면 딱 한 번만 연락드려요
            </p>
          </div>
        </section>

        {/* 2. 공감 섹션 */}
        <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <h2 className="text-center text-2xl font-extrabold tracking-[-0.01em] text-gray-900 sm:text-3xl">
            이런 적, 있으셨죠?
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {empathy.map((item) => (
              <div
                key={item.pain}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-xs"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-7 w-7 text-gray-200"
                >
                  <path d="M7.17 6A5.17 5.17 0 0 0 2 11.17V18h6.83v-6.83H5.5A3.67 3.67 0 0 1 9.17 8V6h-2Zm10 0A5.17 5.17 0 0 0 12 11.17V18h6.83v-6.83H15.5A3.67 3.67 0 0 1 19.17 8V6h-2Z" />
                </svg>
                <p className="mt-3 flex-1 text-[15px] font-semibold leading-relaxed text-gray-800">
                  {item.pain}
                </p>
                <div className="mt-5 flex items-start gap-2.5 border-t border-gray-100 pt-4">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3"
                    >
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  </span>
                  <p className="text-[15px] font-bold leading-relaxed text-indigo-700">
                    {item.solution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. 작동 방식 3스텝 */}
        <section className="border-y border-gray-100 bg-gray-50/60">
          <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
            <h2 className="text-center text-2xl font-extrabold tracking-[-0.01em] text-gray-900 sm:text-3xl">
              이렇게 만들어져요
            </h2>
            <p className="mt-3 text-center text-base text-gray-600">
              어렵게 생각 안 하셔도 돼요. 3단계면 끝나요.
            </p>
            <ol className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
              {steps.map((step, i) => {
                const Icon = step.icon
                return (
                  <li key={step.title} className="relative text-center sm:text-left">
                    <div className="flex items-center justify-center gap-3 sm:justify-start">
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-lg font-extrabold text-white shadow-brand">
                        {i + 1}
                      </span>
                      <span
                        aria-hidden="true"
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-indigo-600 ring-1 ring-gray-200"
                      >
                        <Icon />
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-gray-600">
                      {step.desc}
                    </p>
                  </li>
                )
              })}
            </ol>
          </div>
        </section>

        {/* 4. 신뢰 섹션 */}
        <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-amber-200 bg-amber-50 px-4 py-2">
              <span aria-hidden="true" className="flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </span>
              <span className="text-sm font-bold text-amber-900">
                숨고 평점 5.0
              </span>
            </div>
            <h2 className="mt-5 text-2xl font-extrabold tracking-[-0.01em] text-gray-900 sm:text-3xl">
              이미 이렇게 만들어 드렸어요
            </h2>
            <p className="mt-3 max-w-md text-base text-gray-600">
              말로만 하는 게 아니라, 실제로 만들어 운영 중인 사이트들이에요.
            </p>
          </div>

          {/* 제작 사례 — 실제 운영 중인 사이트 스크린샷 (모바일 2열). next/image가 webp로 최적화 */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {cases.map((c) => (
              <figure
                key={c.image}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-50">
                  <Image
                    src={c.image}
                    alt={c.alt}
                    fill
                    sizes="(min-width: 640px) 25vw, 50vw"
                    className="object-cover object-top"
                  />
                </div>
                <figcaption className="px-3 py-3 text-center">
                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                    {c.label}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* 5. 사전등록 폼 */}
        <section
          id="register"
          className="scroll-mt-6 border-t border-gray-100 bg-gray-50/60"
        >
          <div className="mx-auto max-w-xl px-6 py-16 sm:py-20">
            <div className="text-center">
              <h2 className="text-2xl font-extrabold tracking-[-0.01em] text-gray-900 sm:text-3xl">
                사전등록하고 평생 50% 할인받기
              </h2>
              <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-gray-600">
                선착순 100명만 모셔요. 아래 6개만 답해주시면 끝 — 출시되면 가장
                먼저 알려드릴게요.
              </p>
            </div>

            <div className="mt-9 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs sm:p-8">
              <RegisterForm />
            </div>
          </div>
        </section>
      </main>

      {/* 자체 푸터 — 사업자 정보 (개인정보 수집 페이지 신뢰·고지) */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-10 text-center">
          <p className="text-base font-extrabold tracking-tight text-gray-900">
            지으리
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-gray-500">
            프리즘 · 대표 안홍준 · 사업자등록번호 672-35-01596
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> · </span>
            <a
              href="tel:01037825418"
              className="transition hover:text-gray-700"
            >
              010-3782-5418
            </a>
          </p>
          <p className="mt-4 text-xs text-gray-400">
            © 2026 지으리. 남겨주신 연락처는 출시 안내 목적으로만 사용하고, 딱 한
            번만 연락드려요.
          </p>
        </div>
      </footer>
    </>
  )
}

/* ── 아이콘 (단색, currentColor) ───────────────────────────── */

function ClipboardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8A8.38 8.38 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z" />
    </svg>
  )
}

function RocketIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 7.1-1.01L12 2Z" />
    </svg>
  )
}
