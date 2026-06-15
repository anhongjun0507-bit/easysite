import { NextResponse, type NextRequest } from 'next/server'

// ⚠️ 이 프로젝트는 src/ 디렉터리를 쓰므로 미들웨어는 반드시 src/middleware.ts 에 있어야 한다.
//    (루트 middleware.ts 는 Next 가 무시 → 기존 root 미들웨어는 그동안 동작하지 않았음)
//
// 지으리(jieuri)가 전역 기본 브랜드 — 모든 호스트에서 루트(/)는 지으리 사전등록 랜딩을 보여준다.
// (구브랜드 EasySite 메인 7섹션은 /home 으로 보존 — 견적/위저드/포트폴리오 동선 유지용)
// 참고: Supabase updateSession 은 위치 문제로 원래 미동작 상태였고, 여기서도 켜지 않는다
//       (Supabase 일시중지 시 전체 장애 방지).

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 루트(/) → 지으리 랜딩(/jieuri)으로 내부 rewrite. URL은 / 그대로 유지(리다이렉트 아님).
  // GET뿐 아니라 폼의 서버 액션 POST(/로 전송)도 같은 규칙으로 /jieuri 라우트에 도달.
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/jieuri'
    return NextResponse.rewrite(url)
  }

  // 그 외 모든 라우트(/home·/wizard·/pricing·/portfolio·/consult·/pay·/admin·/jieuri 하위 등)는 그대로 통과.
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
