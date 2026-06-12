import { NextResponse, type NextRequest } from 'next/server'

// ⚠️ 이 프로젝트는 src/ 디렉터리를 쓰므로 미들웨어는 반드시 src/middleware.ts 에 있어야 한다.
//    (루트 middleware.ts 는 Next 가 무시 → 기존 root 미들웨어는 그동안 동작하지 않았음)

// 지으리 전용 호스트 — 이 호스트로 들어오면 EasySite가 아니라 지으리 랜딩만 보여준다.
const JIEURI_HOSTS = new Set(['jieuri.com', 'www.jieuri.com'])

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') ?? '').toLowerCase().split(':')[0]

  // EasySite 도메인 — 기존 동작 그대로 통과 (영향 0).
  // 참고: 루트 middleware 의 Supabase updateSession 은 위치 문제로 원래 미동작 상태였고,
  // 이번 변경에서도 새로 켜지 않는다(easysite 영향 0 + Supabase 일시중지 시 전체 장애 방지).
  if (!JIEURI_HOSTS.has(host)) {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl

  // 루트(/) → 지으리 랜딩으로 내부 rewrite. URL은 jieuri.com 그대로 유지(리다이렉트 아님).
  // GET뿐 아니라 폼의 서버 액션 POST(/로 전송)도 같은 규칙으로 /jieuri 라우트에 도달.
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/jieuri'
    return NextResponse.rewrite(url)
  }

  // /jieuri 하위(OG·트위터 이미지 등)와 메타/엔드포인트 라우트는 그대로 통과.
  if (
    pathname.startsWith('/jieuri/') ||
    pathname.startsWith('/api/') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/opengraph-image' ||
    pathname === '/twitter-image' ||
    pathname === '/icon' ||
    pathname === '/apple-icon'
  ) {
    return NextResponse.next()
  }

  // 그 외(= /jieuri 직접 접근, EasySite의 다른 페이지 라우트)는 루트로 정리.
  // 지으리 도메인에는 랜딩 한 장만 노출 → EasySite 라우트 누출 차단.
  const url = request.nextUrl.clone()
  url.pathname = '/'
  url.search = ''
  return NextResponse.redirect(url, 307)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
