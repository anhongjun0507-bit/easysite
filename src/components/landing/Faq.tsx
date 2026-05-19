import { faqItems } from '@/config/faq'

/**
 * Faq — Linear/Stripe 톤의 미니멀 아코디언 (P0 Day 7)
 *
 * 설계 의도:
 *  - 4개 섹션이 이미 카드 시각언어 (PainPoints / Diff / HowItWorks / FinalCta 그라데이션) 로
 *    무거우니, FAQ 는 카드 없이 divider 만으로 시각 피로 해소
 *  - native <details>/<summary> 사용 → 서버 컴포넌트, JS 0byte, SEO / a11y / 키보드 자동
 *  - 다중 오픈 허용 (사장님이 결제·환불 동시 비교 가능)
 *  - + 아이콘이 열리면 × 로 회전 (60대도 직관적 — 닫힘=+, 열림=×)
 */
export function Faq() {
  return (
    <section id="faq" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
            FAQ
          </p>
          <h2 className="mt-3 text-4xl font-bold leading-[1.22] tracking-[-0.015em] text-gray-900 sm:text-5xl">
            자주 묻는 질문
          </h2>
          <p className="mt-6 text-base leading-relaxed text-gray-700 sm:text-lg">
            계약 전에 가장 많이 받는 질문 6개 모았어요.
          </p>
        </div>

        <div className="mx-auto mt-14 border-t border-gray-200 sm:mt-16">
          {faqItems.map((item) => (
            <details
              key={item.id}
              className="group/item border-b border-gray-200"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 outline-none transition hover:text-indigo-700 focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-4 sm:py-7 [&::-webkit-details-marker]:hidden">
                <span className="text-base font-semibold leading-snug text-gray-900 group-hover/item:text-indigo-700 sm:text-lg">
                  {item.question}
                </span>

                {/* + → × 회전 (열리면 45deg) */}
                <span
                  aria-hidden="true"
                  className="relative mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center text-gray-500 transition duration-200 ease-emphasized group-open/item:rotate-45 group-open/item:text-indigo-600 sm:h-7 sm:w-7"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-full w-full"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </span>
              </summary>

              <div className="pb-6 pr-10 text-sm leading-relaxed text-gray-700 sm:pb-7 sm:text-base">
                {item.answer}
              </div>
            </details>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-gray-600 sm:mt-14 sm:text-base">
          더 궁금한 게 있으세요?{' '}
          <a
            href="mailto:hjan040507@gmail.com"
            className="font-semibold text-indigo-600 underline-offset-4 hover:underline"
          >
            메일로 편하게 물어보세요
          </a>
        </p>
      </div>
    </section>
  )
}
