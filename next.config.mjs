/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // 구 EasySite 메인(/home) 폐기 — 루트(지으리)로 영구 이전. 북마크·옛 링크 방어.
      { source: '/home', destination: '/', permanent: true },

      // 사전등록(/register) 폐기 — 리포지셔닝(프리미엄 스튜디오)으로 사용 안 함.
      // 메인 컨택(자격검증 폼 #contact)으로 흡수. 데이터·테이블(jieuri_preregistrations)은 보존.
      // permanent:false(307) — 추후 정책 변동 여지. 쿼리스트링(utm 등)은 Next 가 자동 보존.
      { source: '/register', destination: '/#contact', permanent: false },

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
