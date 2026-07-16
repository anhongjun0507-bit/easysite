import type { Metadata } from 'next'

// 클라 검토용 시안 — 검색 색인 차단(robots.ts 와 2중). 하위 전 페이지에 캐스케이드.
export const metadata: Metadata = {
  title: { absolute: '한일금속공업(주) 디자인 시안' },
  robots: { index: false, follow: false },
}

export default function HanilLayout({ children }: { children: React.ReactNode }) {
  return <div className="hanil-root">{children}</div>
}
