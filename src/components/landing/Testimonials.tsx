import { testimonials } from '@/config/testimonials'

export function Testimonials() {
  return (
    <section id="reviews" className="bg-gray-50/70 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-semibold text-gray-700">
            <Stars n={5} className="h-4 w-4" />
            숨고 평점 5.0 · 실제 후기
          </span>
          <h2 className="mt-6 text-3xl font-extrabold leading-[1.2] tracking-[-0.02em] text-gray-900 sm:text-4xl">
            직접 겪어본 사장님들의 이야기
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
            숨고에서 실제로 함께한 사장님들이 남겨주신 후기예요. 한 글자도
            고치지 않은 원문 그대로입니다.
          </p>
        </div>

        {/* Masonry — 길이가 제각각인 후기를 빈틈 없이 채움 */}
        <div className="mt-12 gap-5 sm:columns-2 sm:mt-14 lg:columns-3">
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className="mb-5 break-inside-avoid rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <Stars n={t.rating} className="h-4 w-4" />
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  {t.category}
                </span>
              </div>

              <blockquote className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-gray-700">
                {t.body}
              </blockquote>

              <figcaption className="mt-4 flex items-center gap-2 text-sm">
                <span className="font-bold text-gray-900">{t.author}</span>
                <span aria-hidden="true" className="text-gray-300">
                  ·
                </span>
                <span className="tabular-nums text-gray-500">{t.date}</span>
              </figcaption>

              {t.tags.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {t.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function Stars({ n, className }: { n: number; className?: string }) {
  return (
    <span
      className="inline-flex items-center gap-0.5"
      role="img"
      aria-label={`별점 ${n.toFixed(1)}점 만점에 5점`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={`${className ?? 'h-4 w-4'} ${i < n ? 'fill-amber-500' : 'fill-gray-200'}`}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.952a1 1 0 00.95.69h4.155c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.287 3.952c.3.922-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.175 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.287-3.952a1 1 0 00-.364-1.118L2.572 9.38c-.783-.57-.38-1.81.588-1.81h4.155a1 1 0 00.951-.69l1.286-3.952z" />
        </svg>
      ))}
    </span>
  )
}
