import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '이용약관',
  description: 'EasySite(프리즘) 서비스 이용약관입니다.',
}

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 sm:px-8 sm:py-24">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
        Terms of Service
      </p>
      <h1 className="mt-3 text-4xl font-extrabold leading-[1.2] tracking-[-0.02em] text-gray-900 sm:text-5xl">
        이용약관
      </h1>
      <p className="mt-4 text-sm text-gray-500">최종 개정일: 2026년 5월 17일</p>

      <div className="prose mt-10 max-w-none space-y-8 text-base leading-relaxed text-gray-700">
        <section>
          <h2 className="text-xl font-bold text-gray-900">제1조 (목적)</h2>
          <p className="mt-3">
            본 약관은 프리즘(이하 “회사”)이 운영하는 EasySite(이하 “서비스”)를
            이용함에 있어 회사와 의뢰인의 권리·의무 및 책임사항을 규정함을
            목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">제2조 (서비스의 범위)</h2>
          <p className="mt-3">
            회사는 의뢰인의 요청에 따라 AI 보조 도구를 활용한 웹사이트 제작
            서비스를 제공합니다. 구체적 범위·기능·일정·비용은 별도의 견적서·계약서로
            정합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">제3조 (계약의 성립)</h2>
          <p className="mt-3">
            의뢰인이 회사의 견적에 동의하고 약정 대금을 결제하면 본 계약이
            성립됩니다. 결제 전까지의 상담·견적·시안 제공은 무료입니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">제4조 (대금 및 환불)</h2>
          <ul className="mt-3 list-inside list-disc space-y-2">
            <li>대금은 견적서에 명시된 금액·일정·방법에 따라 결제합니다.</li>
            <li>제작 착수 전 취소 시 100% 환불, 착수 후 진행 단계별로 환불액을 조정합니다.</li>
            <li>완료·납품 후 환불은 명백한 회사 귀책 사유에 한합니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">제5조 (지적재산권)</h2>
          <p className="mt-3">
            제작된 결과물의 저작재산권은 잔금 완납 시점에 의뢰인에게 양도됩니다.
            단, 회사는 포트폴리오·홍보 목적의 사용 권리를 보유합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">제6조 (책임의 제한)</h2>
          <p className="mt-3">
            회사는 의뢰인이 제공한 자료의 진실성·정확성·합법성에 대해 책임지지
            않습니다. 외부 서비스(호스팅·결제·도메인 등) 장애로 인한 손해는
            해당 서비스 제공자의 약관을 따릅니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">제7조 (분쟁의 해결)</h2>
          <p className="mt-3">
            본 약관과 관련하여 분쟁이 발생한 경우 양 당사자는 신의성실의 원칙에
            따라 협의로 해결합니다. 협의가 불가한 경우 회사 소재지 관할 법원을
            전속 관할로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">사업자 정보</h2>
          <ul className="mt-3 space-y-1">
            <li>상호: 프리즘</li>
            <li>사업자등록번호: 672-35-01596</li>
            <li>대표: 안홍준</li>
            <li>연락처: 010-3782-5418</li>
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
