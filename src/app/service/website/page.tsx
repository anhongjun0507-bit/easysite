import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
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

const TITLE = '웹사이트 제작·홈페이지 제작 | 지으리'
const DESCRIPTION =
  '웹사이트·홈페이지 제작 — 회사·가게 소개부터 쇼핑몰·예약·랜딩페이지까지 현직 개발자가 직접 제작합니다. 숨고 평점 5.0, 1분 무료 견적으로 홈페이지 제작 비용을 바로 확인하세요.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/service/website' },
  openGraph: { title: TITLE, description: DESCRIPTION, url: '/service/website', type: 'website' },
}

const types = [
  { title: '회사·가게 소개', desc: '브랜드·서비스·연락처·오시는 길을 단정하게.', href: '/wizard?intent=회사소개' },
  { title: '쇼핑몰', desc: '상품 진열부터 장바구니·결제까지.', href: '/wizard?intent=쇼핑몰' },
  { title: '예약·회원제', desc: '예약 받기, 회원가입, 멤버 전용 페이지.', href: '/wizard?intent=예약' },
  { title: '랜딩페이지', desc: '한 페이지로 이벤트·캠페인 전환.', href: '/wizard?intent=랜딩페이지' },
]

const cases: LpCase[] = [
  { image: '/portfolio/prismedu.png', label: '교육 플랫폼', alt: '교육 플랫폼 웹사이트 제작 사례' },
  { image: '/portfolio/digitalst.png', label: '쇼핑몰', alt: '쇼핑몰 제작 사례' },
  { image: '/portfolio/kbgroup.png', label: '기업 홈페이지', alt: '기업 홈페이지 제작 사례' },
  { image: '/portfolio/soc-architects.png', label: '건축 포트폴리오', alt: '건축사무소 웹사이트 제작 사례' },
]

const faqs: LpFaq[] = [
  {
    q: '웹사이트 제작 비용은 얼마인가요?',
    a: '랜딩페이지는 50만원대, 회사·가게 소개는 100만원대, 쇼핑몰은 150만원대부터 시작합니다(런칭 이벤트가 기준). 페이지 수·기능에 따라 달라지며, 1분 견적에서 정확한 금액을 확인할 수 있어요.',
  },
  {
    q: '제작 기간은 얼마나 걸리나요?',
    a: '규모에 따라 보통 2~5주입니다. 급하시면 2주 빠른 납기 옵션도 선택할 수 있어요.',
  },
  {
    q: '어떤 종류의 사이트를 만들 수 있나요?',
    a: '회사·가게 소개, 쇼핑몰, 예약·회원제, 랜딩페이지 등 대부분의 홈페이지를 만들 수 있어요. 토스 결제, 관리자 페이지, AI 챗봇도 추가할 수 있습니다.',
  },
  {
    q: '코딩을 몰라도 되나요?',
    a: '네. 질문 몇 개에 답만 하시면 외주 100건 이상의 현직 개발자가 직접 제작합니다.',
  },
  {
    q: '만든 다음에 수정도 되나요?',
    a: '출시 후에도 막히는 부분은 현직 개발자가 직접 도와드립니다.',
  },
  {
    q: '도메인 연결과 검색 노출도 도와주나요?',
    a: '내 도메인 연결부터 네이버·구글 검색 등록까지 함께 안내해드려요.',
  },
]

const JSONLD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      '@id': `${SITE_URL}/service/website#service`,
      name: '웹사이트·홈페이지 제작',
      serviceType: '웹사이트 제작',
      url: `${SITE_URL}/service/website`,
      areaServed: 'KR',
      description: DESCRIPTION,
      provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/service/website#faq`,
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
        { '@type': 'ListItem', position: 2, name: '웹사이트 제작', item: `${SITE_URL}/service/website` },
      ],
    },
  ],
}

export default function ServiceWebsitePage() {
  return (
    <>
      <JsonLd data={JSONLD} />

      {/* 히어로 */}
      <section className="mx-auto max-w-3xl px-6 pb-10 pt-12 text-center sm:pt-16">
        <div className="flex justify-center">
          <TrustBadge />
        </div>
        <h1 className="mt-6 text-[30px] font-extrabold leading-[1.15] tracking-[-0.03em] text-gray-900 sm:text-[42px]">
          웹사이트·홈페이지 제작
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-gray-600 sm:text-[18px]">
          회사·가게 소개부터 쇼핑몰·예약·랜딩페이지까지. 소상공인과 스타트업을 위한
          홈페이지를 현직 개발자가 직접 만들어드립니다. 외주 100건 이상·숨고 평점 5.0 —
          질문 몇 개면 1분 만에 예상 견적과 시안 초안이 나와요.
        </p>
        <div className="mt-9 flex justify-center">
          <CtaGroup
            primary={{ href: '/wizard', label: '1분 무료 견적 받기' }}
            secondary={{ href: '/consult', label: '상담 신청' }}
            align="center"
          />
        </div>
      </section>

      {/* 만들 수 있는 유형 */}
      <section className="border-t border-gray-100 bg-gray-50/70">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <h2 className="text-center text-[24px] font-extrabold tracking-[-0.02em] text-gray-900 sm:text-[30px]">
            이런 사이트를 만들어요
          </h2>
          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {types.map((t) => (
              <Link
                key={t.title}
                href={t.href}
                className="group flex flex-col rounded-2xl border border-gray-200/80 bg-white p-5 transition hover:-translate-y-0.5 hover:border-gray-300"
              >
                <span className="text-[16px] font-bold text-gray-900">{t.title}</span>
                <span className="mt-1.5 flex-1 text-[14px] leading-relaxed text-gray-600">{t.desc}</span>
                <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-indigo-600">
                  견적 보기
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 가격 */}
      <section className="border-t border-gray-100">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="text-center">
            <h2 className="text-[24px] font-extrabold tracking-[-0.02em] text-gray-900 sm:text-[30px]">
              웹사이트 제작 비용
            </h2>
            <p className="mt-3 text-[15px] text-gray-600">
              런칭 이벤트가 · 5페이지 기준 시작가. 정확한 금액은 1분 견적에서 확인하세요.
            </p>
          </div>
          <div className="mt-9">
            <PriceTable
              rows={[
                { label: '랜딩페이지', price: '50만원~', note: '한 페이지 캠페인' },
                { label: '회사·가게 소개', price: '100만원~', note: '기본 정보·문의' },
                { label: '예약·회원제', price: '130만원~', note: '예약·회원가입' },
                { label: '쇼핑몰', price: '150만원~', note: '상품·결제까지' },
              ]}
            />
          </div>
          <div className="mt-6 text-center">
            <Link href="/pricing" className="text-[14px] font-semibold text-indigo-600 underline underline-offset-4">
              자세한 가격표 보기 →
            </Link>
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
                { title: '1분 견적', desc: '질문 몇 개로 예상 견적·시안을 확인해요.' },
                { title: '상담·확정', desc: '현직 개발자가 범위·일정을 맞춰드려요.' },
                { title: '제작·출시', desc: '내 도메인으로 출시하고, 이후도 챙겨드려요.' },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 사례 */}
      <section className="border-t border-gray-100">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <h2 className="text-center text-[24px] font-extrabold tracking-[-0.02em] text-gray-900 sm:text-[30px]">
            이미 만들어 운영 중인 사이트
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
            왜 지으리에서 만들까요?
          </h2>
          <div className="mt-8">
            <CheckPoints
              points={[
                '외주 100건+ 현직 개발자가 직접 제작 — 숨고 평점 5.0',
                '토스 결제·카톡 채널·네이버 등록까지 한국형 연동 기본 포함',
                '1분이면 예상 견적·기간이 바로 나와 비교가 쉬워요',
                '출시 후에도 막히면 직접 고쳐드려요',
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
            지금 1분이면, 견적이 나옵니다
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[16px] text-gray-600">
            고민될 땐 일단 견적부터. 부담 없이 받아보세요.
          </p>
          <div className="mt-8 flex justify-center">
            <CtaGroup
              primary={{ href: '/wizard', label: '1분 무료 견적 받기' }}
              secondary={{ href: '/consult', label: '상담 신청' }}
              align="center"
            />
          </div>
          <p className="mt-6 text-[14px] text-gray-500">
            앱도 만드시나요?{' '}
            <Link href="/service/app" className="font-semibold text-indigo-600 underline underline-offset-4">
              앱 개발 보기 →
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
