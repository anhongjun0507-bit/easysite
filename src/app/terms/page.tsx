import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '이용약관 | EasySite',
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
      <p className="mt-4 text-sm text-gray-500">시행일: 2026년 5월 19일</p>

      <div className="mt-10 space-y-10 text-base leading-relaxed text-gray-700">
        <section>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            제1조 (목적)
          </h2>
          <p className="mt-3">
            본 약관은 프리즘(이하 “회사”)이 운영하는 EasySite(이하 “서비스”)의
            이용 조건과 절차, 회사와 이용자의 권리·의무를 정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            제2조 (정의)
          </h2>
          <p className="mt-3">본 약관에서 사용하는 용어의 뜻은 다음과 같습니다.</p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              <strong className="font-semibold text-gray-900">서비스</strong>:
              회사가 운영하는 EasySite 웹사이트(easysite.kr) 및 그에 부속된
              위저드·견적·상담 도구 일체.
            </li>
            <li>
              <strong className="font-semibold text-gray-900">이용자</strong>:
              서비스에 접속하여 견적 신청·상담·제작 의뢰 등을 진행하는 모든 사람.
            </li>
            <li>
              <strong className="font-semibold text-gray-900">위저드</strong>:
              사이트 종류·페이지 수·기능 등을 입력하면 자동으로 견적 초안과 시안
              안내를 받아볼 수 있는 1분 신청 도구.
            </li>
            <li>
              <strong className="font-semibold text-gray-900">견적</strong>:
              위저드 또는 별도 상담을 통해 회사가 제시하는 비용·일정·범위에 대한
              안내(초안 포함).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            제3조 (약관의 효력 및 변경)
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              본 약관은 서비스 화면에 게시하는 것으로 효력이 발생하며, 이용자가
              서비스를 이용하면 본 약관에 동의한 것으로 봅니다.
            </li>
            <li>
              회사는 관련 법령을 위반하지 않는 범위에서 본 약관을 변경할 수
              있으며, 변경된 약관은 시행일 7일 전부터 서비스 내 공지 또는 이메일로
              알려드립니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            제4조 (서비스의 제공)
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              서비스는 회사의 대표(안홍준)가 1인 프리랜서로 운영합니다.
            </li>
            <li>
              현재 회원가입 없이 비회원 기준으로 서비스를 제공합니다.
            </li>
            <li>
              서비스는 연중 무휴 24시간 제공을 원칙으로 하되, 시스템 점검·장애·
              천재지변 등 불가항력적인 사유가 있는 경우 일시 중단될 수 있습니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            제5조 (위저드·견적 결과의 효력)
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              위저드를 통한 견적 결과는 이용자가 입력한 정보를 바탕으로 자동
              생성되는 <strong>참고용 초안</strong>입니다.
            </li>
            <li>
              실제 계약 금액·범위·일정은 별도의 정식 견적서와 계약을 통해
              확정됩니다.
            </li>
            <li>
              회사는 위저드·견적 초안과 실제 계약 금액 사이의 차이로 인한
              책임을 지지 않습니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            제6조 (이용자의 의무)
          </h2>
          <p className="mt-3">이용자는 다음 사항을 준수합니다.</p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>서비스 이용 시 정확한 정보를 제공합니다.</li>
            <li>타인의 이름·전화번호·이메일 등 개인정보를 도용하지 않습니다.</li>
            <li>
              서비스 운영을 방해하거나 다른 이용자에게 피해를 주는 행위를 하지
              않습니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            제7조 (회사의 책임 한계)
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              회사는 위저드·견적 결과가 모든 상황에서 정확하다고 보장하지
              않습니다.
            </li>
            <li>
              회사는 외부 서비스(호스팅·도메인·결제·이메일 등) 장애로 인한 손해에
              대해 책임지지 않습니다.
            </li>
            <li>
              회사는 사전에 공지된 점검 또는 정당한 사유로 서비스를 일시 중단할
              수 있습니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            제8조 (계약)
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              본 약관과 별개로, 정식 제작 계약은 회사가 제시하는 견적서·계약서에
              이용자가 동의하고 착수금을 결제한 시점에 성립합니다.
            </li>
            <li>
              계약의 구체적인 범위·일정·대금 지급 방식은 견적서·계약서에 명시된
              내용을 우선 적용합니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            제9조 (환불 및 해지)
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              1차 시안 확인 후 이용자가 계약 종료를 원하실 경우, 추가 비용 없이
              종료할 수 있습니다.
            </li>
            <li>
              단, 이미 진행된 작업에 대한 착수금은 작업 시간 보상으로 환불되지
              않습니다.
            </li>
            <li>
              회사의 명백한 귀책 사유로 계약이 이행되지 못한 경우에는 별도
              협의를 통해 환불합니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            제10조 (지적재산권 및 사용권)
          </h2>
          <ol className="mt-3 list-decimal space-y-3 pl-6">
            <li>
              본 서비스를 통해 제공되는 위저드, AI 생성 콘텐츠, 산출된 견적서,
              그리고 정식 계약을 통해 제작되는 웹사이트의 코드·디자인·결과물
              일체에 대한 지적재산권은 잔금이 완납되기 전까지 회사(프리즘)에
              귀속됩니다.
            </li>
            <li>
              잔금 완납 후 다음 권리가 이용자에게 이전됩니다.
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>제작된 웹사이트의 사용·운영 권리</li>
                <li>콘텐츠(텍스트·이미지)의 사용 권리</li>
                <li>도메인·호스팅 등 제3자 서비스의 운영 권리</li>
              </ul>
            </li>
            <li>
              다음 권리는 회사가 계속 보유합니다.
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>제작 과정에서 사용된 자체 개발 코드·라이브러리·도구</li>
                <li>재사용 가능한 컴포넌트 및 패턴</li>
                <li>
                  해당 프로젝트를 포트폴리오로 활용할 권리 (회사명·로고·스크린샷
                  사용 포함)
                </li>
              </ul>
            </li>
            <li>
              이용자는 회사의 사전 서면 동의 없이 제작 결과물의 코드를 제3자에게
              재배포·재판매할 수 없습니다. 본 조에서 “서면 동의”는 종이 서명뿐
              아니라 이메일·카카오톡·SMS 등 의사 확인이 가능한 전자적 방법을
              포함합니다.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            제11조 (분쟁의 해결)
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              본 약관과 관련하여 분쟁이 발생한 경우, 양 당사자는 신의성실의
              원칙에 따라 협의로 해결합니다.
            </li>
            <li>
              협의가 이루어지지 않을 경우 의정부지방법원을 전속 관할 법원으로
              합니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            제12조 (사업자 정보)
          </h2>
          <dl className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-[140px_1fr]">
            <dt className="font-semibold text-gray-900">상호</dt>
            <dd>프리즘</dd>
            <dt className="font-semibold text-gray-900">대표</dt>
            <dd>안홍준</dd>
            <dt className="font-semibold text-gray-900">사업자등록번호</dt>
            <dd>672-35-01596</dd>
            <dt className="font-semibold text-gray-900">연락처</dt>
            <dd>
              <a
                href="tel:01037825418"
                className="text-indigo-600 transition hover:text-indigo-700"
              >
                010-3782-5418
              </a>
            </dd>
            <dt className="font-semibold text-gray-900">이메일</dt>
            <dd>
              <a
                href="mailto:hjan040507@gmail.com"
                className="text-indigo-600 transition hover:text-indigo-700"
              >
                hjan040507@gmail.com
              </a>
            </dd>
            <dt className="font-semibold text-gray-900">입금계좌</dt>
            <dd>우리은행 1002-858-580385 (예금주 안홍준)</dd>
          </dl>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            부칙 (시행일)
          </h2>
          <p className="mt-3">본 약관은 2026년 5월 19일부터 시행합니다.</p>
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
