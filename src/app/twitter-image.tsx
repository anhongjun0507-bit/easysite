// Twitter 카드 이미지 — opengraph-image 의 default export 만 재사용
// (alt/size/contentType 은 명시해야 Next.js static analysis 가 인식)
export const alt = '1분 만에 견적, AI가 만든 초안까지 — 지으리'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export { default } from './opengraph-image'
