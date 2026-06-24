// /jieuri(=홈) OG — 공용 brand OG 사용(루트와 동일 디자인으로 통일).
import { renderBrandOg, OG_ALT } from '@/lib/og'

export const alt = OG_ALT
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return renderBrandOg()
}
