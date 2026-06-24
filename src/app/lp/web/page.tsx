import type { Metadata } from 'next'
import {
  CasesGrid,
  CheckPoints,
  CtaGroup,
  FaqList,
  PriceTable,
  StepsRow,
  StickyBar,
  TrustBadge,
  type LpCase,
} from '@/components/marketing/parts'
import { LpRef } from '../_components/LpRef'

const TITLE = '웹사이트 제작 — 현직 개발자 1분 무료 견적 | 지으리'
const DESCRIPTION =
  '홈페이지·웹사이트 제작, 1분이면 예상 견적이 나옵니다. 숨고 평점 5.0 현직 개발자가 직접 제작. 지금 무료로 견적과 시안을 받아보세요.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, type: 'website' },
}

const QUOTE = '/wizard'
const CONSULT = '/consult'

const cases: LpCase[] = [
  { image: '/portfolio/prismedu.png', label: '교육 플랫폼', alt: '교육 플랫폼 제작 사례' },
  { image: '/portfolio/digitalst.png', label: '쇼핑몰', alt: '쇼핑몰 제작 사례' },
  { image: '/portfolio/kbgroup.png', label: '기업 홈페이지', alt: '기업 홈페이지 제작 사례' },
  { image: '/portfolio/nomorenusu.png', label: '서비스 사이트', alt: '서비스 사이트 제작 사례' },
]

export default function LpWebPage() {
  return (
    <>
      <LpRef source="lpweb" />

      {/* 히어로 */}
      <section className="mx-auto max-w-3xl px-6 pb-10 pt-12 text-center sm:pt-16">
        <div className="flex justify-center">
          <TrustBadge />
        </div>
        <h1 className="mt-6 text-[32px] font-extrabold leading-[1.12] tracking-[-0.03em] text-gray-900 sm:text-[46px]">
          웹사이트 제작,
          <br />
          <span className="text-indigo-600">1분 견적</span>부터.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-gray-600 sm:text-[18px]">
          홈페이지·쇼핑몰·예약 사이트까지. 질문 몇 개에 답하면 예상 견적과 시안
          초안을 바로 보여드려요. 막히는 부분은 현직 개발자가 끝까지 만들어드립니다.
        </p>
        <div className="mt-9 flex justify-center">
          <CtaGroup
            primary={{ href: QUOTE, label: '1분 무료 견적 받기' }}
            secondary={{ href: CONSULT, label: '바로 상담 신청' }}
            align="center"
          />
        </div>
        <p className="mt-3 text-[13px] text-gray-500">가입 없이 · 무료 · 영업일 24시간 안에 연락</p>
      </section>

      {/* 신뢰 포인트 */}
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

      {/* 가격 투명성 */}
      <section className="border-t border-gray-100">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="text-center">
            <h2 className="text-[24px] font-extrabold tracking-[-0.02em] text-gray-900 sm:text-[30px]">
              가격, 미리 투명하게
            </h2>
            <p className="mt-3 text-[15px] text-gray-600">
              5페이지 기준 시작가. 정확한 금액은 1분 견적에서 확인하세요.
            </p>
          </div>
          <div className="mt-9">
            <PriceTable
              rows={[
                { label: '랜딩페이지', price: '80만원~', note: '한 페이지 캠페인' },
                { label: '회사·가게 소개', price: '150만원~', note: '기본 정보·문의' },
                { label: '예약·회원제', price: '200만원~', note: '예약·회원가입' },
                { label: '쇼핑몰', price: '250만원~', note: '상품·결제까지' },
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
                { title: '1분 견적 받기', desc: '질문 몇 개 답하면 예상 견적·시안이 나와요.' },
                { title: '상담으로 확정', desc: '현직 개발자가 직접 범위·일정을 맞춰드려요.' },
                { title: '제작 후 출시', desc: '내 도메인으로 출시하고, 이후도 챙겨드려요.' },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 제작 사례 */}
      <section className="border-t border-gray-100">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <h2 className="text-center text-[24px] font-extrabold tracking-[-0.02em] text-gray-900 sm:text-[30px]">
            이미 이렇게 만들어 드렸어요
          </h2>
          <p className="mt-3 text-center text-[15px] text-gray-600">
            실제로 운영 중인 사이트들이에요.
          </p>
          <div className="mt-10">
            <CasesGrid items={cases} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-100 bg-gray-50/70">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <h2 className="text-center text-[24px] font-extrabold tracking-[-0.02em] text-gray-900 sm:text-[30px]">
            자주 묻는 질문
          </h2>
          <div className="mt-9">
            <FaqList
              items={[
                {
                  q: '견적은 정말 무료인가요?',
                  a: '네, 1분 견적과 시안 초안 모두 무료입니다. 가입도 필요 없어요.',
                },
                {
                  q: '제작 기간은 얼마나 걸리나요?',
                  a: '규모에 따라 보통 2~5주입니다. 급하시면 빠른 납기도 가능해요(견적에서 선택).',
                },
                {
                  q: '결제·예약 같은 기능도 되나요?',
                  a: '토스 결제, 예약·회원, 관리자 페이지, AI 챗봇까지 추가할 수 있어요.',
                },
                {
                  q: '만든 다음에 수정은요?',
                  a: '출시 후에도 막히는 부분은 현직 개발자가 직접 도와드립니다.',
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 하단 CTA */}
      <section className="border-t border-gray-100">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h2 className="text-[26px] font-extrabold tracking-[-0.02em] text-gray-900 sm:text-[32px]">
            지금 1분이면, 견적이 나옵니다
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[16px] text-gray-600">
            고민될 땐 일단 견적부터. 부담 없이 받아보세요.
          </p>
          <div className="mt-8 flex justify-center">
            <CtaGroup
              primary={{ href: QUOTE, label: '1분 무료 견적 받기' }}
              secondary={{ href: CONSULT, label: '바로 상담 신청' }}
              align="center"
            />
          </div>
        </div>
      </section>

      <StickyBar href={QUOTE} label="1분 무료 견적" />
    </>
  )
}
