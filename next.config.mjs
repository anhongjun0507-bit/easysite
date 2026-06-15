/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // 구 EasySite 메인(/home) 폐기 — 루트(지으리)로 영구 이전. 북마크·옛 링크 방어.
      { source: '/home', destination: '/', permanent: true },
    ]
  },
}

export default nextConfig
