// 루트 기본 OG — 모든 페이지가 자체 OG 없으면 이걸 상속. 공용 brand OG 사용.
import { renderBrandOg, OG_ALT } from '@/lib/og'

export const alt = OG_ALT
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return renderBrandOg()
}
