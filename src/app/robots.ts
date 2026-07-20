import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

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
        '/lp',
        '/lp/*',
        '/hanil',
        '/hanil/*',
        '/letters',
        '/letters/*',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
