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
} from '../_components/parts'
import { LpRef } from '../_components/LpRef'

const TITLE = '앱 개발 — iOS·안드로이드 1분 견적 / 전문가 상담 | 지으리'
const DESCRIPTION =
  '앱 개발, 1분 견적 또는 전문가 상담 — 편한 쪽으로. iOS·안드로이드 모바일 앱을 기획부터 출시까지. 숨고 평점 5.0 현직 개발자가 함께합니다.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, type: 'website' },
}

// 앱 견적은 wizard 에 'app' 타입 선반영(intent=앱 → step2부터). 상담은 /consult 재사용.
const QUOTE = '/wizard?intent=앱개발'
const CONSULT = '/consult'

const cases: LpCase[] = [
  { image: '/portfolio/sellfit.png', label: '거래 플랫폼', alt: '거래 플랫폼 제작 사례' },
  { image: '/portfolio/conatusipsi.png', label: 'AI 분석 서비스', alt: 'AI 분석 서비스 제작 사례' },
  { image: '/portfolio/prismedu.png', label: '교육 플랫폼', alt: '교육 플랫폼 제작 사례' },
  { image: '/portfolio/digitalst.png', label: '커머스', alt: '커머스 제작 사례' },
]

export default function LpAppPage() {
  return (
    <>
      <LpRef source="lpapp" />

      {/* 히어로 */}
      <section className="mx-auto max-w-3xl px-6 pb-10 pt-12 text-center sm:pt-16">
        <div className="flex justify-center">
          <TrustBadge />
        </div>
        <h1 className="mt-6 text-[32px] font-extrabold leading-[1.12] tracking-[-0.03em] text-gray-900 sm:text-[46px]">
          앱 개발,
          <br />
          <span className="text-indigo-600">1분 견적</span> 또는 <span className="text-indigo-600">상담</span>.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-gray-600 sm:text-[18px]">
          iOS·안드로이드 모바일 앱을 기획부터 출시까지. 바로 예상 견적을 받아보거나,
          전문가 상담으로 차근차근 — 편한 쪽으로 시작하세요.
        </p>
        <div className="mt-9 flex justify-center">
          <CtaGroup
            primary={{ href: QUOTE, label: '1분 앱 견적 받기' }}
            secondary={{ href: CONSULT, label: '전문가 상담 신청' }}
            align="center"
          />
        </div>
        <p className="mt-3 text-[13px] text-gray-500">가입 없이 · 무료 · 영업일 24시간 안에 연락</p>
      </section>

      {/* 신뢰 포인트 */}
      <section className="border-t border-gray-100 bg-gray-50/70">
        <div className="mx-auto max-w-3xl px-6 py-14 text-center">
          <h2 className="text-[24px] font-extrabold tracking-[-0.02em] text-gray-900 sm:text-[30px]">
            앱, 막막한 부분부터 풀어드려요
          </h2>
          <div className="mt-8">
            <CheckPoints
              points={[
                '아이디어만 있어도 OK — 기획·화면 설계부터 함께 잡아요',
                'iOS·안드로이드, 상황에 맞는 방식으로 효율적으로 제작',
                '결제·푸시 알림·관리자까지 실제 운영에 필요한 기능 포함',
                '앱스토어·플레이스토어 출시와 이후 업데이트까지',
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
              앱 제작 비용, 미리 가늠해 보세요
            </h2>
            <p className="mt-3 text-[15px] text-gray-600">
              런칭 이벤트가 기준 시작가. 앱은 범위에 따라 차이가 커요 — 1분 견적·상담에서 정확히 잡아드려요.
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
          <p className="mt-3 text-center text-[15px] text-gray-600">
            실제로 운영 중인 플랫폼·서비스예요.
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
                  q: 'iOS랑 안드로이드 둘 다 되나요?',
                  a: '네. 두 플랫폼을 함께 만들 수 있고, 예산·일정에 맞춰 효율적인 방식을 제안드려요.',
                },
                {
                  q: '아이디어만 있는데 가능한가요?',
                  a: '물론이에요. 기획·화면 설계부터 같이 잡아드리니 부담 없이 상담 주세요.',
                },
                {
                  q: '기간과 비용은 어느 정도인가요?',
                  a: '앱은 범위에 따라 차이가 큽니다. 기본형은 수백만원대부터 시작하고, 정확한 금액은 견적·상담에서 안내드려요.',
                },
                {
                  q: '출시 후 업데이트도 해주나요?',
                  a: '출시뿐 아니라 이후 기능 추가·수정·운영까지 이어서 도와드립니다.',
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
            앱, 일단 견적부터 받아보세요
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[16px] text-gray-600">
            1분이면 예상 비용이 나와요. 상담이 편하시면 바로 신청하셔도 됩니다.
          </p>
          <div className="mt-8 flex justify-center">
            <CtaGroup
              primary={{ href: QUOTE, label: '1분 앱 견적 받기' }}
              secondary={{ href: CONSULT, label: '전문가 상담 신청' }}
              align="center"
            />
          </div>
        </div>
      </section>

      <StickyBar href={QUOTE} label="1분 앱 견적" />
    </>
  )
}
