import Image from 'next/image'
import type { PortfolioItem } from '@/config/portfolio'

export function SimilarCases({ items }: { items: PortfolioItem[] }) {
  if (items.length === 0) return null
  return (
    <section className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-8 sm:py-16">
        <div className="text-center">
          <p className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-bold tracking-[0.12em] text-gray-700">
            비슷한 사례
          </p>
          <h2
            className="mt-4 font-extrabold text-gray-900"
            style={{
              fontSize: 'clamp(24px, 4.5vw, 32px)',
              lineHeight: 1.25,
              letterSpacing: '-0.015em',
            }}
          >
            이런 분위기는 어떠세요?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
            실제로 운영 중인 비슷한 사이트들이에요. 클릭해서 둘러보세요.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative aspect-[16/10] bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <div className="p-5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  {item.category}
                </p>
                <p className="mt-1.5 text-base font-bold text-gray-900 sm:text-lg">
                  {item.name}
                </p>
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-gray-600">
                  {item.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
