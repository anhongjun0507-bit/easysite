import { painPoints } from '@/config/pain-points'

export function PainPoints() {
  return (
    <section id="pain-points" className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Heading */}
        <h2 className="text-center text-4xl font-extrabold leading-[1.2] tracking-[-0.025em] text-gray-900 sm:text-5xl">
          혹시 이런 고민 있으세요?
        </h2>

        {/* Cards */}
        <ul className="mx-auto mt-14 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5">
          {painPoints.map((p) => (
            <li
              key={p.id}
              className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8"
            >
              <p className="text-lg font-semibold leading-snug text-gray-900 sm:text-xl">
                <span
                  aria-hidden="true"
                  className="mr-1 align-top text-indigo-300"
                >
                  &ldquo;
                </span>
                {p.quote}
                <span
                  aria-hidden="true"
                  className="ml-1 align-top text-indigo-300"
                >
                  &rdquo;
                </span>
              </p>
              {p.context && (
                <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                  {p.context}
                </p>
              )}
            </li>
          ))}
        </ul>

        {/* Bridge + CTA to next section */}
        <div className="mt-14 flex flex-col items-center gap-4 text-center sm:mt-16">
          <p className="text-lg font-semibold text-gray-900 sm:text-xl">
            맞아요. 그래서 EasySite를 만들었어요.
          </p>
          <a
            href="#differentiators"
            className="group inline-flex items-center gap-1.5 text-base font-semibold text-indigo-600 transition hover:text-indigo-700 sm:text-[17px]"
          >
            어떻게 풀어드리는지 보기
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
