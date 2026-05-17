import { painPoints } from '@/config/pain-points'
import { differentiators } from '@/config/differentiators'

// PainPoint와 그에 대응하는 Differentiator를 1:1로 묶음
// answersPainPointId가 누락된 경우 빌드 타임에 즉시 실패 (데이터 정합성 보장)
const pairs = painPoints.map((pain) => {
  const answer = differentiators.find((d) => d.answersPainPointId === pain.id)
  if (!answer) {
    throw new Error(
      `Missing differentiator for pain point "${pain.id}" — check src/config/differentiators.ts`,
    )
  }
  return { pain, answer }
})

export function PainSolutions() {
  return (
    <section id="solutions" className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-extrabold leading-[1.2] tracking-[-0.025em] text-gray-900 sm:text-5xl">
            이런 고민,{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              이렇게
            </span>{' '}
            풀어드려요
          </h2>
          <p className="mt-6 text-base leading-relaxed text-gray-600 sm:text-lg">
            사장님이 가장 많이 물어보시는 4가지. 어떻게 풀어드리는지 함께
            보여드릴게요.
          </p>
        </div>

        {/* Q+A pair cards — 2x2 grid */}
        <ul className="mx-auto mt-14 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5">
          {pairs.map(({ pain, answer }) => (
            <li
              key={pain.id}
              className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 sm:p-8"
            >
              {/* Pain (Q) */}
              <div>
                <p className="text-lg font-semibold leading-snug text-gray-900 sm:text-xl">
                  <span
                    aria-hidden="true"
                    className="mr-1 align-top text-indigo-300"
                  >
                    &ldquo;
                  </span>
                  {pain.quote}
                  <span
                    aria-hidden="true"
                    className="ml-1 align-top text-indigo-300"
                  >
                    &rdquo;
                  </span>
                </p>
                {pain.context && (
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">
                    {pain.context}
                  </p>
                )}
              </div>

              {/* Divider — quiet gray-200 line */}
              <div
                aria-hidden="true"
                className="my-5 border-t border-gray-200 sm:my-6"
              />

              {/* Solution (A) */}
              <div>
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-indigo-600"
                    fill="none"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </div>
                <p className="text-lg font-bold leading-snug text-gray-900 sm:text-xl">
                  {answer.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">
                  {answer.description}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* Bridge + CTA to next section */}
        <div className="mt-14 flex flex-col items-center gap-4 text-center sm:mt-16">
          <p className="text-lg font-semibold text-gray-900 sm:text-xl">
            이제 어떻게 만들어지는지 보여드릴게요.
          </p>
          <a
            href="#how-it-works"
            className="group inline-flex items-center gap-1.5 text-base font-semibold text-indigo-600 transition hover:text-indigo-700 sm:text-[17px]"
          >
            제작 과정 3단계 보기
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="h-4 w-4 transition group-hover:translate-y-0.5"
            >
              <path
                fill="currentColor"
                d="M8 11.5 3.5 7l1-1L8 9.5 11.5 6l1 1z"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
