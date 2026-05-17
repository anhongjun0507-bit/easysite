import { painPoints } from '@/config/pain-points'

export function PainPoints() {
  return (
    <section id="pain-points" className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Heading — 도발/공감 톤 (Linear hero 화법 차용) */}
        <h2 className="mx-auto max-w-2xl text-center text-4xl font-extrabold leading-[1.2] tracking-[-0.025em] text-gray-900 sm:text-5xl">
          혹시 이런 고민,{' '}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            익숙
          </span>
          하세요?
        </h2>

        {/* Cards 2x2 — bg-gray-50 (white 섹션 위에 "들어간" 느낌) */}
        <ul className="mx-auto mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5">
          {painPoints.map((p) => (
            <li
              key={p.id}
              className="rounded-xl border border-gray-200 bg-gray-50 p-6 sm:p-8"
            >
              <span
                aria-hidden="true"
                className="block text-5xl font-extrabold leading-none text-indigo-300 sm:text-6xl"
              >
                &ldquo;
              </span>
              <p className="mt-3 text-lg font-semibold leading-snug text-gray-900 sm:mt-4 sm:text-xl">
                {p.quote}
              </p>
            </li>
          ))}
        </ul>

        {/* Bridge to next section — 다음 섹션이 자연스럽게 답하는 구조 */}
        <p className="mx-auto mt-12 max-w-xl text-center text-lg font-semibold text-gray-900 sm:mt-14 sm:text-xl">
          맞아요.{' '}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            그래서 EasySite
          </span>
          를 만들었어요.
        </p>
      </div>
    </section>
  )
}
