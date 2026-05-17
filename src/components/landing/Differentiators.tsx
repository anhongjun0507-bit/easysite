import { differentiators } from '@/config/differentiators'

export function Differentiators() {
  return (
    <section id="differentiators" className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-extrabold leading-[1.2] tracking-[-0.025em] text-gray-900 sm:text-5xl">
            EasySite는 이렇게{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              다릅니다
            </span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-gray-600 sm:text-lg">
            앞에서 말씀하신 4가지 고민, 하나하나 어떻게 풀어드리는지
            알려드릴게요.
          </p>
        </div>

        {/* Answer cards — same 2x2 grid as PainPoints (visual 1:1 rhyme) */}
        <ul className="mx-auto mt-14 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5">
          {differentiators.map((d) => (
            <li
              key={d.id}
              className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8"
            >
              {/* Check icon (mirrors PainPoints' quote marks — but as confident answer) */}
              <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
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

              <h3 className="text-lg font-bold leading-snug text-gray-900 sm:text-xl">
                {d.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                {d.description}
              </p>
            </li>
          ))}
        </ul>

        {/* Bridge + CTA to next section (제작 과정 3단계) */}
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
