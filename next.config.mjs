/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // 구 EasySite 메인(/home) 폐기 — 루트(지으리)로 영구 이전. 북마크·옛 링크 방어.
      { source: '/home', destination: '/', permanent: true },

      // ── 광고 안전망(safety net) ─────────────────────────────────────────
      // 광고 도착지 정본: /lp/web(웹사이트 제작)·/lp/app(앱 개발)·/service/* — 모두 200 정상.
      // 아래는 광고/북마크가 "짧은 URL"(예: jieuri.com/app)을 final URL 로 썼을 경우의
      // 보호용 임시 리다이렉트. 짧은 경로는 라우트가 없어 원래 404 → 메시지 매칭되는 LP 로 보냄.
      // permanent:false(307) — 임시 응급조치라 캐시 고정 안 함(추후 실제 페이지 신설 시 회수 용이).
      // UTM 등 쿼리스트링은 Next 가 destination 으로 자동 보존 → 전환추적 유지.
      { source: '/web', destination: '/lp/web', permanent: false },
      { source: '/website', destination: '/lp/web', permanent: false },
      { source: '/app', destination: '/lp/app', permanent: false },
      { source: '/lp', destination: '/lp/web', permanent: false },
      { source: '/service', destination: '/service/website', permanent: false },
    ]
  },
}

export default nextConfig
