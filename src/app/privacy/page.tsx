import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: 'EasySite(프리즘)의 개인정보 수집·이용·보관·파기 방침입니다.',
}

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 sm:px-8 sm:py-24">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
        Privacy Policy
      </p>
      <h1 className="mt-3 text-4xl font-extrabold leading-[1.2] tracking-[-0.02em] text-gray-900 sm:text-5xl">
        개인정보처리방침
      </h1>
      <p className="mt-4 text-sm text-gray-500">최종 개정일: 2026년 5월 17일</p>

      <div className="mt-10 space-y-8 text-base leading-relaxed text-gray-700">
        <section>
          <h2 className="text-xl font-bold text-gray-900">
            1. 수집하는 개인정보의 항목
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-2">
            <li>견적 신청서 응답: 업종·페이지 구성·기능 요구·예산 범위</li>
            <li>연락처: 이름, 휴대전화번호, 이메일(선택)</li>
            <li>자동 수집: IP 주소, 브라우저·디바이스 정보, 접속 시각</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">
            2. 개인정보의 수집·이용 목적
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-2">
            <li>견적 산출 및 시안 제공</li>
            <li>제작 진행 안내 및 응대</li>
            <li>계약 체결 및 이행, 대금 결제</li>
            <li>서비스 개선을 위한 통계 분석 (식별 정보 제외)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">3. 보유·이용 기간</h2>
          <p className="mt-3">
            원칙적으로 수집·이용 목적 달성 후 즉시 파기합니다. 단, 관련 법령에
            따라 다음 기간 보관할 수 있습니다.
          </p>
          <ul className="mt-3 list-inside list-disc space-y-2">
            <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
            <li>대금결제 및 재화 공급에 관한 기록: 5년</li>
            <li>소비자 불만 또는 분쟁 처리에 관한 기록: 3년</li>
            <li>접속 로그: 3개월</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">
            4. 개인정보의 제3자 제공
          </h2>
          <p className="mt-3">
            회사는 정보주체의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
            다만, 법령에 의거 정부기관의 요청이 있을 경우는 예외로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">
            5. 처리 위탁
          </h2>
          <p className="mt-3">서비스 운영을 위해 다음 업무를 위탁합니다.</p>
          <ul className="mt-3 list-inside list-disc space-y-2">
            <li>Vercel Inc. — 호스팅 및 콘텐츠 전송</li>
            <li>Supabase Inc. — 데이터베이스 및 인증</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">
            6. 정보주체의 권리
          </h2>
          <p className="mt-3">
            정보주체는 언제든지 자신의 개인정보 열람·정정·삭제·처리 정지를 요청할
            수 있습니다. 아래 연락처로 문의해 주세요.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">7. 문의처</h2>
          <ul className="mt-3 space-y-1">
            <li>상호: 프리즘</li>
            <li>사업자등록번호: 672-35-01596</li>
            <li>개인정보 보호 책임자: 안홍준</li>
            <li>
              연락처:{' '}
              <a
                href="tel:01037825418"
                className="font-medium text-indigo-600 hover:text-indigo-700"
              >
                010-3782-5418
              </a>
            </li>
          </ul>
        </section>
      </div>

      <div className="mt-14 border-t border-gray-200 pt-8">
        <Link
          href="/"
          className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
        >
          ← 처음으로 돌아가기
        </Link>
      </div>
    </article>
  )
}
