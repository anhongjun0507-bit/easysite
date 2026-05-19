import type { MetadataRoute } from 'next'

const SITE_URL = 'https://easysite-sage.vercel.app'

// 법령 페이지 시행일 (terms·privacy) — 사장님 작성 기준일
const LEGAL_DATE = new Date('2026-05-19')

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // /wizard 는 noindex funnel 페이지이므로 sitemap 에서 제외
    {
      url: `${SITE_URL}/pricing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/portfolio`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: LEGAL_DATE,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: LEGAL_DATE,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
