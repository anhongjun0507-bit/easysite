import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/JsonLd'
import { SITE_URL, SITE_NAME } from '@/lib/site'
import {
  CasesGrid,
  CheckPoints,
  CtaGroup,
  FaqList,
  PriceTable,
  StepsRow,
  TrustBadge,
  type LpCase,
  type LpFaq,
} from '@/components/marketing/parts'

const TITLE = '앱 개발 — iOS·안드로이드 모바일 앱 제작 | 지으리'
const DESCRIPTION =
  '앱 개발 — iOS·안드로이드 모바일 앱을 기획부터 출시까지. 현직 개발자가 함께하는 앱 제작, 1분 견적 또는 전문가 상담으로 앱 개발 비용을 미리 확인하세요.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/service/app' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/service/app', type: 'website' },
}

const QUOTE = '/wizard?intent=앱개발'

const kinds = [
  { title: '정보·예약 앱', desc: '메뉴·콘텐츠·예약을 손안에서.' },
  { title: '커머스 앱', desc: '상품·장바구니·결제까지 모바일로.' },
  { title: '멤버십·구독 앱', desc: '회원·포인트·정기결제 운영.' },
  { title: '사내·관리 앱', desc: '업무·재고·현장 관리 자동화.' },
]

const cases: LpCase[] = [
  { image: '/portfolio/sellfit.png', label: '거래 플랫폼', alt: '거래 플랫폼 앱·서비스 제작 사례' },
  { image: '/portfolio/conatusipsi.png', label: 'AI 분석 서비스', alt: 'AI 분석 서비스 제작 사례' },
  { image: '/portfolio/prismedu.png', label: '교육 플랫폼', alt: '교육 플랫폼 제작 사례' },
  { image: '/portfolio/digitalst.png', label: '커머스', alt: '커머스 서비스 제작 사례' },
]

const faqs: LpFaq[] = [
  {
    q: '앱 개발 비용은 얼마인가요?',
    a: '기본형 앱은 400만원대부터 시작합니다(런칭 이벤트가 기준). 앱은 기능·범위에 따라 차이가 크기 때문에, 1분 견적이나 상담에서 정확한 금액을 안내드려요.',
  },
  {
    q: 'iOS와 안드로이드 둘 다 되나요?',
    a: '네. 두 플랫폼을 함께 만들 수 있고, 예산·일정에 맞춰 크로스플랫폼 등 효율적인 방식을 제안드려요.',
  },
  {
    q: '아이디어만 있는데 가능한가요?',
    a: '물론이에요. 기획·화면 설계부터 같이 잡아드리니 부담 없이 상담 주세요.',
  },
  {
    q: '제작 기간은 얼마나 걸리나요?',
    a: '앱은 범위에 따라 기간 차이가 큽니다. 견적·상담에서 일정을 구체적으로 안내드려요.',
  },
  {
    q: '앱스토어 출시도 해주나요?',
    a: '앱스토어·플레이스토어 출시와 이후 기능 추가·업데이트까지 이어서 도와드립니다.',
  },
  {
    q: '웹사이트도 같이 만들 수 있나요?',
    a: '네. 웹과 앱을 함께 기획해 효율적으로 제안해드릴 수 있어요.',
  },
]

const JSONLD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      '@id': `${SITE_URL}/service/app#service`,
      name: '앱 개발 (iOS·안드로이드)',
      serviceType: '모바일 앱 개발',
      url: `${SITE_URL}/service/app`,
      areaServed: 'KR',
      description: DESCRIPTION,
      provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/service/app#faq`,
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: '앱 개발', item: `${SITE_URL}/service/app` },
      ],
    },
  ],
}

export default function ServiceAppPage() {
  return (
    <>
      <JsonLd data={JSONLD} />

      {/* 히어로 */}
      <section className="mx-auto max-w-3xl px-6 pb-10 pt-12 text-center sm:pt-16">
        <div className="flex justify-center">
          <TrustBadge />
        </div>
        <h1 className="mt-6 text-[30px] font-extrabold leading-[1.15] tracking-[-0.03em] text-gray-900 sm:text-[42px]">
          앱 개발 — iOS·안드로이드 모바일 앱 제작
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-gray-600 sm:text-[18px]">
          아이디어만 있어도 괜찮아요. 기획·디자인·개발·출시까지, 현직 개발자가 함께
          모바일 앱을 만들어드립니다. 바로 예상 견적을 받거나 전문가 상담으로 차근차근 —
          편한 쪽으로 시작하세요.
        </p>
        <div className="mt-9 flex justify-center">
          <CtaGroup
            primary={{ href: QUOTE, label: '1분 앱 견적 받기' }}
            secondary={{ href: '/consult', label: '전문가 상담' }}
            align="center"
          />
        </div>
      </section>

      {/* 만들 수 있는 앱 */}
      <section className="border-t border-gray-100 bg-gray-50/70">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <h2 className="text-center text-[24px] font-extrabold tracking-[-0.02em] text-gray-900 sm:text-[30px]">
            이런 앱을 만들어요
          </h2>
          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {kinds.map((k) => (
              <div
                key={k.title}
                className="flex flex-col rounded-2xl border border-gray-200/80 bg-white p-5"
              >
                <span className="text-[16px] font-bold text-gray-900">{k.title}</span>
                <span className="mt-1.5 text-[14px] leading-relaxed text-gray-600">{k.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 가격 */}
      <section className="border-t border-gray-100">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="text-center">
            <h2 className="text-[24px] font-extrabold tracking-[-0.02em] text-gray-900 sm:text-[30px]">
              앱 개발 비용
            </h2>
            <p className="mt-3 text-[15px] text-gray-600">
              런칭 이벤트가 기준 시작가. 앱은 범위에 따라 차이가 커요 — 1분 견적·상담에서 정확히 잡아드립니다.
            </p>
          </div>
          <div className="mt-9">
            <PriceTable
              rows={[
                { label: '기본형 앱', price: '400만원~', note: '핵심 기능 위주' },
                { label: '기능형 앱', price: '520만원~', note: '로그인·결제·알림' },
                { label: '플랫폼·대형', price: '680만원~', note: '관리자·고도화' },
                { label: '맞춤 견적', price: '상담', note: '복잡한 요구사항' },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 작동 방식 */}
      <section className="border-t border-gray-100 bg-gray-50/70">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <h2 className="text-center text-[24px] font-extrabold tracking-[-0.02em] text-gray-900 sm:text-[30px]">
            이렇게 진행돼요
          </h2>
          <div className="mt-12">
            <StepsRow
              steps={[
                { title: '견적 또는 상담', desc: '1분 견적으로 빠르게, 또는 상담으로 차근차근.' },
                { title: '기획·디자인', desc: '화면 설계와 디자인을 함께 확정해요.' },
                { title: '개발·출시', desc: '개발 후 앱스토어·플레이스토어에 올려드려요.' },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 사례 */}
      <section className="border-t border-gray-100">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <h2 className="text-center text-[24px] font-extrabold tracking-[-0.02em] text-gray-900 sm:text-[30px]">
            만들어 온 서비스들
          </h2>
          <div className="mt-10">
            <CasesGrid items={cases} />
          </div>
          <div className="mt-8 text-center">
            <Link href="/portfolio" className="text-[14px] font-semibold text-indigo-600 underline underline-offset-4">
              전체 포트폴리오 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* 왜 지으리 */}
      <section className="border-t border-gray-100 bg-gray-50/70">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <h2 className="text-[24px] font-extrabold tracking-[-0.02em] text-gray-900 sm:text-[30px]">
            앱, 막막한 부분부터 풀어드려요
          </h2>
          <div className="mt-8">
            <CheckPoints
              points={[
                '아이디어만 있어도 OK — 기획·화면 설계부터 함께',
                'iOS·안드로이드, 상황에 맞는 방식으로 효율적으로 제작',
                '결제·푸시 알림·관리자까지 실제 운영 기능 포함',
                '앱스토어·플레이스토어 출시와 이후 업데이트까지',
              ]}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-100">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <h2 className="text-center text-[24px] font-extrabold tracking-[-0.02em] text-gray-900 sm:text-[30px]">
            자주 묻는 질문
          </h2>
          <div className="mt-9">
            <FaqList items={faqs} />
          </div>
        </div>
      </section>

      {/* 하단 CTA */}
      <section className="border-t border-gray-100 bg-gray-50/70">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="text-[26px] font-extrabold tracking-[-0.02em] text-gray-900 sm:text-[32px]">
            앱, 일단 견적부터 받아보세요
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[16px] text-gray-600">
            1분이면 예상 비용이 나와요. 상담이 편하시면 바로 신청하셔도 됩니다.
          </p>
          <div className="mt-8 flex justify-center">
            <CtaGroup
              primary={{ href: QUOTE, label: '1분 앱 견적 받기' }}
              secondary={{ href: '/consult', label: '전문가 상담' }}
              align="center"
            />
          </div>
          <p className="mt-6 text-[14px] text-gray-500">
            웹사이트가 필요하신가요?{' '}
            <Link href="/service/website" className="font-semibold text-indigo-600 underline underline-offset-4">
              웹사이트 제작 보기 →
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
