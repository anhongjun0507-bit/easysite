import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개인정보처리방침 | EasySite',
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
      <p className="mt-4 text-sm text-gray-500">시행일: 2026년 5월 19일</p>

      <div className="mt-10 space-y-10 text-base leading-relaxed text-gray-700">
        <section>
          <p>
            프리즘(이하 “회사”)은 「개인정보 보호법」을 준수하며, 이용자의
            개인정보를 안전하게 보호하기 위해 다음과 같이 개인정보처리방침을
            수립·공개합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            제1조 (수집하는 개인정보 항목)
          </h2>
          <p className="mt-3">
            회사는 견적 상담 및 서비스 제공을 위해 다음의 최소한의 개인정보를
            수집합니다.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              <strong className="font-semibold text-gray-900">
                필수 항목 (위저드 신청 시)
              </strong>
              : 이름, 전화번호, 이메일, 카카오톡 ID
            </li>
            <li>
              <strong className="font-semibold text-gray-900">
                위저드 응답 내용
              </strong>
              : 업종, 페이지 구성, 필요한 기능, 예산 범위 등 견적 산출을 위해
              직접 입력하신 정보
            </li>
            <li>
              <strong className="font-semibold text-gray-900">
                자동 수집 항목
              </strong>
              : IP 주소, 브라우저·디바이스 정보, 접속 시각, 쿠키
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            제2조 (개인정보의 수집·이용 목적)
          </h2>
          <p className="mt-3">
            수집한 개인정보는 다음 목적으로만 이용하며, 목적이 변경될 경우 별도의
            동의를 받습니다.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>견적 안내 및 시안 제공</li>
            <li>제작 의뢰 관련 상담 및 응대</li>
            <li>서비스 운영 및 품질 개선 (식별 정보 제외 통계 분석)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            제3조 (개인정보의 보유·이용 기간)
          </h2>
          <p className="mt-3">
            회사는 수집한 개인정보를 수집·이용 목적이 달성될 때까지 보유하며,
            보유 기간은 다음과 같습니다.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              <strong className="font-semibold text-gray-900">
                견적·상담 정보
              </strong>
              : 수집일로부터 3년 또는 정보주체가 동의 철회를 요청한 시점까지
            </li>
            <li>
              관계 법령에 따라 보존해야 하는 경우 해당 법령이 정한 기간 동안 보관
            </li>
          </ul>
          <p className="mt-3">
            보유 기간이 경과하거나 처리 목적이 달성된 개인정보는 지체 없이
            파기합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            제4조 (개인정보의 제3자 제공)
          </h2>
          <p className="mt-3">
            회사는 정보주체의 개인정보를 제3자에게 제공하지 않습니다. 다만,
            정보주체의 사전 동의가 있거나 법령에 특별한 규정이 있는 경우에는
            예외로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            제5조 (개인정보 처리의 위탁)
          </h2>
          <p className="mt-3">
            회사는 안정적인 서비스 제공을 위해 다음과 같이 개인정보 처리 업무를
            위탁하고 있습니다.
          </p>
          <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-sm sm:text-base">
              <thead className="bg-gray-50 text-left text-gray-900">
                <tr>
                  <th className="px-4 py-3 font-semibold">수탁자</th>
                  <th className="px-4 py-3 font-semibold">위탁 업무</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    Anthropic, PBC
                  </td>
                  <td className="px-4 py-3">
                    Claude API를 통한 AI 생성 콘텐츠 처리
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    Supabase, Inc.
                  </td>
                  <td className="px-4 py-3">
                    데이터베이스·인증·스토리지 운영
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    Vercel, Inc.
                  </td>
                  <td className="px-4 py-3">웹사이트 호스팅 및 콘텐츠 전송</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    Telegram FZ-LLC
                  </td>
                  <td className="px-4 py-3">
                    신규 리드 및 챗봇 의향 알림 발송 (이름·연락처·견적 요약
                    정보 포함)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            회사는 위탁 계약 체결 시 「개인정보 보호법」 제26조에 따라 위탁 업무
            수행 목적 외 개인정보 처리 금지, 안전성 확보 조치, 재위탁 제한 등을
            계약서에 명시하고 위탁 처리 현황을 관리·감독합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            제5조의2 (개인정보의 국외 이전)
          </h2>
          <p className="mt-3">
            회사는 안정적인 서비스 제공을 위해 다음과 같이 개인정보를 국외로
            이전하고 있습니다.
          </p>
          <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-sm sm:text-base">
              <thead className="bg-gray-50 text-left text-gray-900">
                <tr>
                  <th className="px-4 py-3 font-semibold">이전받는 자</th>
                  <th className="px-4 py-3 font-semibold">이전 국가</th>
                  <th className="px-4 py-3 font-semibold">이전 목적</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    Anthropic, PBC
                  </td>
                  <td className="px-4 py-3">미국</td>
                  <td className="px-4 py-3">Claude API 기반 AI 처리</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    Supabase, Inc.
                  </td>
                  <td className="px-4 py-3">미국</td>
                  <td className="px-4 py-3">데이터베이스 운영</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    Vercel, Inc.
                  </td>
                  <td className="px-4 py-3">미국</td>
                  <td className="px-4 py-3">웹사이트 호스팅</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    Telegram FZ-LLC
                  </td>
                  <td className="px-4 py-3">아랍에미리트</td>
                  <td className="px-4 py-3">알림 발송</td>
                </tr>
              </tbody>
            </table>
          </div>
          <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-[180px_1fr]">
            <dt className="font-semibold text-gray-900">이전 일시·방법</dt>
            <dd>서비스 이용 시점에 네트워크를 통한 자동 전송</dd>
            <dt className="font-semibold text-gray-900">이전 항목</dt>
            <dd>제1조에 명시된 수집 항목</dd>
            <dt className="font-semibold text-gray-900">보유·이용 기간</dt>
            <dd>위탁 계약 종료 또는 정보주체의 동의 철회 시까지</dd>
          </dl>
          <p className="mt-4 text-sm text-gray-600">
            정보주체는 본 국외 이전을 거부할 권리가 있으며, 거부 시 일부 또는
            전부의 서비스 이용이 제한될 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            제6조 (정보주체의 권리·의무 및 행사 방법)
          </h2>
          <p className="mt-3">
            정보주체는 회사에 대해 언제든지 다음의 권리를 행사할 수 있습니다.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>개인정보 열람 요구</li>
            <li>오류 등이 있을 경우 정정·삭제 요구</li>
            <li>처리 정지 요구</li>
            <li>개인정보 수집·이용 동의의 철회</li>
          </ul>
          <p className="mt-3">
            권리 행사는 아래 제8조의 연락처로 서면, 이메일 등을 통해 요청하실
            수 있으며, 회사는 지체 없이 조치합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            제7조 (개인정보의 안전성 확보 조치)
          </h2>
          <p className="mt-3">
            회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고
            있습니다.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>관리적 조치: 개인정보 접근 권한 최소화, 정기 점검</li>
            <li>
              기술적 조치: 전송 구간 암호화(HTTPS), 데이터베이스 접근 통제
            </li>
            <li>물리적 조치: 외부 위탁 시 안전한 인프라(Supabase·Vercel) 사용</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            제8조 (개인정보 보호 책임자 및 문의처)
          </h2>
          <p className="mt-3">
            회사는 개인정보 처리에 관한 업무를 총괄하여 책임지는 개인정보 보호
            책임자를 다음과 같이 지정하고 있습니다.
          </p>
          <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-[180px_1fr]">
            <dt className="font-semibold text-gray-900">상호</dt>
            <dd>프리즘</dd>
            <dt className="font-semibold text-gray-900">개인정보 보호 책임자</dt>
            <dd>안홍준 (대표)</dd>
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
          </dl>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            제9조 (권익 침해 구제 방법)
          </h2>
          <p className="mt-3">
            개인정보 침해로 인한 신고나 상담이 필요하신 경우 아래 기관에
            문의하실 수 있습니다.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>개인정보분쟁조정위원회 — 1833-6972 (privacy.go.kr)</li>
            <li>개인정보침해신고센터 — 118 (privacy.kisa.or.kr)</li>
            <li>대검찰청 — 1301 (spo.go.kr)</li>
            <li>경찰청 — 182 (ecrm.police.go.kr)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            부칙 (시행일)
          </h2>
          <p className="mt-3">
            본 개인정보처리방침은 2026년 5월 19일부터 시행합니다.
          </p>
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
