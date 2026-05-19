import type { MetadataRoute } from 'next'

const SITE_URL = 'https://easysite-sage.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/admin/*',
        '/api',
        '/api/*',
        '/wizard',
        '/wizard/result',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
