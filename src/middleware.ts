import { NextResponse, type NextRequest } from 'next/server'
import { SITE_URL } from '@/lib/site'

// ⚠️ 이 프로젝트는 src/ 디렉터리를 쓰므로 미들웨어는 반드시 src/middleware.ts 에 있어야 한다.
//    (루트 middleware.ts 는 Next 가 무시 → 기존 root 미들웨어는 그동안 동작하지 않았음)
//
// 지으리(jieuri)가 전역 기본 브랜드 — 모든 호스트에서 루트(/)는 지으리 사전등록 랜딩을 보여준다.
// (구 EasySite 메인은 폐기 — /home 은 next.config 에서 / 로 리다이렉트)
// 참고: Supabase updateSession 은 위치 문제로 원래 미동작 상태였고, 여기서도 켜지 않는다
//       (Supabase 일시중지 시 전체 장애 방지).

// 구 EasySite 배포 도메인 — 접근 시 jieuri.com 동일 경로로 301 영구 이전.
const OLD_HOSTS = new Set([
  'easysite-sage.vercel.app',
  'www.easysite-sage.vercel.app',
])

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const host = (
    request.headers.get('x-forwarded-host') ??
    request.headers.get('host') ??
    ''
  )
    .toLowerCase()
    .split(':')[0]

  // 1) 구 도메인(easysite-sage.vercel.app) → jieuri.com 같은 경로로 301 영구 리다이렉트.
  //    Vercel 배포/프로젝트는 그대로 두고(같은 프로젝트라 지우면 jieuri.com 도 죽음),
  //    도메인 레벨에서만 정본을 jieuri.com 으로 통일 → 구 도메인 중복 색인도 301로 자연 해소.
  if (OLD_HOSTS.has(host)) {
    return NextResponse.redirect(new URL(`${pathname}${search}`, SITE_URL), 301)
  }

  // 2) 루트(/) → 지으리 랜딩(/jieuri)으로 내부 rewrite. URL은 / 그대로 유지(리다이렉트 아님).
  //    GET뿐 아니라 폼의 서버 액션 POST(/로 전송)도 같은 규칙으로 /jieuri 라우트에 도달.
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/jieuri'
    return NextResponse.rewrite(url)
  }

  // 그 외 모든 라우트(/wizard·/pricing·/portfolio·/consult·/pay·/admin·/jieuri 하위 등)는 그대로 통과.
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
