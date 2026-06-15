// 사이트 정본(canonical) 도메인 — canonical·OG·sitemap·robots, 그리고 결제/알림 링크의 단일 기준.
// 값은 NEXT_PUBLIC_SITE_URL 로 주입하며, 미설정 시 https://jieuri.com 으로 폴백한다.
// 도메인을 바꿀 일이 생기면 이 env(또는 아래 폴백) 한 곳만 교체하면 전 사이트에 반영된다.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://jieuri.com'
).replace(/\/+$/, '')

/** 서비스(브랜드) 이름 */
export const SITE_NAME = '지으리'
/** 운영 주체(사업자) */
export const SITE_OPERATOR = '프리즘'
