import { NextResponse, type NextRequest } from 'next/server'
import { SITE_URL } from '@/lib/site'
import { LETTERS_COOKIE_NAME, verifyLettersToken } from '@/lib/letters/auth'

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

// 한일금속 시안 전용 호스트 — 클라이언트에 jieuri.com 을 노출하지 않는 독립 URL.
// 이 호스트에서만 루트(/)가 시안 선택 랜딩이 되고 /a·/b·/c 가 각 시안이 되도록
// /hanil 서브트리로 rewrite 한다. jieuri.com 등 다른 호스트는 전혀 영향받지 않는다.
const DESIGN_HOST = 'hanilmetal.vercel.app'

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const host = (
    request.headers.get('x-forwarded-host') ??
    request.headers.get('host') ??
    ''
  )
    .toLowerCase()
    .split(':')[0]

  // 0) 시안 호스트(hanilmetal.vercel.app) — /hanil 서브트리로 호스트 라우팅.
  //    다른 호스트(jieuri.com 등)는 이 블록을 건너뛰므로 기존 동작 무영향.
  if (host === DESIGN_HOST) {
    // a) 기존에 배포된 /hanil/* 링크(내부 href 포함) → /hanil 을 뗀 깔끔한 주소로 307 정규화.
    //    예: /hanil → /,  /hanil/a → /a,  /hanil/a/greeting → /a/greeting
    if (pathname === '/hanil' || pathname.startsWith('/hanil/')) {
      const url = request.nextUrl.clone()
      url.pathname = pathname.slice('/hanil'.length) || '/'
      return NextResponse.redirect(url, 307)
    }
    // b) 그 외 모든 경로 → /hanil{경로} 로 내부 rewrite(URL 은 깔끔하게 유지).
    //    예: / → /hanil,  /a → /hanil/a,  /b/greeting → /hanil/b/greeting
    const url = request.nextUrl.clone()
    url.pathname = pathname === '/' ? '/hanil' : `/hanil${pathname}`
    return NextResponse.rewrite(url)
  }

  // 0-1) 프라이빗 아카이브(/letters) — 패스코드 쿠키가 없으면 게이트 화면으로 rewrite.
  //      redirect 가 아니라 rewrite 라 주소는 /letters 그대로 유지된다(존재 자체를 덜 드러냄).
  //      /letters/gate 직접 접근은 항상 통과. /api/letters/* 는 matcher 에서 제외되어 무관.
  if (pathname === '/letters' || pathname.startsWith('/letters/')) {
    if (pathname.startsWith('/letters/gate')) return NextResponse.next()
    const token = request.cookies.get(LETTERS_COOKIE_NAME)?.value
    if (!(await verifyLettersToken(token))) {
      const url = request.nextUrl.clone()
      url.pathname = '/letters/gate'
      return NextResponse.rewrite(url)
    }
    return NextResponse.next()
  }

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
    // _next·api·정적 파일(이미지·폰트·favicon 등)은 제외 → 에셋 로딩이 rewrite 로 깨지지 않게 한다.
    '/((?!_next/static|_next/image|api/|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf|eot|css|js|txt|xml|webmanifest)$).*)',
  ],
}
